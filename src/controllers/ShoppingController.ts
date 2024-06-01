import express, { Request, Response, NextFunction } from 'express';
import { FoodDoc, Offer, Vendor } from '../models';

/**
 * Function to find the availability of verndors/restaurants for a particular area 
 * @param req 
 * @param res 
 * @param next
 * @returns Restaurant which are available currently and their food
 */
export const GetFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;

    const result = await Vendor.find({ 
        pincode: pincode,  
        serviceAvailabe: true
    }).sort([['rating', 'descending']])
    .populate("foods");
    
    if(result.length > 0) {
        return res.status(200).json(result)
    }
    
    return res.status(400).json({ message: "Data not found!!" })
}

/**
 * Function to find the top restaurants for a particular area (pincode)
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const GetTopRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;

    const result = await Vendor.find({ 
        pincode: pincode,  
        serviceAvailabe: true
    }).sort([['rating', 'descending']])
    .limit(3); // only first 3 restaurants
    
    if(result.length > 0) {
        return res.status(200).json(result)
    }
    
    return res.status(400).json({ message: "Data not found!!" })
}

/**
 * Function to get all the food, that can be available in 30 mins
 * @param req 
 * @param res 
 * @param next 
 */
export const GetFoodIn30Mins = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;

    const result = await Vendor.find({ 
        pincode: pincode,  
        serviceAvailabe: true
    }).populate("foods")
    
    if(result.length > 0) {

        // array to store the foods which has readytime less than 30 mins
        let foodResults: any = [];

        result.map( vendor => {
            const foods = vendor.foods as [FoodDoc]

            foodResults.push(...foods.filter( food => food.readyTime <= 30 ))
        })

        return res.status(200).json(foodResults)
    }
    
    return res.status(400).json({ message: "Data not found!!" })
}

/**
 * Function to get all the food in the area
 * @param req 
 * @param res 
 * @param next 
 * @returns Foods from all the restaurants which are currently available
 */
export const SearchFoods = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;

    const result = await Vendor.find({ 
        pincode: pincode,
        serviceAvailabe: true
    }).populate("foods");
    
    if(result.length > 0) {
        // the result will have vendor details and their food
        // we only want foods

        let foodResults: any = [];

        result.map( item => foodResults.push(...item.foods) )

        return res.status(200).json(foodResults)
    }
    
    return res.status(400).json({ message: "Data not found!!" })
}

/**
 * Function to find a restaurant / vendor by ID along with its foods
 * @param req 
 * @param res 
 * @param next 
 */
export const FindRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const result = await Vendor.findById(id)
    .populate("foods");

    if(result) {
        return res.status(200).json(result)
    }

    return res.status(400).json({ message: "Data not found" })

}


/** ---------------- Find Offers ------------------ **/
/**
 * Funtion to get all the available offers for a pincode
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const GetOffersByPincode = async (req: Request, res: Response, next: NextFunction) => {

    const pincode = req.params.pincode;

    const offers = await Offer.find({ pincode: pincode, isActive: true });

    if(offers) {
        return res.status(200).json(offers)
    }

    return res.status(400).json({ message: "Offers not found" })

}
