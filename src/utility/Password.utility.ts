import bcrypt from 'bcrypt';
import jwt, { sign } from 'jsonwebtoken';
import { VendorPayload } from '../dto';
import { APP_SECRET } from '../config';
import { Request } from 'express';
import { AuthPayload } from '../dto';

export const GenerateSalt = async () => {
    return await bcrypt.genSalt(12);
}

export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
}

export const ValidatePassword = async (enteredPassword: string, savedPassword: string) => {
    return await bcrypt.compare(enteredPassword, savedPassword);
}

export const GenerateSignature = async (payload: AuthPayload) => {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: '3d' });
}

export const ValidateSignature = async (req: Request) => {

    const signature = req.get('Authorization');

    if(signature) {
        const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET) as AuthPayload;

        req.user = payload;

        return true;
    }

    return false;
}