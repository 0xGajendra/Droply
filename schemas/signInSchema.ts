import * as z from "zod";

export const signInSchema = z.object({
    email: z
        .string()
        .min(1,{message: "email is required"})
        .email({message: "please enter valid email"}),

    password: z
        .string()
        .min(1,{message: "password is required"})
        .min(8,{message: "password must be 8 characters"})
})