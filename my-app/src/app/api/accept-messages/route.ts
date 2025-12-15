import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth"

export async function POST(request: Request) {
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

    const userId = user.id;
    const { AcceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { AcceptMessages: AcceptMessages },
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status to accept Message"
            },
                { status: 401 }
            )
        }
        return Response.json({
            success: true,
            message: "User status to accept Message updated successfully", updatedUser
        },
            { status: 200 }
        )
    } catch (error) {
        console.log("Failed to update user status to accept Message");
        return Response.json({
            success: false,
            message: "Failed to update user status to accept Message"
        },
            { status: 500 }
        )
    }
}


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

    const userId = user.id;
    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                { status: 404 }
            )
        }
        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage
        },
            { status: 200 }
        )
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error in getting user status to accept Message"
        },
            { status: 500 }
        )
    }
}