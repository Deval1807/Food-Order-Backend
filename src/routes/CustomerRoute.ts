import express, { Request, Response, NextFunction } from 'express';
import { GetCustomerProfile, 
    UpdateCustomerProfile, 
    CustomerLogin, 
    RequestOtp, 
    CustomerRegister, 
    CustomerVerify, 
    CreateOrder,
    GetOrders,
    GetOrderById,
    AddToCart,
    GetCart,
    DeleteCart,
    VerifyOffer,
    CreatePayment
} from '../controllers';
import { Authenticate } from '../middlewares';
 
const router = express.Router();

/** No Auth required **/
/** ---------------- Signup / login ------------------ **/
router.post('/register', CustomerRegister);
router.post('/login', CustomerLogin);


/** Auth Required **/
router.use(Authenticate);
/** ---------------- Verify Customer account ------------------ **/
router.patch('/verify', CustomerVerify);

/** ---------------- OTP ------------------ **/
router.get('/otp', RequestOtp);

/** ---------------- Profile ------------------ **/
router.get('/profile', GetCustomerProfile);
router.patch('/profile', UpdateCustomerProfile)


/** ---------------- Cart ------------------ **/
router.post('/cart', AddToCart);
router.get('/cart', GetCart);
router.delete('/cart', DeleteCart);


/** ---------------- Apply Offers ------------------ **/
router.get('/offer/verify/:id', VerifyOffer);


/** ---------------- Payment ------------------ **/
router.post('/create-payment', CreatePayment);


// we will only move forward to order, once the transaction id is created in 'create-payment'
/** ---------------- Order ------------------ **/
router.post('/create-order', CreateOrder);
router.get('/orders', GetOrders);
router.get('/order/:id', GetOrderById);


export { router as CustomerRoute } 