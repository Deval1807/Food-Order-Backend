import { Request, Response, NextFunction } from 'express';
import { CreateVendorInput } from '../dto';
import { DeliveryUser, Transaction, Vendor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';


/**
 * Function to find a specific Vendor
 * @param id 
 * @param email optional
 * @returns If email if provided - Vendor with that email, or Vendor with a specific id
 */
export const FindVendor = async (id: string | undefined, email?: string) => {
    if(email) {
        return await Vendor.findOne({ email: email });
    }else {
        return await Vendor.findById(id);
    }
} 


/**
 * Function to create a new Vendor
 * @param req
 * @param res
 * @param next
 * @returns JSON object with details of new Vendor
 */
export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {
    
    const {name, ownerName, foodTypes, pincode, address, email, password, phone} = <CreateVendorInput>req.body;

    // first check if the verndor already exists - if it does - dont create
    const existingVendor = await FindVendor('', email);
    if (existingVendor) {
        return res.json({ message: "Vendor already exist with this email address" })
    }

    // Generate salt and hash the password
    const salt = await GenerateSalt();
    const hashedPassword = await GeneratePassword(password, salt);

    const createVendor = await Vendor.create({
        name: name,
        ownerName: ownerName,
        address: address,
        pincode: pincode,
        foodTypes: foodTypes,
        email: email,
        password: hashedPassword,
        salt: salt,
        phone: phone,
        rating: 0,
        serviceAvailabe: false,
        coverImages: [],
        foods: [],
        lat: 0,
        lng: 0
    }); 

    res.json(createVendor)
}

/**
 * Function to get all the vendors
 * @param req
 * @param res
 * @param next
 * @returns List of all the Vendors if exists
 */
export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    const allVendors = await Vendor.find();
    if(allVendors.length > 0) {
        return res.json(allVendors);
    }

    return res.json({ message: "No vendors present" })
}


/**
 * Function to find a specific Vendor by it ID
 * @param req
 * @param res
 * @param next
 * @returns JSON object, with details of that Vendor
 */
export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {
    const vendorId = req.params.id;

    const vendor = await FindVendor(vendorId)

    if(vendor !== null) {
        return res.json(vendor);
    }

    return res.json({ message: `No vendor exists it id: ${vendorId}` })
}


/** ----------------------------- Transactions -------------------------------- **/
/**
 * Function to get all the transactions
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const GetTransactions = async (req: Request, res: Response, next: NextFunction) => {

    const transactions = await Transaction.find();

    if(transactions) {
        return res.status(200).json(transactions);
    }

    return res.status(400).json({ message: "No transactions found!!" });

}

/**
 * Function to find a transaction by ID
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const GetTransactionById = async (req: Request, res: Response, next: NextFunction) => {

    const transactionId = req.params.id

    const transaction = await Transaction.findById(transactionId);

    if(transaction) {
        return res.status(200).json(transaction);
    }

    return res.status(400).json({ message: "No transaction found!!" });

}


/** ----------------------------- Delivery user -------------------------------- **/

/**
 * Function to change the verified status of the delivery user
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const VerifyDeliveryUser = async (req: Request, res: Response, next: NextFunction) => {

    const { _id, status } = req.body;

    if(_id) {
        const profile = await DeliveryUser.findById(_id);

        if(profile) {

            profile.verified = status;

            const result = await profile.save();

            return res.status(200).json(result);
        }
    }

    return res.status(400).json({ message: "Cannot verify delivery user" })
}

/**
 * Function to get all the delivery users
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const GetDeliveryUsers = async (req: Request, res: Response, next: NextFunction) => {

    const profiles = await DeliveryUser.find();

    if(profiles) {

        return res.status(200).json(profiles);
    }
    
    return res.status(400).json({ message: "Unable to get delivery users" })
}