/**
 * Vendor can add vendor specific offer
 * Admin can add generic offers
 * Customer can access all offers.
 */

import mongoose, { Schema, Document } from "mongoose";

export interface OfferDoc extends Document {
    offerType: string,      // vendor | generic
    vendors: [any],         // ['<vendorId>']
    title: string,
    description: string,
    minimumValue: number,   // Minimum order amount required for the offer to avail
    offerAmount: number,    
    startValidity: Date,
    endValidity: Date,
    promocode: string,      // WEEK20
    promotype: string,      // user | bank | card | all
    bank: [any],   
    bins: [any],
    pincode: string,        // offer available for specific area
    isActive: boolean

}

const OfferSchema = new Schema({
    offerType: { type: String, required: true },
    vendors: [
        {
            type: Schema.Types.ObjectId, ref: 'vendor'
        }
    ],
    title: { type: String, required: true },
    description: { type: String },
    minimumValue: { type: Number, required: true },
    offerAmount: { type: Number, required: true },  
    startValidity: { type: Date },
    endValidity: { type: Date },
    promocode: { type: String, required: true },
    promotype: { type: String, required: true },
    bank: [
        { 
            type: String 
        }
    ],
    bins: [
        {
            type: Number
        }
    ],
    pincode: { type: String, required: true },
    isActive: { type: Boolean }
}, {
    toJSON: {
        // modify the output of your documents when they are converted to JSON
        // to return
        transform(doc, ret) {
            delete ret.__v
        }
    },
    timestamps: true,
});

const Offer = mongoose.model<OfferDoc>('offer', OfferSchema);

export { Offer };