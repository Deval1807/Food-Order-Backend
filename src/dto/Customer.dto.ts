import { IsEmail, Length } from "class-validator";

export class CreateCustomerInputs {
    
    @IsEmail()
    email: string;

    @Length(7,12)
    phone: string;

    @Length(6,12)
    password: string;
}

export class UserLoginInupts {
    @IsEmail()
    email: string;

    @Length(6,12)
    password: string;
}

export class EditCustomerProfileInputs {

    @Length(2,15)
    firstName: string;

    @Length(2,15)
    lastName: string;

    @Length(4,20)
    address: string;
 
}

export interface CustomerPayload {
    _id: any;
    email: string;
    verified: boolean
}

export interface CartItem {
    _id: string;
    unit: number;
}

export interface OrderInputs {
    txnId: string,
    amount: string,
    items: [CartItem]
}