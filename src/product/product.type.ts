import mongoose from "mongoose";

export interface Product {
    _id?: mongoose.Types.ObjectId;
    name: string;
    description: string;
    priceConfiguration: string;
    attributes: string;
    tenantId: string;
    categoryId: string;
    image: {
    public_id: string;  
    url: string;        
  };
}

export interface Filter {
    tenantId?: string;
    catagoryId?: mongoose.Types.ObjectId;
    isPublish?: boolean
}

export interface PaginateQuery {
    page: number;
    limit: number;
}