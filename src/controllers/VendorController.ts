import { Request, Response, NextFunction } from 'express';
import { EditVendorInputs, VendorLoginInput, CreateFoodInputs, CreateOfferInputs } from '../dto';
import { FindVendor } from './AdminController';
import { GenerateSignature, ValidatePassword } from '../utility';
import { Food, Offer, Order, Vendor } from '../models';


/**
 * Function to handle the login of a vendor
 * @param req 
 * @param res 
 * @param next 
 */
export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    
    // capture login data
    const { email, password } = <VendorLoginInput>req.body

    const existingVendor = await FindVendor('', email);

    if(existingVendor !== null) {
        const validation = await ValidatePassword(password, existingVendor.password)

        if(validation) {

            // Generate signature
            const signature = await GenerateSignature({
                _id: existingVendor._id,
                email: existingVendor.email,
                name: existingVendor.name,
            })
            
            return res.json(signature)
        }else {
            return res.json({ message: "Password is not valid" })
        }
    } 

    // No existing user
    return res.json({ message: "Email does not exist. Pleas register" })

}

/**
 * Function of Get the profile (Authenticated - can only see own profile)
 * @param req 
 * @param res 
 * @param next 
 * @returns Own Profile
 */
export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    
    const user = req.user;
    if(user) {
        const existingVendor = await FindVendor(user._id);

        return res.json(existingVendor)
    }

    return res.json({ message: "Vendor information not found" })

}   

/**
 * Function to update the cover image of a vendor
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const UpdateVendorCoverImage = async (req: Request, res: Response, next: NextFunction) => {    
    const user = req.user;
    if(user) {
        const vendor = await FindVendor(user._id);

        if(vendor !== null) {

            const files = req.files as [Express.Multer.File];

            const images = files.map((file: Express.Multer.File) => file.filename);
            
            vendor.coverImages.push(...images);

            const result = await vendor.save();

            return res.json(result);
        }
    }

    return res.json({ message: "Something went wrong while updating cover image" })
}

/**
 * Function of update profile (Authenticated)
 * @param req 
 * @param res 
 * @param next 
 */
export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    
    const { name, address, phone, foodTypes } = <EditVendorInputs>req.body;

    const user = req.user;
    if(user) {
        const existingVendor = await FindVendor(user._id);

        if(existingVendor !== null) {

            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodTypes = foodTypes;

            const savedResult = await existingVendor.save();
            return res.json(savedResult)

        }

        return res.json(existingVendor)
    }

    return res.json({ message: "Vendor information not found" })

}

/**
 * Function to toggle the Vendor's Service Availability, and also provide the location of the vendor
 * The admin just register the vendors. The actual location will be provided by vendor itself
 * @param req 
 * @param res 
 * @param next 
 */
export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const { lat, lng } = req.body;

    if(user) {
        const existingVendor = await FindVendor(user._id);

        if(existingVendor !== null) {

            existingVendor.serviceAvailabe = !existingVendor.serviceAvailabe;

            if(lat && lng) {
                existingVendor.lat = lat;
                existingVendor.lng = lng;
            }

            const savedResult = await existingVendor.save();
            return res.json(savedResult)

        }

        return res.json(existingVendor)
    }

    return res.json({ message: "Vendor information not found" })
}

/** ---------------- Food ------------------ **/
/**
 * Function to add food to a particular vendor
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
    
    const user = req.user;
    if(user) {
        const { name, description, category, foodType, readyTime, price } = <CreateFoodInputs>req.body;

        const vendor = await FindVendor(user._id);

        if(vendor !== null) {

            const files = req.files as [Express.Multer.File];

            const images = files.map((file: Express.Multer.File) => file.filename);

            const createdFood = await Food.create({
                vendorId : vendor._id,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                readyTime: readyTime,
                price: price,
                rating: 0,
                images: images
            });

            vendor.foods.push(createdFood);
            const result = await vendor.save();

            return res.json(result);
        }
    }

    return res.json({ message: "Something went wrong while adding food" })
}

/**
 * Function to get all the food item available from a vendor
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const GetFoods = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if(user) {
        const foods = await Food.find({ vendorId: user._id });

        if(foods !== null) {
            return res.json(foods) 
        }
    }

    return res.json({ message: "Food information not found" })
}


/** ---------------- Order ------------------ **/

/**
 * Function to get all the orders
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const GetCurrentOrders = async (req: Request, res: Response, next: NextFunction) => {
    
    const user = req.user;    

    if(user) {

        const orders = await Order.find({ vendorId: user._id }).populate('items.food')
        

        if(orders != null) {
            return res.status(200).json(orders)
        }

    }

    return res.status(400).json({ message: "Orders not found" })

}

/**
 * Function to get the order details of a particular order by its id
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const GetOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
    
    const orderId = req.params.id;

    if(orderId) {
        const order = await Order.findById(orderId).populate('items.food');

        if(order) {
            res.status(200).json(order)
        }
    }

    return res.status(400).json({ message: "Order details not found" })

}

/**
 * Function to process the order and add deatils like status, remarks and ready time
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    const { status, remarks, time } = req.body;     // accept | reject | under-process | ready

    if(orderId) {
        const order = await Order.findById(orderId).populate('items.food');

        order.orderStatus = status;
        order.remarks = remarks;
        if(time) {
            order.readyTime = time;
        }

        const orderResult = await order.save();
        if(orderResult) {
            return res.status(200).json(orderResult);
        }
    }
    return res.status(400).json({ message: "Error processing the order" });
}


/** ---------------- Offers ------------------ **/

/**
 * Function to find all the offers for a vendor
 * i.e. Vendor specific and all the GENERIC offers as well
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const GetOffers = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if(user) {
        let currentOffers = Array();
        const offers = await Offer.find().populate('vendors');

        if(offers) {
            offers.map((item) => {
                if(item.vendors) {
                    item.vendors.map((vendor) => {
                        if(vendor._id.toString() === user._id){
                            currentOffers.push(item);
                        }
                    })
                }
                if(item.offerType === "GENERIC") {
                    currentOffers.push(item);
                }
            })
        }

        return res.status(200).json(currentOffers);
    }

    return res.status(400).json({ message: "Offers not available" });
}

/**
 * Function for a vendor to add a new vendor specific offer
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const AddOffer = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user;

    if(user) {

        const {title,
            description,
            offerType,
            offerAmount,
            minimumValue,
            pincode,
            promocode,
            promotype,
            startValidity,
            endValidity,
            bank,
            bins,
            isActive
        } = <CreateOfferInputs>req.body;

        const vendor = await FindVendor(user._id);

        if(vendor) {

            const offer = await Offer.create({
                offerType: offerType,
                vendors: [vendor],
                title: title,
                description: description,
                minimumValue: minimumValue,
                offerAmount: offerAmount,
                startValidity: startValidity,
                endValidity: endValidity,
                promocode: promocode,
                promotype: promotype,
                bank: bank,
                bins: bins,
                pincode: pincode,
                isActive: isActive
            });

            return res.status(200).json(offer);

        }

    }

    return res.status(400).json({ message: "Error creating the offer" })

}

export const EditOffer = async (req: Request, res: Response, next: NextFunction) => {
    
    const user = req.user;
    const offerId = req.params.id;

    if(user) {

        const {title,
            description,
            offerType,
            offerAmount,
            minimumValue,
            pincode,
            promocode,
            promotype,
            startValidity,
            endValidity,
            bank,
            bins,
            isActive
        } = <CreateOfferInputs>req.body;

        const currentOffer = await Offer.findById(offerId);

        if(currentOffer) {

            const vendor = await FindVendor(user._id);
    
            if(vendor) {
    
                
                currentOffer.offerType = offerType,
                currentOffer.vendors = [vendor],
                currentOffer.title = title,
                currentOffer.description = description,
                currentOffer.minimumValue = minimumValue,
                currentOffer.offerAmount = offerAmount,
                currentOffer.startValidity = startValidity,
                currentOffer.endValidity = endValidity,
                currentOffer.promocode = promocode,
                currentOffer.promotype = promotype,
                currentOffer.bank = bank,
                currentOffer.bins = bins,
                currentOffer.pincode = pincode,
                currentOffer.isActive = isActive
                
                const result = await currentOffer.save();
                
                res.status(200).json(result) 
    
            }
        }


    }

    return res.status(400).json({ message: "Error creating the offer" })
}

