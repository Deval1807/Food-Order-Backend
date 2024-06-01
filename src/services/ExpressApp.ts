import express, { Application } from "express";
import path from 'path';

import { AdminRoute, ShoppingRoute, VendorRoute, CustomerRoute, DeliveryRoute } from "../routes";

// Taking app as a dependency from outside
// Execute all the express related things and return back the app
export default async (app: Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }))
    
    const imagePath = path.join(__dirname,'../images');        
    app.use('/images', express.static(imagePath));
        
    app.use('/admin', AdminRoute);
    app.use('/vendor', VendorRoute);
    app.use('/customer', CustomerRoute)
    app.use('/shopping', ShoppingRoute);
    app.use('/delivery', DeliveryRoute);

    return app;
}


