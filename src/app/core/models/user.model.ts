export interface User {
    id:string;
    email: string;
    name: string;
    profileUrl?: string;
}

export interface LoginForm{
    email: string;
    password: string;
}

export interface Session{
    user: User;
    timestamp: number;
    expiresIn: number;
}