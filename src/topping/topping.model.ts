import mongoose from "mongoose";
import { Topping } from "./topping.types";

const toppingSchema = new mongoose.Schema<Topping>({
    name: {
        type: String,
        required: true,
        lowercase: true
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
    price: {
        type: Number,
        required: true
    },
    tenantId: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);

export default mongoose.model<Topping>("Topping",toppingSchema)