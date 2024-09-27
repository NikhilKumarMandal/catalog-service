import mongoose from "mongoose";
import { Attributes, Category, PriceConfiguration } from "./category.types";



const attributesSchema = new mongoose.Schema<Attributes>({
    name: {
        type: String,
        required: true
    },
    widgetType: {
        type: String,
        enum: ['switch', 'radio'],
        required: true
    },
    defaultValue: {
        type: mongoose.Schema.Types.Mixed,
        required:true
    },
    availabelOptions: {
        type: [String],
        required:true
    }
})

const priceConfigurationSchema = new mongoose.Schema<PriceConfiguration>({
    priceType: {
        type: String,
        enum: ["base", "aditional"],
        required: true 
    },
    availabelOptions: {
        type: [String],
        required:true

    }
})

const productSchema = new mongoose.Schema<Category>({
    name: {
        type: String,
        required: true
    },
    priceConfiguration: {
        type: Map,
        of: priceConfigurationSchema,
        required: true
    },
    attributes: {
        type: [attributesSchema],
        required:true
    }
},
    {
        timestamps: true
    })

export default mongoose.model("Product", productSchema);