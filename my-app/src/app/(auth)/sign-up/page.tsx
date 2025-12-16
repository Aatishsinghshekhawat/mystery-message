"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios, { AxiosError } from "axios"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useDebounceValue, useDebounceCallback } from "usehooks-ts"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { signUPSchema } from "@/schemas/signUpSchema"
import { ApiResponse } from "@/types/apiResponse"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type SignUpFormValues = z.infer<typeof signUPSchema>

function SignUpPage() {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  //  Correct useDebounceValue – destructure the first value
  const debounced = useDebounceCallback(setUsername, 300)

  const router = useRouter()

  //  Properly typed useForm
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUPSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!username) return

      setIsCheckingUsername(true)
      setUsernameMessage("")

      try {
        const response = await axios.get<ApiResponse>(
          `/api/auth/check-username-unique?username=${username}`,
        )
        setUsernameMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        setUsernameMessage(
          axiosError.response?.data.message ?? "Error checking username",
        )
      } finally {
        setIsCheckingUsername(false)
      }
    }

    checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: SignUpFormValues) => {
    setIsSubmitting(true)
    try {
      //  Important: use absolute path with leading slash
      const response = await axios.post<ApiResponse>("/api/sign-up", data)

      toast("Success", {
        description: response.data.message,
      })

      //  Use the form data username (guaranteed latest)
      router.replace(`/verify/${username}`)
    } catch (error) {
      console.error("Error during sign up:", error)
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message

      toast("Sign-Up Failed", {
        description:
          errorMessage || "An unexpected error occurred during sign-up.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign-Up to start your anonymous adventure</p>
        </div>

        {/*  This Form is from "@/components/ui/form", not react-hook-form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Username */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />

                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}

                  {/* Username check message */}
                  <FormDescription>
                    {isCheckingUsername
                      ? "Checking username..."
                      : usernameMessage || "Choose a unique username."}
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="text-center mt-4">
            <p>
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-blue-600 hover:text-blue-800"
              >
                Sign-in
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default SignUpPage
