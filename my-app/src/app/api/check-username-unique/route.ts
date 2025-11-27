import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
             username : searchParams.get("username")
            }
            const result = UsernameQuerySchema.safeParse(queryParam);

            if(!result.success) {
                const usernameEroor = result.error.format().username?._errors || [];
                return Response.json({
                    success: false,
                    message: usernameEroor?.length > 0 ? usernameEroor.join(', ') : "Invalid query parameter"
                }, { status: 400 })
            }

        const { username } = result.data;
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

        if (existingVerifiedUser) {
            return Response.json({
                    success: false,
                    message:  "Username is already taken"
                }, { status: 400 })
        }

        return Response.json({
                    success: false,
                    message:  "Username is Unique"
                }, { status: 400 })
    } catch (error) {
        console.error("Error checking username uniqueness:", error);
        return Response.json({
            success: false,
            message: "Error checking username uniqueness"
        },
        { status: 500 }
    )
   }
}