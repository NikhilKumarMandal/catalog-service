import mongoose from "mongoose";

export interface PriceConfiguration{
    [key: string]: {
        priceType: "base" | "addtional";
        availabelOptions: string[];
    }
}

export interface Attributes {
    name: string;
    widgetType: 'switch' | 'radio';
    defaultValue: string;
    availabelOptions: string[];
}

export interface Category {
    name: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attributes[];
}

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
        enum: ["base", "addtional"],
        required: true 
    },
    availabelOptions: {
        type: [String],
        required:true

    }
})

const categorySchema = new mongoose.Schema<Category>({
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
})

export default mongoose.model("Category", categorySchema);