import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";
import { resend } from "@/lib/resend";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,

): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { success: true, message: 'verification email sent successfully' }

    } catch (error) {
        console.error('error in verification email', error)
        return { success: false, message: "failed to send verification email" }
    }
}