import mongoose, { Schema, Document, Model } from "mongoose";

interface VendorDoc extends Document {
    name: string;
    ownerName: string;
    foodTypes: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    serviceAvailabe: boolean;
    coverImages: [string];
    rating: number;
    foods: any;
    lat: number;
    lng: number;
}

const VendorSchema = new Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodTypes: { type: [String]},
    pincode: { type: String, required: true },
    address: { type: String},
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailabe: { type: Boolean},
    coverImages: { type: [String] },
    rating:{ type: Number},
    foods: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'food'
    }],
    lat: { type: Number},
    lng: { type: Number}
}, {
    // after creating the vendor, while returning it, we dont need all the info like salt and hashed password and all.
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

const Vendor = mongoose.model<VendorDoc>('vendor', VendorSchema);

export { Vendor }