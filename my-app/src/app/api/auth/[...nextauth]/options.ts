import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import fs from "fs";
import path from "path";

function logToFile(message: string) {
    const logPath = path.join(process.cwd(), "auth_debug.log");
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
}


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
                logToFile(`Authorize called for: ${credentials?.identifier}`);
                await dbConnect()
                try {
                    if (!credentials) {
                        logToFile("Error: No credentials provided");
                        return null;
                    }

                    // Diagnostic check: What users are in the DB?
                    const allUsers = await UserModel.find({}, 'username email isVerified');
                    logToFile(`Total users in DB: ${allUsers.length}`);
                    allUsers.forEach(u => logToFile(`DB User: ${u.username} (${u.email}) verified: ${u.isVerified}`));

                    const identifier = credentials.identifier.trim();
                    logToFile(`Searching for user: ${identifier}`);
                    const user = await UserModel.findOne({
                        $or: [
                            { email: identifier },
                            { username: identifier }
                        ]
                    })
                    if (!user) {
                        logToFile(`Error: User not found for ${identifier}`);
                        throw new Error('No user found with this email')
                    }
                    logToFile(`User found: ${user.username}, isVerified: ${user.isVerified}`);
                    if (!user.isVerified) {
                        logToFile(`Error: User ${user.username} is not verified`);
                        throw new Error('Please verify your account first')
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    logToFile(`Password check for ${user.username}: ${isPasswordCorrect ? "Success" : "Failed"}`);
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
                    logToFile(`Authorize Catch: ${err.message || err}`);
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
    secret: process.env.NEXTAUTH_SECRET,
    debug: true
}