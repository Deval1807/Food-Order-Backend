import express, { Request, Response, NextFunction } from 'express';
import { EditCustomerProfileInputs, UserLoginInupts, CreateDeliveryUserInputs, EditDeliveryUserProfileInputs } from '../dto';

// for converting plain stuff to the specific class
import { plainToClass } from 'class-transformer';

// for validation
import { validate } from 'class-validator';
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from '../utility';
import { DeliveryUser } from '../models';

/**
 * Function to handle registration of new delivery person
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const DeliveryUserRegister = async (req: Request, res: Response, next: NextFunction) => {

    const deliveryUserInputs = plainToClass(CreateDeliveryUserInputs, req.body);

    // check of validation errors
    const inputErrors = await validate(deliveryUserInputs, { validationError: { target: false }});

    if(inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }

    // if no error -> deconstruct the input
    const { 
        email,
        phone,
        password,
        address,
        firstName,
        lastName,
        pincode
    } = deliveryUserInputs;    

    const salt = await GenerateSalt();

    const hashedPassword = await GeneratePassword(password, salt);

    // if the user already exists
    const existingDeliveryUser = await DeliveryUser.findOne({ email: email });

    if(existingDeliveryUser !== null) {
        return res.status(400).json({ message: `A Delivery User already exists with email ${email}` })
    }

    const result = await DeliveryUser.create({
        email: email,
        password: hashedPassword,
        phone: phone,
        salt: salt,
        firstName: firstName,
        lastName: lastName,
        address: address,
        pincode: pincode,
        verified: false,
        lat: 0, 
        lng: 0,
        isAvailable: false
    });

    if(result) {
        
        // Generate the signature
        const signature = await GenerateSignature({
            _id: result._id,
            email: result.email,
            verified: result.verified
        })
        
        // send the result to client
        return res.status(201).json({ signature: signature, verified: result.verified, email: result.email })
    }

    return res.status(400).json({ message: "Error while signing up" })

}

/**
 * Function to handle the login of a delivery user
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const DeliveryUserLogin = async (req: Request, res: Response, next: NextFunction) => {
    
    const loginInputs = plainToClass(UserLoginInupts, req.body);

    // check of validation errors
    const loginErrors = await validate(loginInputs, { validationError: { target: false }});

    if(loginErrors.length > 0) {
        return res.status(400).json(loginErrors)
    }

    const { email, password } = loginInputs;

    const existingDeliveryUser = await DeliveryUser.findOne({ email: email });

    if(existingDeliveryUser) {
        // validation
        const validate = await ValidatePassword(password, existingDeliveryUser.password);

        if(validate) {
            // generate signature and send
            const signature = await GenerateSignature({
                _id: existingDeliveryUser._id,
                email: existingDeliveryUser.email,
                verified: existingDeliveryUser.verified
            })
            
            // send the result to client
            return res.status(200).json({ 
                signature: signature, 
                verified: existingDeliveryUser.verified, 
                email: existingDeliveryUser.email 
            })
        }else {
            return res.status(400).json({ message: "Invalid Password" })
        }
    }

    return res.status(404).json({ message: "Invalid Email. Please Register" })

}  

/**
 * Funtion to get the Delivery user profile
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const GetDeiveryUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    // get the Delivery user form auth data
    const deliveryUser = req.user;

    if(deliveryUser) {
        const profile = await DeliveryUser.findById(deliveryUser._id);

        if(profile) {
            return res.status(200).json(profile)
        }else {
            return res.status(400).json({ message: "No such profile exists" })
        }
    }   

    return res.status(400).json({ message: "Error while getting profile" })
}

/**
 * Funtion to update the Delivery user profile
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const UpdateDeliveryUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    
    // get the delivery user form auth data
    const deliveryUser = req.user;

    const profileInputs = plainToClass(EditDeliveryUserProfileInputs, req.body);

    const profileErrors = await validate(profileInputs, { validationError: { target: false }});

    if(profileErrors.length > 0) {
        return res.status(400).json(profileErrors)
    }

    const { firstName, lastName, address, pincode, phone } = profileInputs

    if(deliveryUser) {
        const profile = await DeliveryUser.findById(deliveryUser._id);

        if(profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            profile.pincode = pincode;
            profile.phone = phone;

            const result = await profile.save();

            return res.status(200).json(result)
        }
    }   

    return res.status(400).json({ message: "Error while updating profile" })

}

/**
 * Funtion to update the service status of the delivery user
 * Also upadated the latitude and longitude if provided
 * @param req 
 * @param res 
 * @param next 
 */
export const UpdateDeliveryUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    const deliveryUser = req.user;

    if(deliveryUser) {
        const { lat, lng } = req.body;

        const profile = await DeliveryUser.findById(deliveryUser._id);

        if(profile) {
            if(lat && lng) {
                profile.lat = lat;
                profile.lng = lng;
            }

            profile.isAvailable = !profile.isAvailable;

            const result = await profile.save();

            return res.status(200).json(result)
        }
    } 
 
    return res.status(400).json({ message: "Error updating the profile" })

}