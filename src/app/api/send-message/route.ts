import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect

    // message koi bhi bhej sakta --------->
    const { username, content } = await request.json()

    try {

        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json({
                success: false,
                message: 'user not found'
            }, { status: 404 })
        }
        // is user accepting messages ---->
        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: 'user is not accepting the message'
            })
        }

        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json({
            success: true,
            message: 'message sent successfully'
        })
    } catch (error) {
        console.log('error adding messages', error);
        return Response.json({
            success: false,
            message: 'internal server error'
        }, { status: 500 })
    }
}