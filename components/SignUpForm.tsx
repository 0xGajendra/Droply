"use client"

import {useForm} from "react-hook-form";
import {  useSignUp } from "@clerk/nextjs";
import {z} from "zod";

//zod custom schema
import { signUpSchema } from "@/schemas/signUpSchema";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";


export default function SignUpForm(){

    const [verifying, setVerifying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null)

    const {isLoaded, setActive, signUp}=useSignUp();

    const {formState: {errors}, handleSubmit, register} = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues:{
            email: "",
            password: "",
            passwordConfirmation: "",
        }
    });

    const onSubmit = async (data: z.infer<typeof signUpSchema>)=>{
        if(!isLoaded) return;
        setIsSubmitting(true);
        setAuthError(null);
        try {
            await signUp.create({
                emailAddress: data.email,
                password: data.password
            })

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code"
            })
            setVerifying(true)
        } catch (error: any) {
            console.error("Signup error: ", error);
            setAuthError(
                error.errors?.[0]?.message || "An Error occured during the signup. please try again"
            )
            
        }
        finally{
            setIsSubmitting(false)
        }
    }


    const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(!isLoaded || !signUp) return
        setIsSubmitting(true);
        setAuthError(null);

        try {
            // await signUp.attemptEmailAddressVerification({
                //1;54
            // })
        } catch (error) {
            
        }
    }

    if(verifying){
        return (
            <h1>
                this is OTP entering field
            </h1>
        )
    }

    return(
        <h1>
            sign up form with email and other fields
        </h1>
    )
}