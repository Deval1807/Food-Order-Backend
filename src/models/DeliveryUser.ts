import mongoose, { Schema, Document, Model } from "mongoose";
import { OrderDoc } from "./Order";

interface DeliveryUserDoc extends Document {
    email: string;
    password: string;
    salt: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    pincode: string;
    verified: boolean
    lat: number;
    lng: number;
    isAvailable: boolean
}

const DeliveryUserSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    pincode: { type: String },
    verified: { type: Boolean, required: true },
    lat: { type: Number },
    lng: { type: Number },
    isAvailable: { type: Boolean, default: false }
}, {
    // after creating the Customer, while returning it, we dont need all the info like salt and hashed password and all.
    // modify the output of your documents when they are converted to JSON
    // for controlling what data is sent to clients, ensuring sensitive information is not exposed
    toJSON: {
        transform(doc, ret){
            delete ret.password,
            delete ret.salt,
            delete ret.createdAt,  
            delete ret.updatedAt,
            delete ret.__v
        }
    },
    timestamps: true
});

const DeliveryUser = mongoose.model<DeliveryUserDoc>('delivery_user', DeliveryUserSchema);

export { DeliveryUser }