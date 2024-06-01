import express, { Request, Response, NextFunction } from 'express';
import { CreateCustomerInputs, EditCustomerProfileInputs, CartItem, UserLoginInupts, OrderInputs } from '../dto';

// for converting plain stuff to the specific class
import { plainToClass } from 'class-transformer';

// for validation
import { validate } from 'class-validator';
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, SendOtp, ValidatePassword } from '../utility';
import { Customer, DeliveryUser, Food, Offer, Order, Transaction, Vendor } from '../models';

/**
 * Function to handle registration of new customer
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const CustomerRegister = async (req: Request, res: Response, next: NextFunction) => {

    const customerInputs = plainToClass(CreateCustomerInputs, req.body);

    // check of validation errors
    const inputErrors = await validate(customerInputs, { validationError: { target: false }});

    if(inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }

    // if no error -> deconstruct the input
    const { email, phone, password } = customerInputs;    

    const salt = await GenerateSalt();

    const hashedPassword = await GeneratePassword(password, salt);

    const { otp, expiry } = GenerateOtp();

    // if the user already exists
    const existingCustomer = await Customer.findOne({ email: email });

    if(existingCustomer !== null) {
        return res.status(400).json({ message: `Customer already exists with email ${email}` })
    }

    const result = await Customer.create({
        email: email,
        password: hashedPassword,
        otp: otp,
        otp_expiry: expiry,
        phone: phone,
        salt: salt,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0, 
        lng: 0,
        orders: []
    });

    if(result) {
        
        // send the OTP to customer
        await SendOtp(otp, phone);
        
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
 * Function to handle the login of a customer
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
    
    const loginInputs = plainToClass(UserLoginInupts, req.body);

    // check of validation errors
    const loginErrors = await validate(loginInputs, { validationError: { target: false }});

    if(loginErrors.length > 0) {
        return res.status(400).json(loginErrors)
    }

    const { email, password } = loginInputs;

    const existingCustomer = await Customer.findOne({ email: email });

    if(existingCustomer) {
        // validation
        const validate = await ValidatePassword(password, existingCustomer.password);

        if(validate) {
            // generate signature and send
            const signature = await GenerateSignature({
                _id: existingCustomer._id,
                email: existingCustomer.email,
                verified: existingCustomer.verified
            })
            
            // send the result to client
            return res.status(200).json({ 
                signature: signature, 
                verified: existingCustomer.verified, 
                email: existingCustomer.email 
            })
        }else {
            return res.status(400).json({ message: "Invalid Password" })
        }
    }

    return res.status(404).json({ message: "Invalid Email. Please Register" })

}  

/**
 * Function to verify the customer through otp
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;
    // console.log("otp: ", otp);
    
    // get the customer via authentication
    const customer = req.user;
    // console.log("customer: ", customer);
    

    if(customer) {
        const profile = await Customer.findById(customer._id)
        // console.log("profile: ", profile);
        
        if(profile) {
            // check if the otp matches and is also within the expiry
            if(parseInt(otp) === profile.otp && profile.otp_expiry >= new Date()) {
                // update the customer's verified status
                profile.verified = true;

                const updatedCustomerProfile = await profile.save();

                // regenerate signature (since the signature payload has verified status)
                const signature = await GenerateSignature({
                    _id: updatedCustomerProfile._id,
                    email: updatedCustomerProfile.email,
                    verified: updatedCustomerProfile.verified
                });

                return res.status(200).json({ 
                    signature: signature, 
                    verified: updatedCustomerProfile.verified, 
                    email: updatedCustomerProfile.email 
                })


            }
        }  
    }

    return res.status(400).json({ message: "Error with OTP validation" })

}

/**
 * Function to handle the request of OTP. Saves the new otp and send it back to user's phone number
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {

    // get the customer info from auth
    const customer = req.user;

    if(customer) {
        const profile = await Customer.findById(customer._id);

        if(profile) {
            // generate a new otp and update the profile

            const { otp, expiry } = GenerateOtp();

            profile.otp = otp;
            profile.otp_expiry = expiry

            await profile.save();
            // call the SenOtp function to again send the otp to user phone number
            // await SendOtp(otp, profile.phone);

            return res.status(200).json({ message: "OTP sent to you phone number" })

        }
    }

    return res.status(400).json({ message: "Error while requesting otp" })

}

/**
 * Funtion to get the customer profile
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    // get the customer form auth data
    const customer = req.user;

    if(customer) {
        const profile = await Customer.findById(customer._id);

        if(profile) {

            return res.status(200).json(profile)
        }else {
            return res.status(400).json({ message: "No such profile exists" })
        }
    }   

    return res.status(400).json({ message: "Error while getting profile" })
}

/**
 * Funtion to update the customer profile
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const UpdateCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    
    // get the customer form auth data
    const customer = req.user;

    const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);

    const profileErrors = await validate(profileInputs, { validationError: { target: false }});

    if(profileErrors.length > 0) {
        return res.status(400).json(profileErrors)
    }

    const { firstName, lastName, address } = profileInputs

    if(customer) {
        const profile = await Customer.findById(customer._id);

        if(profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;

            const result = await profile.save();

            return res.status(200).json(result)
        }
    }   

    return res.status(400).json({ message: "Error while updating profile" })

}


/* ------------------------------ Cart -------------------------------- */

/**
 * Function to add item to cart
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const AddToCart = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    if(customer) {
        const profile = await Customer.findById(customer._id).populate('cart.food');
        

        let cartItems = Array();

        const { _id, unit } = <CartItem>req.body;

        // check if the food exists with that id
        const food = await Food.findById(_id);        
 
        if(food) {
            if(profile) {
                // check for cart items
                // if already, edit that specific unit

                cartItems = profile.cart;
                
                
                if(cartItems.length > 0) {
                    // check and update
                    let existingFoodItem = cartItems.filter((item) => item.food._id.toString() === _id);
                    
                    if(existingFoodItem.length > 0) {

                        const index = cartItems.indexOf(existingFoodItem[0]);
                        if(unit > 0) {
                            cartItems[index] = { food, unit };
                        }else {
                            // if unit = 0, delete it
                            cartItems.splice(index, 1);
                        }

                    }else {
                        cartItems.push({ food: food, unit: unit })
                    }

                }else {
                    // create a new one
                    cartItems.push({ food: food, unit: unit })
                }

                if(cartItems) {
                    profile.cart = cartItems as any;
                    const cartResult = await profile.save();
                    return res.status(200).json(cartResult.cart);
                }

            }
        }
    }
}

/**
 * Function for the user to get cart
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const GetCart = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;

    if(customer) {

        const profile = await Customer.findById(customer._id).populate('cart.food');

        if(profile) {
            return res.status(200).json(profile.cart);
        }

    }

    return res.status(400).json({ message: "Cart is empty" })

}

/**
 * Funtion to delete all the items from cart
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const DeleteCart = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    if(customer) {

        const profile = await Customer.findById(customer._id);

        if(profile) {

            profile.cart = [] as any;
            const cartResult = await profile.save();

            return res.status(200).json(cartResult);
        }

    }

    return res.status(400).json({ message: "Cart is already empty" })
}



/* ------------------------------ Apply offer -------------------------------- */
/**
 * Funtion to apply and verify a particular offer
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const VerifyOffer = async (req: Request, res: Response, next: NextFunction) => {

    const offerId = req.params.id;
    const customer = req.user;

    if(customer) {
        const appliedOffer = await Offer.findById(offerId);

        if(appliedOffer) {
           
            if(appliedOffer.promotype === "USER") {
                // only can apply once per user
            }else {
                if(appliedOffer.isActive) {
                    return res.status(200).json({ message: "Offer is Valid!!", offer: appliedOffer });
                }
            }


        }
    }

    return res.status(400).json({ message: "Offer is not valisd" })

}   


/* ------------------------------ Payment -------------------------------- */
/**
 * Funtion to apply the applied offer and deduct the money
 * @param req 
 * @param res 
 * @param next 
 */
export const CreatePayment = async (req: Request, res: Response, next: NextFunction) => {
    
    const customer = req.user;

    const { amount, offerId, paymentMode } = req.body;

    let payableAmount = Number(amount);

    if(customer) {
        if(offerId) {

            const appliedOffer = await Offer.findById(offerId);

            if(appliedOffer && appliedOffer.isActive) {
                // check for minimum
                if(payableAmount >= appliedOffer.minimumValue) {
                    payableAmount -= appliedOffer.offerAmount;
                }else {
                    const remaining = appliedOffer.minimumValue - payableAmount
                    return res.status(400).json({ message: `Add order worth of Rs. ${remaining} or more to avail this offer` })
                }
            }

        }

        // perform payment gateway charge api call

        // right after payment gateway success / response failure

        // create record on transaction
        const transaction = await Transaction.create({
            customerId: customer._id,
            vendorId: '',
            orderId: '',
            orderValue: payableAmount,
            offerUsed: offerId || 'NA',
            status: 'OPEN',
            paymentMode: paymentMode,
            paymentResponse: 'Payment is Cash on Delivery'
        })

        // Return transaction id
        return res.status(200).json(transaction);
    }

    return res.status(400).json({ message: "Error in making payment" })

}   


/* ------------------------------ Delivery -------------------------------- */
const assignOrderForDelivery = async (orderId: any, vendorId: string) => {
    
    // find the vendor
    const vendor = await Vendor.findById(vendorId);
        

    if(vendor) {
        const vendorAreaCode = vendor.pincode;
        const vedorLat = vendor.lat;
        const vonderLng = vendor.lng;

        // find the available delivery person
        const deliveryPersons = await DeliveryUser.find({
            pincode: vendorAreaCode,
            isAvailable: true,
            verified: true
        });
        

        if(deliveryPersons) {
            // check the nearest delivery person and assign them the order
            // google api
            
            const currentOrder = await Order.findById(orderId);
            console.log("current order: ",currentOrder);
            

            if(currentOrder) {
                // update the deliveryId of the closest delivery person
                const delid = deliveryPersons[0]._id.toString()
                console.log("delid", delid);
                
                
                currentOrder.deliveryId = delid;
                const updatedOrder = await currentOrder.save()
                return updatedOrder

                // Notify the vendor of the new order using firebase push notifications
            }

        }

    }




}

/* ------------------------------ Orders -------------------------------- */
/**
 * Function to validate the status of transaction
 * @param txnId 
 * @returns 
 */
const validateTransaction = async (txnId: string) => {

    const currentTransaction = await Transaction.findById(txnId);

    if(currentTransaction) {
        if(currentTransaction.status.toLowerCase() !== "failed") {
            return { status: true, currentTransaction }
        }
    }

    return { status: false, currentTransaction }

}


/**
 * Function to create order and also store the order details in the particular customer
 * Place the order only after the transaction is successfull!!
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {

    // grab the current logged in customer
    const customer = req.user;

    const { txnId, items } = <OrderInputs>req.body;

    if(customer) {

        // validate the transaction
        const { status, currentTransaction } = await validateTransaction(txnId);

        if(!status) {
            return res.status(400).json({ message: "Error with create order (Transation not valid)" })
        }

        // create an order id
        const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

        const profile = await Customer.findById(customer._id);

        let cartItems = Array();
        let totalAmount = 0.0;
        let vendorId;

        // Calculate order amount
        const foods = await Food.find().where('_id').in(items.map(item => item._id)).exec();

        foods.map(food => {

            items.map(({ _id, unit }) => {
                if(food._id == _id) {
                    totalAmount += (food.price * unit);
                    cartItems.push({ food, unit });
                    vendorId = food.vendorId;
                }
            })

        });   


        // Create order with item description
        if(cartItems) {
            // Create Order
            const order = await Order.create({
                orderId: orderId,
                vendorId: vendorId,
                items: cartItems,
                totalAmount: totalAmount,
                paidAmount: currentTransaction.orderValue,
                orderDate: new Date(),
                orderStatus: 'waiting',
                remarks: '',
                deliveryId: '',
                readyTime: 45
            });


            // if order is created, push the order into the customer profile
            if(order) {

                // empty the cart after order is placed
                profile.cart = [] as any;
                profile.orders.push(order);
                await profile.save();

                // update the transaction also
                currentTransaction.vendorId = vendorId;
                currentTransaction.orderId = orderId;
                currentTransaction.status = "CONFIRMED";
                await currentTransaction.save();

                const updatedOrder = await assignOrderForDelivery(order._id.toString(), vendorId);

                return res.status(200).json(updatedOrder)

            }
        }


    }

    return res.status(400).json({ message: "Error with creating order" })

}

/**
 * Function to get all the orders of a particular customer
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {
    
    const customer = req.user;

    if(customer) {
        const profile = await Customer.findById(customer._id).populate('orders');

        if(profile) {
            return res.status(200).json(profile.orders);
        }
    }

    return res.status(400).json({ message: "Error while fetching orders" })
}

/**
 * Funtion to get an order by ID
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const GetOrderById = async (req: Request, res: Response, next: NextFunction) => {
    
    const orderId = req.params.id;

    if(orderId) {
        const order = await Order.findById(orderId).populate('items.food');

        res.status(200).json(order);
    }
 
    return res.status(400).json({ message: "Error while fetching the order" })
}
