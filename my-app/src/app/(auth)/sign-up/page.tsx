'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { useDebounceValue } from "usehooks-ts"

import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"
import { signUPSchema } from "@/schemas/signUpSchema"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { set } from "mongoose"

function page() {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debouncedUsername= useDebounceValue(username, 300)
    const router = useRouter()

    // Zod Implementation

    const form = useForm({
        resolver: zodResolver(signUPSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        }
    })

    useEffect(() => {
        const checkUsernameUnique = async() => {
            if(debouncedUsername){
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                   const response = await axios.get(`/api/auth/check-username-unique?username=${debouncedUsername}`)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ?? 'Error checking username'
                    )
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique()
    }, [debouncedUsername])

    const onSubmit = async(data : z.infer<typeof signUPSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('api/sign-up', data)
            toast("Success", {
                 description: response.data.message,
        });

        router.replace(`/verify/${username}`)
        setIsSubmitting(false)
        } catch (error) {
            console.error("Error during sign up:", error)
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message
            toast("Sign-Up Failed", {
                description: errorMessage || 'An unexpected error occurred during sign-up.',
            })
            setIsSubmitting(false)
        }
    }

  return (
    <div>
      
    </div>
  )
}

export default page

