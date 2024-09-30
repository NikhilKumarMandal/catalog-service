import mongoose from "mongoose";


const priceConfigurationSchema = new mongoose.Schema({
    priceType: {
        type: String,
        enum: ["base","addtional"]
    },
    availableOptions: {
        type: Map,
        of: Number
    }
})


const attributesValuesSchema = new mongoose.Schema({
    name: {
        type: String
    },
    value: {
        type: mongoose.Schema.Types.Mixed
    }
})


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    priceConfiguration: {
        type: Map,
        of: priceConfigurationSchema
    },
    attributes: [attributesValuesSchema],
    tenantId: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    isPublish: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export default mongoose.model("Category", categorySchema);