import productModel from "./product.model";
import { Product } from "./product.type";


export class ProductService{
    async create(product: Product) {
        return await productModel.create(product)
    }
}