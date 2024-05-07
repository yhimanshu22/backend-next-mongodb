import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbConnect

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User  // dont know why ot gives error 
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: 'not authenticated'
        }, { status: 401 })
    }

    const userId = user._id;
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, { isAcceptingMessage: acceptMessages }, { new: true }

        )
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: 'failed to update user status to '
            }, { status: 401 })

        }
        return Response.json({
            success: true,
            message: 'messagse acceptance status updated successfully'
        }, { status: 200 })

    } catch (error) {
        console.log('failed to update user status to accept messages')
        return Response.json({
            success: false,
            message: 'failed to update user status to accept messages'
        })
    }



}


export async function GET(request: Request) {
    await dbConnect

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: 'not authenticated'
        }, { status: 401 })
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json({
                success: false,
                message: 'User not found'
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage

        }, { status: 200 })
    } catch (error) {

        console.log('failed to update user status to accept messages')
        return Response.json({
            success: false,
            message: 'error in getting acceptance status'
        }, { status: 500 })

    }
}