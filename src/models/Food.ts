import mongoose, { Schema, Document } from "mongoose";

export interface FoodDoc extends Document {
    name: string;
    description: string;
    category: string;
    foodType: string;
    readyTime: number;
    price: number;
    rating: number;
    images: [string];
    vendorId: string;
}

const FoodSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    foodType: { type: String, required: true },
    readyTime: { type: Number },
    price: { type: Number, required: true },
    rating: { type: Number },
    images: { type: [String] },
    vendorId: { type: String },
}, {
    toJSON: {
        // modify the output of your documents when they are converted to JSON
        // to return
        transform(doc, ret) {
            delete ret.__v,
            delete ret.createdAt,
            delete ret.updatedAt
        }
    },
    timestamps: true,
});

const Food = mongoose.model<FoodDoc>('food', FoodSchema);

export { Food };