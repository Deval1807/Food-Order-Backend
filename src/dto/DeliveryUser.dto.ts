import { IsEmail, Length } from "class-validator";

export class CreateDeliveryUserInputs {
    
    @IsEmail()
    email: string;

    @Length(7,12)
    phone: string;

    @Length(6,12)
    password: string;

    @Length(2,15)
    firstName: string;

    @Length(2,15)
    lastName: string;

    @Length(6,25)
    address: string;

    @Length(6)
    pincode: string;
}


export class EditDeliveryUserProfileInputs {

    @Length(2,15)
    firstName: string;

    @Length(2,15)
    lastName: string;

    @Length(6,25)
    address: string;
 
    @Length(6)
    pincode: string;

    @Length(7,12)
    phone: string;
}