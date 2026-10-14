import z from "zod";

export const createUserWithEmailAndPasswordInputModel = z.object({
    fullName: z.string().describe("name of the user"),
    email: z.email().describe("email of the user"),
    password: z.string().describe("password of the user")
})


export const createUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("id of the user created")
})


export const signInUserWithEmailAndPasswordInputModel = z.object({
    email: z.email().describe("email of the user"),
    password: z.string().describe("password of the user")
})


export const signInUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("id of the user created")
})


export const getLoggedInUserInfoInputModel = z.undefined()


export const getLoggedInUserInfoOutputModel = z.object({
    id: z.string().describe('id of the user created'),
    email: z.email().describe('email of the user'),
    fullName: z.string().describe('name of the user'),
    profileImageUrl: z.string().describe('image of the user').optional().nullable(),
})

export const signOutInputModel = z.undefined().optional();

export const signOutOutputModel = z.object({
    success: z.boolean().describe("whether logout was successful"),
    message: z.string().describe("status message"),
});

export const requestPasswordResetInputModel = z.object({
    email: z.string().email().describe("email of the user requesting password reset"),
});

export const requestPasswordResetOutputModel = z.object({
    success: z.boolean().describe("whether request succeeded"),
    message: z.string().describe("status message"),
    resetToken: z.string().optional().describe("password reset token"),
});

export const resetPasswordInputModel = z.object({
    token: z.string().min(1, "Reset token is required").describe("password reset token"),
    newPassword: z.string().min(6, "Password must be at least 6 characters").describe("new password"),
});

export const resetPasswordOutputModel = z.object({
    success: z.boolean().describe("whether password was successfully reset"),
    message: z.string().describe("status message"),
});



