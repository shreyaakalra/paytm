import z from "zod";

export const userValidator = z.object({

    firstName: z.string()
            .min(3, {message: "firstname must be atleast 3 digits long."})
            .max(100, {message: "firstname can't be longer than 100 characters."}),

    lastName: z.string()
            .min(3, {message: "lastname must be atleast 3 digits long."})
            .max(100, {message: "lastname cannot have more than a 100 characters"}),

    email: z.string()
        .email({message: "Invalid email address format"}),

    password: z.string()
            .min(8, {message: "password should have minimum 8 characters"})
            .max(20, {message: "password cannot exceed more than 20 characters"})
            .regex(/[A-Z]/, {message: "password must contain atleast one uppercase letter"})
            .regex(/[a-z]/, {message: "password must contain atleast one lowercase letter."})
            .regex(/[0-9]/, {message: "password must contain atleast one number."})
            .regex(/[^a-zA-Z0-9]/, {message: "password must contain atleast one special character."})

})