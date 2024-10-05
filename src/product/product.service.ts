import { paginationLabels } from "../config/paginate";
import productModel from "./product.model";
import { Filter, PaginateQuery, Product } from "./product.type";


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

    async getProductsData(q: string, filters: Filter, paginateQuery: PaginateQuery) {
        const searchQueryRegexp = new RegExp(q, "i");

        const matchQuery = {
            ...filters,
            name: searchQueryRegexp
        }

        const aggregate = productModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                attributes: 1,
                                priceConfiguration: 1,
                            }
                        }
                    ]
                } 
            },
            {
                $unwind: "$category",
            },
        ])

        return productModel.aggregatePaginate(aggregate, {
            ...paginateQuery,
            customLabels: paginationLabels
        })
        
    }
}