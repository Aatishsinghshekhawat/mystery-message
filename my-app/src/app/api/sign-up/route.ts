import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { success } from "zod";

export async function POST(request: Request) {
    await dbConnect(); // Ensure database connection

    try {
        const { username, email, password } = await request.json()
        console.log("Sign-up attempt:", { username, email });

        const existingUserVerifiedByUsername = await UserModel.
            findOne({
                username,
                isVerified: true
            })

        if (existingUserVerifiedByUsername) {
            console.log("Username already taken:", username);
            return Response.json({
                success: false,
                message: "Username already taken"
            }, { status: 500 })
        }

        const existingUserByEmail = await
            UserModel.findOne({ email })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        console.log("Generated verification code:", verifyCode);

        if (existingUserByEmail) {
            console.log("User with this email already exists, updating...");
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with this Email"
                }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 86400000);

                try {
                    await existingUserByEmail.save()
                    console.log("Updated existing unverified user:", existingUserByEmail.username);
                } catch (saveError) {
                    console.error("Error saving existing user:", saveError);
                    throw saveError;
                }
            }
        } else {
            console.log("Creating new user...");
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 24)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            try {
                await newUser.save()
                console.log("New user created in database:", newUser.username);
            } catch (saveError) {
                console.error("Error creating new user:", saveError);
                throw saveError;
            }
        }

        // Send verification Email
        console.log("Attempting to send verification email to:", email);
        console.log("Email config check:", {
            EMAIL_USER: process.env.EMAIL_USER ? "Set" : "Missing",
            EMAIL_PASS: process.env.EMAIL_PASS ? "Set" : "Missing"
        });

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        console.log("Email response:", emailResponse);

        if (!emailResponse.success) {
            console.error("Email sending failed:", emailResponse.message);
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "User registered successfully"
        }, { status: 201 })

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