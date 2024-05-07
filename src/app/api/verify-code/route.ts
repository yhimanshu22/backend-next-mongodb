import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST() {
    await dbConnect()

    try {
        // ab hame chahiye data -------->
        const { username, code } = await request.json()

        //decode url ---->
        const decodeUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username }, decodeUsername)

        if (!user) {
            return Response.json({
                success: false,
                message: 'user not found'
            }, { status: 500 })
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user, verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true,
                await user.save()
            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"
                }, { status: 200 }
            )


        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: 'verification code has expired,please signup again to get a new code'
            }, { status: 400 })

        } else {
            return Response.json({
                success: false,
                message: 'incorrect verification code'
            }, { status: 400 })

        }


    }




    } catch (error) {
    console.error('error verifying user', error)

    return Response.json({
        success: false,
        message: 'error verifying user'
    }, { status: 500 })
}
}