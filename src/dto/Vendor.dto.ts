// data transfer objects

export interface CreateVendorInput {
    name: string;
    ownerName: string;
    foodTypes: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}

export interface VendorLoginInput {
    email: string;
    password: string;
}

export interface VendorPayload {
    _id: any,
    email: string,
    name: string,
}

export interface EditVendorInputs {
    name: string,
    address: string,
    phone: string,
    foodTypes: [string]
}

export interface CreateOfferInputs {
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