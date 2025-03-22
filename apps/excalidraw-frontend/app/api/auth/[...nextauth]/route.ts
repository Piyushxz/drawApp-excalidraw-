import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Replace with your authentication logic
                if (credentials?.username === "admin" && credentials?.password === "password") {
                    return { id: "1", name: "Admin User", email: "admin@example.com" };
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: "/signin"
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
