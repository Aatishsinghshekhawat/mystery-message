import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string;
    }

    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessage?: boolean;
            username?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string;
    }
}