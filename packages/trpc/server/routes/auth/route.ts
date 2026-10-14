
import { signInUserWithEmailAndPasswordInput } from "@repo/services/user/model";
import { userService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createUserWithEmailAndPasswordInputModel,
  createUserWithEmailAndPasswordOutputModel,
  getLoggedInUserInfoInputModel,
  getLoggedInUserInfoOutputModel,
  signInUserWithEmailAndPasswordInputModel,
  signInUserWithEmailAndPasswordOutputModel,
  signOutInputModel,
  signOutOutputModel,
  requestPasswordResetInputModel,
  requestPasswordResetOutputModel,
  resetPasswordInputModel,
  resetPasswordOutputModel,
} from "./model";
import { clearAuthenticationCookie, setAuthenticationCookie } from "../../utils/cookie";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({

  createUserWithEmailAndPassword: publicProcedure.meta({
    openapi: {
      method: 'POST',
      path: getPath('/createUserWithEmailAndPassword'),
      tags: TAGS
    }
  })
    .input(createUserWithEmailAndPasswordInputModel)
    .output(createUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { fullName, email, password } = input

      const { id, token } = await userService.createUserWithEmailAndPassword({
        fullName, email, password
      })

      setAuthenticationCookie(ctx, token)

      return {
        id
      }
    }),

  signInUserWithEmailAndPassword: publicProcedure.meta({
    openapi: {
      method: 'POST',
      path: getPath('/signInUserWithEmailAndPassword'),
      tags: TAGS
    }
  })
    .input(signInUserWithEmailAndPasswordInputModel)
    .output(signInUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const { id, token } = await userService.signInUserWithEmailAndPassword({ email, password })

      setAuthenticationCookie(ctx, token);

      return {
        id
      }
    }),

  signOut: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: getPath('/signOut'),
        tags: TAGS
      }
    })
    .input(signOutInputModel)
    .output(signOutOutputModel)
    .mutation(async ({ ctx }) => {
      clearAuthenticationCookie(ctx);

      return {
        success: true,
        message: "Successfully signed out",
      };
    }),

  getLoggedInUserInfo: authenticatedProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: getPath('/getLoggedInUserInfo'),
        tags: TAGS,
        protect: true
      }
    })
    .input(getLoggedInUserInfoInputModel)
    .output(getLoggedInUserInfoOutputModel)
    .query(async ({ ctx }) => {
      const { id, email, fullName, profileImageUrl } = await userService.getUserInfoById(ctx.user.id)

      return {
        id,
        email,
        fullName,
        profileImageUrl
      }
    }),

  requestPasswordReset: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: getPath('/requestPasswordReset'),
        tags: TAGS
      }
    })
    .input(requestPasswordResetInputModel)
    .output(requestPasswordResetOutputModel)
    .mutation(async ({ input }) => {
      const result = await userService.requestPasswordReset({ email: input.email });
      return result;
    }),

  resetPassword: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: getPath('/resetPassword'),
        tags: TAGS
      }
    })
    .input(resetPasswordInputModel)
    .output(resetPasswordOutputModel)
    .mutation(async ({ input }) => {
      const result = await userService.resetPassword({
        token: input.token,
        newPassword: input.newPassword,
      });
      return result;
    }),

});
