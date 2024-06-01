import express, { Request, Response, NextFunction } from 'express';
import { AddFood, 
    AddOffer, 
    EditOffer, 
    GetCurrentOrders, 
    GetFoods, 
    GetOffers, 
    GetOrderDetails, 
    GetVendorProfile, 
    ProcessOrder, 
    UpdateVendorCoverImage, 
    UpdateVendorProfile, 
    UpdateVendorService, 
    VendorLogin 
} from '../controllers';
import { Authenticate } from '../middlewares';
import multer from 'multer'; // for file upload functionalities

const router = express.Router();
 
/**
 * Setting up Multer to store the images it ./images directory
 */
const imageStorage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null, 'images')
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + '_' + file.originalname);
    }
})

const images = multer({ storage: imageStorage}).array('images', 10);


/** ---------------- Vendor login ------------------ **/
router.post('/login', VendorLogin)

router.use(Authenticate)

/** ---------------- Vendor Profile ------------------ **/
router.get('/profile', GetVendorProfile)
router.patch('/profile',  UpdateVendorProfile)
router.patch('/coverimage', images, UpdateVendorCoverImage)

/** ---------------- Update Vendor service availability ------------------ **/
router.patch('/service',  UpdateVendorService)

/** ---------------- Food ------------------ **/
router.post('/food', images, AddFood)
router.get('/foods', GetFoods)


/** ---------------- Orders ------------------ **/
router.get('/orders', GetCurrentOrders);
router.get('/order/:id', GetOrderDetails);
router.put('/order/:id/process', ProcessOrder); 


/** ---------------- Offers ------------------ **/
router.get('/offers', GetOffers);
router.post('/offer', AddOffer);
router.put('/offer/:id', EditOffer);
// delete offer 

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({msg: "Hello form vendor"}) 
}) 

export { router as VendorRoute }