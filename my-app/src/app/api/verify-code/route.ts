import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";


export async function POST(request: Request) {
    await dbConnect();

    try {
        const { code, username } = await request.json();
        console.log("Verification attempt for username:", username, "with code:", code);

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            console.log("User not found:", decodedUsername);
            return Response.json({
                success: false,
                message: "User not found"
            },
                { status: 404 }
            )
        }

        console.log("User found:", {
            username: user.username,
            isVerified: user.isVerified,
            storedCode: user.verifyCode,
            providedCode: code,
            expiry: user.verifyCodeExpiry
        });

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        console.log("Validation results:", { isCodeValid, isCodeNotExpired });

        if (isCodeValid && isCodeNotExpired) {
            console.log("Verification successful! Setting isVerified to true...");
            user.isVerified = true;
            await user.save();
            console.log("User saved. New isVerified status:", user.isVerified);

            return Response.json({
                success: true,
                message: "User verified successfully"
            },
                { status: 200 }
            )
        } else if (!isCodeNotExpired) {
            console.log("Verification code has expired");
            return Response.json({
                success: false,
                message: "Verification code has expired"
            },
                { status: 400 }
            )
        } else {
            console.log("Incorrect verification code");
            return Response.json({
                success: false,
                message: "Incorrect Verification Code"
            },
                { status: 400 }
            )
        }
    } catch (error) {
        console.error("Error Verifying User:", error);
        return Response.json({
            success: false,
            message: "Error Verifying User"
        },
            { status: 500 }
        )
    }
}

