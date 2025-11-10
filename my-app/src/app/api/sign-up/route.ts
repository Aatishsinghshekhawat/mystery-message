import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { success } from "zod";

export async function POST(request:Response) {
    try {
        const {username , email , password } =  await request.json()
        const existingUserVerifiedByUsername = await UserModel.
        findOne({
            username,
            isVerified: true
        })

        if(existingUserVerifiedByUsername) {
            return Response.json({
                success:false,
                message: "Username already taken"
            },{status: 500})
        }

        const existingUserByEmail = await 
        UserModel.findOne({ email })

        const verifyCode = Math.floor(100000 + Math.random()* 900000).toString()

        if( existingUserByEmail) {
            if(existingUserByEmail.isVerified){
                return Response.json({
                success:false,
                message: "User already exist with this Email"
            }, {status: 400})
            } else{
                const hashedPassword = await bcrypt.hash(password , 10)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 86400000);
                await existingUserByEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 24 )

            const newUser =  new UserModel ({
                username,
                email,
                password : hashedPassword,
                verifyCode,
                verifyCodeExpiry : expiryDate,
                isVerified : false,
                isAcceptingMessage : true,
                messages : []
            })

            await newUser.save()
        }

        // Send verification Email

        const emailResponse = await sendVerificationEmail(
            username,
            email,
            verifyCode
        ) 
        if (!emailResponse.success){
            Response.json({
                success:false,
                message: emailResponse.message
            }, {status: 500})
        }

        return Response.json({
                success: true,
                message: "User registered successfully"
            }, {status: 201})

    } catch (error) {
        console.error('Error Registering User', error)
        return Response.json(
            {
                success: false,
                message: "Error Registering User"
            }
        )
    }
}