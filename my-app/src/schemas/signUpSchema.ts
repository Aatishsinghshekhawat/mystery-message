import { email, z } from 'zod'

export const  usernameValidation = z
         .string()
         .min(4, "Username Should be atleast 4 characters")
         .max(10, "sUsername should not exceed 10 characters")
         .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")


export const signUPSchema = z.object({
    username :usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password : z.string().min(6 , {message: " Password must be atleast 6 characters long"} )
})         