import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {prismaClient} from "@repo/db/client"
import {JWT_SECRET} from "@repo/backend-common/config"
import jwt from "jsonwebtoken"
export const authOptions = {
    secret:JWT_SECRET,

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
                    return user;
                }

                else{
                        throw new Error("Invalid credentials");
    
                }
            }
        })
    ],
    
    pages: {
        signIn: "/signin"
    },
    
    callbacks:{
        async jwt({ token, user }:any) {
            if (user) {
                // Sign JWT with user ID
                token.id = user.id;
                token.accessToken = jwt.sign({ id: user.id }, JWT_SECRET);
            }
            return token;
        },

        async session({ session, token }:any) {
            // Attach user ID to session
            session.user.id = token.id;
            session.accessToken = token.accessToken;
            return session;
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
