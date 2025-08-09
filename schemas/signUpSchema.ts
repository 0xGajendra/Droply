import * as z from "zod";

export const signUpSchema = z
    .object({
        email: z
            .string()
            .min(1,{message: "Email is Required"})
            .email({message: "please enter a valid email"}),
        password: z
            .string()
            .min(1,{message: "Password is Required"})
            .min(8, {message: "password should be minimum of 8 characters"}),
        passwordConfirmation: z
            .string()
            .min(1, {message: "Please confirm your password "}),
    })
    .refine((data)=>
        data.password === data.passwordConfirmation
    , {message: "password do not match",
        path: ["passwordConfirmation"]
    })
