"use client"

import {useForm} from "react-hook-form";
import {  useSignUp } from "@clerk/nextjs";
import {z} from "zod";

//zod custom schema
import { signUpSchema } from "@/schemas/signUpSchema";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";


export default function SignUpForm(){

    const router = useRouter()

    const [verifying, setVerifying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [authError, setAuthError] = useState<string | null>(null);
    const [verificationError, setVerificationError] = useState<string | null>(null)

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
            const res = await signUp.attemptEmailAddressVerification({
                code: verificationCode
            })
            //todo: console result
            if(res.status === "complete"){
                setActive({session: res.createdSessionId})
                router.push("/dashboard")
            }
            else{
                console.error("Verification incomplete ");
                setVerificationError(
                    "An error occured during verifiction"
                )
                
            }
        } catch (error: any) {
            console.error("verification error: ", error);
            setVerificationError(
                error.errors?.[0]?.message || "An Error occured during the signup. please try again"
            )
        }
        finally{
            setIsSubmitting(false);
        }
    }

    if(verifying){
        return (
            <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>Enter the OTP sent to your email.</CardDescription>
        </CardHeader>
        <form onSubmit={handleVerificationSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="verificationCode">OTP</Label>
              <Input
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter your code"
              />
            </div>
            {verificationError && (
              <p className="text-sm text-red-500">{verificationError}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              Verify
            </Button>
          </CardFooter>
        </form>
      </Card>
        )
    }

    return(
        <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create your account to get started.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="passwordConfirmation">Confirm Password</Label>
            <Input
              id="passwordConfirmation"
              type="password"
              placeholder="********"
              {...register("passwordConfirmation")}
            />
            {errors.passwordConfirmation && (
              <p className="text-sm text-red-500">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>

          {authError && (
            <p className="text-sm text-red-500">{authError}</p>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </CardFooter>
      </form>
    </Card>
    )
}