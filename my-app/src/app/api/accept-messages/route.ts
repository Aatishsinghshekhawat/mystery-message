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
            {status: 401}
        )
    }

    const userId = user.id;
    const {AcceptMessages} = await request.json();

    try {
        
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