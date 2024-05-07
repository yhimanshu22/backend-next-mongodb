import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(req: Request) {
    await dbConnect

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User  // dont know why ot gives error 
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: 'not authenticated'
        }, { status: 401 })
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        // mongodb aggregation pipeline
        const user = await UserModel.aggregate([
            { $match: { id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])
        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: 'user not found'
            }, { status: 401 })
        }
        return Response.json({
            success: true,
            messages: user[0].messages

        }, { status: 200 })
    } catch (error) {
        console.log('an unexpected error occured', error)
        return Response.json({
            success: false,
            message: 'not authenticated'
        }, { status: 500 })
    }


}