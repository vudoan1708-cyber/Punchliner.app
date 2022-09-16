import z from "zod";
import {
  INVALID_CONFIRM_ERROR,
  INVALID_EMAIL_ERROR,
  INVALID_PASSWORD_ERROR,
} from "../shared/error";

const RegisterSchema = z.object({
  body: z
    .object({
      // email should be valid and non-empty
      email: z.string().email(INVALID_EMAIL_ERROR),
      // password should be atleast 6 characters
      password: z.string().min(6, INVALID_PASSWORD_ERROR),
      confirm: z.string().min(6, INVALID_PASSWORD_ERROR),
    })
    .refine((data) => data.password === data.confirm, {
      message: INVALID_CONFIRM_ERROR,
      path: ["confirm"],
    }),
});

const LoginSchema = z.object({
  body: z.object({
    // email should be valid and non-empty
    email: z.string().email(INVALID_EMAIL_ERROR),
    // password should be atleast 6 characters
    password: z.string().min(6, INVALID_PASSWORD_ERROR),
  }),
});

export { LoginSchema, RegisterSchema };
