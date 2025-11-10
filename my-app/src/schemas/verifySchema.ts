import {z} from "zod"

export const verifySchema = z.object({
    code : z.string().length(6, 'Verification Code must me 6 Digits')
})