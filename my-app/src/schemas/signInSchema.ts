import {z} from "zod"

export const singhInSchema = z.object({
    identifier : z.string(),
    password : z.string(),
})