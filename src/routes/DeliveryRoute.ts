import express from 'express';
import { 
    DeliveryUserRegister,
    DeliveryUserLogin,
    GetDeiveryUserProfile,
    UpdateDeliveryUserProfile,
    UpdateDeliveryUserStatus
} from '../controllers';
import { Authenticate } from '../middlewares';
 
const router = express.Router();

/** No Auth required **/
/** ---------------- Signup / login ------------------ **/
router.post('/register', DeliveryUserRegister);
router.post('/login', DeliveryUserLogin);


/** Auth Required **/
router.use(Authenticate);

/** ---------------- Profile ------------------ **/
router.get('/profile', GetDeiveryUserProfile);
router.patch('/profile', UpdateDeliveryUserProfile)

/** ---------------- Change service status ------------------ **/
router.put('/change-status', UpdateDeliveryUserStatus)

export { router as DeliveryRoute } 