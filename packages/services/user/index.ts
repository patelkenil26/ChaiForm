import { randomBytes, createHmac } from 'node:crypto'
import { db, eq } from "@repo/database";
import { createUserWithEmailAndPasswordInput, CreateUserWithEmailAndPasswordInputType, generateUserTokenPayload, GenerateUserTokenPayloadType, signInUserWithEmailAndPasswordInput, SignInUserWithEmailAndPasswordInputType } from "./model";
import { usersTable } from "@repo/database/models/user"
import { env } from '../env';
import * as JWT from 'jsonwebtoken';

class UserService {

  private async getUserByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email))
    if (!result || result.length === 0) return null;
    return result[0];
  }

  private async generateHash(salt: string, password: string) {
    return createHmac('sha256', salt).update(password).digest('hex')
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
      throw new Error(`Invalid Token`)
    }
  }

  public async getUserInfoById(id: string) {
    const user = await db.select({
      id: usersTable.id,
      email: usersTable.email,
      fullName: usersTable.fullName,
      profileImageUrl: usersTable.profileImageUrl,
    }).from(usersTable).where(eq(usersTable.id, id))

    if (!user || user.length === 0) throw new Error(`User with ID ${id} does not exists`)

    return user[0]!
  }

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
    const { fullName, email, password } = await createUserWithEmailAndPasswordInput.parseAsync(payload);

    // check if user is already existing or not 
    const existingUserWithEmail = await this.getUserByEmail(email);
    if (existingUserWithEmail) throw new Error(`user with email ${email} already exists`);

    // calculate salt and hash the password
    const salt = randomBytes(16).toString('hex')
    const hash = await this.generateHash(salt, password);

    // Create user in DB
    const userInsertResult = await db.insert(usersTable).values({ email, fullName, password: hash, salt }).returning({
      id: usersTable.id
    })

    if (!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id) throw new Error(`something went wrong while creating a user`)

    const userId = userInsertResult[0].id
    const { token } = await this.generateUserToken({ id: userId })

    return {
      id: userId,
      token
    }
  }

  public async signInUserWithEmailAndPassword(payload: SignInUserWithEmailAndPasswordInputType) {
    const { email, password } = await signInUserWithEmailAndPasswordInput.parseAsync(payload);

    const existingUser = await this.getUserByEmail(email);
    if (!existingUser) throw new Error(`User with email ${email} does not exists`)

    if (!existingUser.password || !existingUser.salt) throw new Error(`Invalid authentication method`)

    const hash = await this.generateHash(existingUser.salt, password);

    if (hash !== existingUser.password) throw new Error(`Invalid email address or password`)

    const { token } = await this.generateUserToken({ id: existingUser.id })

    return {
      id: existingUser.id,
      token
    }
  }

  public async verifyAndDecodeUserToken(token: string) {
    const { id } = await this.verifyUserToken(token);
    return { id };
  }
}

export default UserService;
