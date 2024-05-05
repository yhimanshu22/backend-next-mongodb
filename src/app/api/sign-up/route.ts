// writing API ----------->

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect()  //connecting database

    try {
        //taking this data from user ------->
        const { username, email, password } = await request.json()
        //checking username which is verified -------->
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username, isVerified: true
        })
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: 'Username is already taken'
            }, { status: 400 })
        }
        //taking username using email ---->
        const existingUserByEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: 'User already exist with this email '
                }, { status: 400 })
            } else {

                // if user exist but do not verified earlier
                const hasedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hasedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000).toISOString();
                await existingUserByEmail.save()

            }
        }
        // if user by email not found ----->
        else {

            const hasedPassword = await bcrypt.hash(password, 10)  // hashing password to secure ---
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1); // expiry time of hased password -----

            // creating new user ----->
            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode, verifyCodeExpiry: expiryDate, isVerified: false, isAcceptingMessage: true, messages: []

            });
            // save user ----->
            await newUser.save()
        }

        // send verification email --------->>>

        const emailResponse = await sendVerificationEmail(
            email, username, verifyCode
        )
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message,
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: 'User registered successfully.Please verify your email'
        }, { status: 201 });

    } catch (error) {
        console.error('error registering user', error)
        return Response.json(
            {
                success: false,
                message: 'Error registering user'
            },
            {
                status: 500
            }
        )
    }
}