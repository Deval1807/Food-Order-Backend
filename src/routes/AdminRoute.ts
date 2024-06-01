import express, { Request, Response, NextFunction } from 'express';
import { CreateVendor, 
    GetVendors, 
    GetVendorById, 
    GetTransactions,
    GetTransactionById,
    GetDeliveryUsers,
    VerifyDeliveryUser
} from '../controllers';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({msg: "Hello form admin"})
});


/** ---------------- Vendors ------------------ **/
router.post('/vendor', CreateVendor);
router.get('/vendor', GetVendors);
router.get('/vendor/:id', GetVendorById);


/** ---------------- Transactions ------------------ **/
router.get('/transactions', GetTransactions);
router.get('/transaction/:id', GetTransactionById);


/** ---------------- Delivery User ------------------ **/
router.get('/delivery-users', GetDeliveryUsers)
router.put('/delivery-user/verify', VerifyDeliveryUser)

export { router as AdminRoute }