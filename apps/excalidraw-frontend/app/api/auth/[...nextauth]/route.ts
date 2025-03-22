import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {prismaClient} from "@repo/db/client"
export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Missing username or password");
                }

                const user = await  prismaClient.user.findFirst({where:{username:credentials?.username,password:credentials?.password }
                })
                console.log("user",user)
                if (user) {
                    return { id: user.id, username: user.username, email: user.email };
                }

                else{
                        throw new Error("Invalid credentials");
    
                }
            }
        })
    ],
    pages: {
        signIn: "/signin"
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
