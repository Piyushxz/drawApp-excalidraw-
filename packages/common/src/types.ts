import {z} from  "zod"


export const signUpSchema = z.object({
    username:z.string().min(3).max(20),
    password:z.string().min(3).max(20),
    email:z.string().email().min(5)

})

export const signin = z.object({
    username:z.string().min(3).max(20),
    password:z.string().min(3).max(20),


})

export const createRoomSchema = z.object({
    roomName:z.string().min(3)
})