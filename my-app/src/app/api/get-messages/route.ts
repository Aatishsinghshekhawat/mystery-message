import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth"
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!user) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        },
            { status: 401 }
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                { status: 404 }
            )
        }

        return Response.json({
            success: true,
            messages: user.messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        },
            { status: 200 }
        )
    } catch (error) {
        console.log("An Unexpected Error Occured", error);
        return Response.json({
            success: false,
            message: "An unexpected error occurred"
        },
            { status: 500 }
        )
    }
}