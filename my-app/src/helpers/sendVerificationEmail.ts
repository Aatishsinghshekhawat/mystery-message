import { transporter } from "@/lib/nodemailer";
import { render } from "@react-email/render";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {

    try {
        const emailHtml = await render(VerificationEmail({ username, otp: verifyCode }));

        const response = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Mystery Message | Verification code',
            html: emailHtml,
        });

        console.log("Nodemailer API Response:", response);
        return { success: true, message: 'Verification email send successfully' }
    } catch (emailError) {
        console.error("Error sending verification Email", emailError)
        return { success: false, message: 'Failed to send verification email: ' + (emailError instanceof Error ? emailError.message : String(emailError)) }
    }
}