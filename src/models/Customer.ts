import mongoose, { Schema, Document, Model } from "mongoose";
import { OrderDoc } from "./Order";

interface CustomerDoc extends Document {
    email: string;
    password: string;
    salt: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    verified: boolean;
    otp: number;
    otp_expiry: Date;
    lat: number;
    lng: number;
    orders: [OrderDoc];
    cart: [any];
}

const CustomerSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    verified: { type: Boolean, required: true },
    otp: { type: Number, required: true },
    otp_expiry: { type: Date, required: true },
    lat: { type: Number },
    lng: { type: Number }, 
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "order"
        }
    ],
    cart: [
        {
            food: { type: Schema.Types.ObjectId, ref: 'food', required: true },
            unit: { type: Number, required: true }
        }
    ]
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

const Customer = mongoose.model<CustomerDoc>('customer', CustomerSchema);

export { Customer }