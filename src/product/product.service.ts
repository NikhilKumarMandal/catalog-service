import productModel from "./product.model";
import { Product } from "./product.type";


export class ProductService{
    async create(product: Product) {
        return await productModel.create(product)
    }

    async getProduct(productId: string): Promise<Product | null>{
        return await productModel.findOne({_id: productId})
    }

    async updateProduct(productId: string, product: Product) {
        return (await productModel.findByIdAndUpdate(
            { _id: productId },
            {
                $set: product
            },
            {
                new: true
            }
        )) as Product;
    }
}