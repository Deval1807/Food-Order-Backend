import mongoose, { Schema, Document } from "mongoose";

export interface OrderDoc extends Document {
    orderId: string,
    vendorId: string,
    items: [any],   // [{ food, unit }]
    totalAmount: number,
    paidAmount: number,
    orderDate: Date,
    orderStatus: string,
    remarks: string,
    deliveryId: string,
    readyTime: number,    // max 60 mins

}

const OrderSchema = new Schema({
    orderId: { type: String, required: true },
    vendorId: { type: String, required: true },
    items: [
        {
            food: { type: Schema.Types.ObjectId, ref: "food", required: true },
            unit: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    orderDate: { type: Date },
    orderStatus: { type: String },
    remarks: { type: String },
    deliveryId: { type: String },
    readyTime: { type: Number }
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

const Order = mongoose.model<OrderDoc>('order', OrderSchema);

export { Order };