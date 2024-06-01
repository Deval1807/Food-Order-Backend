import mongoose, { Schema, Document } from "mongoose";

export interface TransactionDoc extends Document {
    customerId: string,
    vendorId: string,
    orderId: string,
    orderValue: number,
    offerUsed: string,
    status: string,
    paymentMode: string,
    paymentResponse: string,
}

const TransactionSchema = new Schema({
    customerId: { type: String },
    vendorId: { type: String },
    orderId: { type: String },
    orderValue: { type: Number },
    offerUsed: { type: String },
    status: { type: String },
    paymentMode: { type: String },
    paymentResponse: { type: String }
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

const Transaction = mongoose.model<TransactionDoc>('transaction', TransactionSchema);

export { Transaction };