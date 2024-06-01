import express from 'express';
import { FindRestaurantById, 
    GetFoodAvailability,
    GetFoodIn30Mins, 
    GetOffersByPincode, 
    GetTopRestaurants, 
    SearchFoods 
} from '../controllers';

const router = express.Router();

/** ---------------- Food Availibiltiy ------------------ **/
router.get('/:pincode', GetFoodAvailability)

/** ---------------- Top Restaurants ------------------ **/
router.get('/top-restaurants/:pincode', GetTopRestaurants)

/** ---------------- Foods available in 30 minutes ------------------ **/
router.get('/food-in-30/:pincode', GetFoodIn30Mins)

/** ---------------- Search Foods ------------------ **/
router.get('/search/:pincode', SearchFoods)

/** ---------------- Find Offers ------------------ **/
router.get('/offers/:pincode', GetOffersByPincode) 

/** ---------------- Find Restaurant by ID ------------------ **/
router.get('/restaurant/:id', FindRestaurantById)

export { router as ShoppingRoute }