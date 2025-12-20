import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials: Record<string, string> | undefined): Promise<any> {
                await dbConnect()
                try {
                    if (!credentials) {
                        return null;
                    }
                    const identifier = credentials.identifier.trim();
                    const user = await UserModel.findOne({
                        $or: [
                            { email: identifier },
                            { username: identifier }
                        ]
                    })
                    if (!user) {
                        throw new Error('No user found with this email or username')
                    }
                    if (!user.isVerified) {
                        throw new Error('Please verify your account first')
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrect) {
                        return {
                            _id: user._id.toString(),
                            username: user.username,
                            email: user.email,
                            isVerified: user.isVerified,
                            isAcceptingMessage: user.isAcceptingMessage
                        }
                    } else {
                        throw new Error('Incorrect Password')
                    }
                } catch (err: any) {
                    throw new Error(err.message || err)
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }
            return session
        }
    },

    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}