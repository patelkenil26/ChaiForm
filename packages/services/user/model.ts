import { email, z } from "zod";


export const createUserWithEmailAndPasswordInput = z.object({
  fullName: z.string().describe("Full name of the user"),
  email: z.email().describe("email address of the user"),
  password: z.string().describe("Password of the user")
})

export type CreateUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>

export const generateUserTokenPayload = z.object({
  id: z.string().describe("uuid of the user"),
})

export type GenerateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>

export const signInUserWithEmailAndPasswordInput = z.object({
  email: z.email().describe("email of the user"),
  password: z.string().describe("password of the user")
})

export type SignInUserWithEmailAndPasswordInputType = z.infer<typeof signInUserWithEmailAndPasswordInput>

export const requestPasswordResetInput = z.object({
  email: z.string().email().describe("email address of the user"),
});

export type RequestPasswordResetInputType = z.infer<typeof requestPasswordResetInput>;

export const resetPasswordInput = z.object({
  token: z.string().min(1, "Reset token is required").describe("password reset token"),
  newPassword: z.string().min(6, "Password must be at least 6 characters").describe("new password"),
});

export type ResetPasswordInputType = z.infer<typeof resetPasswordInput>;