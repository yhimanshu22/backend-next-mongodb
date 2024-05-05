import z from 'zod';

export const usernameValidation = z.string()
    .min(2, 'username should be greater than 2')
    .max(15, 'username should be less than 15')
    .regex(/^[a-zA-Z0-9_]$/, 'username must not contains special characeters')


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: 'invalid email address' }),
    password: z.string().min(6, { message: 'password must be greater than 6' }),
})

