import { db, eq } from "@repo/database";
import { logger } from "@repo/logger";
import { generateSalt, generateHash } from "../utils/crypto";
import {
  createUserWithEmailAndPasswordInput,
  CreateUserWithEmailAndPasswordInputType,
  generateUserTokenPayload,
  GenerateUserTokenPayloadType,
  signInUserWithEmailAndPasswordInput,
  SignInUserWithEmailAndPasswordInputType,
  requestPasswordResetInput,
  RequestPasswordResetInputType,
  resetPasswordInput,
  ResetPasswordInputType,
} from "./model";
import { usersTable } from "@repo/database/models/user";
import { env } from "../env";
import * as JWT from "jsonwebtoken";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  DatabaseConnectionError,
  AppError,
} from "../errors";

class UserService {
  private async getUserByEmail(email: string) {
    try {
      const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
      if (!result || result.length === 0) return null;
      return result[0];
    } catch (err: unknown) {
      logger.error("[UserService] Database query error in getUserByEmail", { error: err });
      throw new DatabaseConnectionError();
    }
  }

  private async generateUserToken(payload: GenerateUserTokenPayloadType) {
    const { id } = await generateUserTokenPayload.parseAsync(payload);
    const token = JWT.sign({ id }, env.JWT_SECRET);
    return { token };
  }

  private async verifyUserToken(token: string): Promise<GenerateUserTokenPayloadType> {
    try {
      const verificationResult = JWT.verify(token, env.JWT_SECRET) as GenerateUserTokenPayloadType;
      return verificationResult;
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired session token");
    }
  }

  public async getUserInfoById(id: string) {
    let user;
    try {
      user = await db
        .select({
          id: usersTable.id,
          email: usersTable.email,
          fullName: usersTable.fullName,
          profileImageUrl: usersTable.profileImageUrl,
        })
        .from(usersTable)
        .where(eq(usersTable.id, id));
    } catch (err: unknown) {
      logger.error("[UserService] Database query error in getUserInfoById", { error: err });
      throw new DatabaseConnectionError();
    }

    if (!user || user.length === 0) throw new NotFoundError(`User with ID ${id} does not exist`);

    return user[0]!;
  }

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
    const { fullName, email, password } =
      await createUserWithEmailAndPasswordInput.parseAsync(payload);

    // check if user is already existing or not
    const existingUserWithEmail = await this.getUserByEmail(email);
    if (existingUserWithEmail) throw new ConflictError(`User with email ${email} already exists`);

    // calculate salt and hash the password
    const salt = generateSalt(16);
    const hash = generateHash(salt, password);

    // Create user in DB
    let userInsertResult;
    try {
      userInsertResult = await db
        .insert(usersTable)
        .values({ email, fullName, password: hash, salt })
        .returning({
          id: usersTable.id,
        });
    } catch (err: unknown) {
      logger.error("[UserService] Database query error in createUserWithEmailAndPassword", {
        error: err,
      });
      throw new DatabaseConnectionError();
    }

    if (!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id)
      throw new AppError("Something went wrong while creating a user", "INTERNAL_SERVER_ERROR");

    const userId = userInsertResult[0].id;
    const { token } = await this.generateUserToken({ id: userId });

    return {
      id: userId,
      token,
    };
  }

  public async signInUserWithEmailAndPassword(payload: SignInUserWithEmailAndPasswordInputType) {
    const { email, password } = await signInUserWithEmailAndPasswordInput.parseAsync(payload);

    const existingUser = await this.getUserByEmail(email);
    if (!existingUser) throw new NotFoundError(`No account found with email ${email}`);

    if (!existingUser.password || !existingUser.salt)
      throw new BadRequestError("Invalid authentication method");

    const hash = generateHash(existingUser.salt, password);

    if (hash !== existingUser.password)
      throw new UnauthorizedError("Invalid email address or password");

    const { token } = await this.generateUserToken({ id: existingUser.id });

    return {
      id: existingUser.id,
      token,
    };
  }

  public async verifyAndDecodeUserToken(token: string) {
    const { id } = await this.verifyUserToken(token);
    return { id };
  }

  public async requestPasswordReset(payload: RequestPasswordResetInputType) {
    const { email } = await requestPasswordResetInput.parseAsync(payload);

    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new NotFoundError(`No account found with email ${email}`);
    }

    // Generate a reset token valid for 30 minutes
    const token = JWT.sign(
      { id: user.id, email: user.email, purpose: "password_reset" },
      env.JWT_SECRET,
      { expiresIn: "30m" },
    );

    return {
      success: true,
      email: user.email,
      resetToken: token,
      message: `Password reset link generated for ${email}`,
    };
  }

  public async resetPassword(payload: ResetPasswordInputType) {
    const { token, newPassword } = await resetPasswordInput.parseAsync(payload);

    let decoded: { id: string; email: string; purpose: string };
    try {
      decoded = JWT.verify(token, env.JWT_SECRET) as { id: string; email: string; purpose: string };
    } catch {
      throw new BadRequestError(
        "Reset token is invalid or has expired. Please request a new link.",
      );
    }

    if (!decoded?.id || decoded.purpose !== "password_reset") {
      throw new BadRequestError("Invalid reset token purpose.");
    }

    const user = await this.getUserInfoById(decoded.id);
    if (!user) {
      throw new NotFoundError("User does not exist.");
    }

    // Generate new salt and password hash
    const salt = generateSalt(16);
    const hash = generateHash(salt, newPassword);

    try {
      await db
        .update(usersTable)
        .set({ password: hash, salt, updatedAt: new Date() })
        .where(eq(usersTable.id, decoded.id));
    } catch (err: unknown) {
      logger.error("[UserService] Database query error in resetPassword", { error: err });
      throw new DatabaseConnectionError();
    }

    return {
      success: true,
      message: "Password has been successfully updated. You can now log in.",
    };
  }
}

export default UserService;
