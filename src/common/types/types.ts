import { Request } from "express";
import mongoose from "mongoose";

export type AuthCookie = {
    accessToken: string;
}


export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
        id?: string;
        tenant: string;
    };
}

