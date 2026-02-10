export interface User {
    id: string;
    name: string;
    email: string;
    profile: string;
    }

/** login formunda alıncak blgiler */
export interface LoginForm {
    email: string;
    password: string;
}

/** localstorage saklanacak session */
export interface Session {
    user: User;
    timestamp: number;
    expiresIn: number; // ne zaman expire olcak (24)
}
