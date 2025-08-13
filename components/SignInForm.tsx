"use client"

import { signInSchema } from "@/schemas/signInSchema";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {useForm} from "react-hook-form"
import {z} from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function SignInForm(){
    const router = useRouter();
    const {signIn, isLoaded, setActive} = useSignIn()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null)

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email : "",
            password: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>)=>{


        if(!isLoaded){
            return
        }
        setIsSubmitting(true);
        setAuthError(null);
        try {
            const res = await signIn.create({
                identifier: data.email,
                password: data.password
            })

            if(res.status === "complete"){
                await setActive({session: res.createdSessionId})
            }
            else{
                setAuthError("Sign In Error");
                console.log('Error in Sing In');
                
            }

        } catch (error : any) {
            setAuthError(
                error.errors?.[0]?.messsage || "error occured during signin process"
            )
        }
        finally{
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in with the account you've already made.</CardDescription>
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

          {authError && (
            <p className="text-sm text-red-500">{authError}</p>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </CardFooter>
      </form>
    </Card>
    )
}