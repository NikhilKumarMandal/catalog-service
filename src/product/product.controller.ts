import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ProductService } from "./product.service";
import { Logger } from "winston";
import createHttpError from "http-errors";
import { deleteFromCloudinary, mapToObject, uploadOnCloudinary } from "../utils";
import { AuthRequest } from "../common/types/types";
import { Roles } from "../common/constant";
import mongoose from "mongoose";
import { Filter, ProductEvents } from "./product.type";
import { MessageProducerBroker } from '../common/types/broker';


export class Product {
  constructor(
    private productService: ProductService,
    private logger: Logger,
    private broker: MessageProducerBroker
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate fields
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return next(createHttpError(400, result.array()[0].msg as string));
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      let avatarLocalPath: string | undefined;

      // Handling avatar upload
      if (files && Array.isArray(files['image']) && files['image'].length > 0) {
        avatarLocalPath = files['image'][0].path;
      }
      if (!avatarLocalPath) {
        return next(createHttpError(400, 'AvatarLocalPath is required'));
      }
    
      const uploadResponse = await uploadOnCloudinary(avatarLocalPath);

      if (!uploadResponse || !uploadResponse.url) {
        return next(createHttpError(400, 'Image is required'));
      }
      // Destructuring req.body with proper types
      const {
        name,
        description,
        priceConfiguration,
        attributes,
        tenantId,
        categoryId,
        isPublish,
      } = req.body;

      // Ensure parsing of JSON fields is done correctly
      const product = {
        name,
        description,
        priceConfiguration: JSON.parse(priceConfiguration as string),
        attributes: JSON.parse(attributes as string),
        tenantId,
        categoryId,
        isPublish,
         image: {
          public_id: uploadResponse?.public_id,
          url: uploadResponse?.url
        },
      };

      // Create a new product using ProductService
      const newProduct = await this.productService.create(product);

       await this.broker.sendMessage(
            "product",
            JSON.stringify({
                event_type: ProductEvents.PRODUCT_CREATE,
                data: {
                    id: newProduct._id,
                    // todo: fix the typescript error
                    priceConfiguration: mapToObject(
                        newProduct.priceConfiguration as unknown as Map<
                            string,
                            any
                        >,
                    ),
                },
            }),
        );
      // Send a success response
      res.status(200).json({ id: newProduct._id });
      
    } catch (error) {
      // Handle unexpected errors
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    // Validate fields
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return next(createHttpError(400, result.array()[0].msg as string));
    }

    const { productId } = req.params;

    const product = await this.productService.getProduct(productId);

      if (!product) {
        return next(createHttpError(404, "Product not found"));
    }

    if ((req as AuthRequest).auth.role !== Roles.ADMIN) {
        const tenant = (req as AuthRequest).auth.tenant;
        if (product.tenantId !== tenant) {
            return next(
              createHttpError(
              403,
              "You are not allowed to access this product",
              ),
            );
            }
        }
    

    const deleteOldAvatar = await deleteFromCloudinary(product.image.public_id, 'image');

      if (!deleteOldAvatar) {
      return next(createHttpError(500, "Error deleting old avatar"));
      }
    
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    let avatarLocalPath: string | undefined;

      // Handling avatar upload
    if (files && Array.isArray(files['image']) && files['image'].length > 0) {
      avatarLocalPath = files['image'][0].path;
    }
    
    if (!avatarLocalPath) {
      return next(createHttpError(400, 'AvatarLocalPath is required'));
    }
    
      const uploadResponse = await uploadOnCloudinary(avatarLocalPath);

      if (!uploadResponse || !uploadResponse.url) {
        return next(createHttpError(400, 'Image is required'));
    }
    
    const {
        name,
        description,
        priceConfiguration,
        attributes,
        tenantId,
        categoryId,
        isPublish,
      } = req.body;

      // Ensure parsing of JSON fields is done correctly
      const productToUpdate = {
        name,
        description,
        priceConfiguration: JSON.parse(priceConfiguration as string),
        attributes: JSON.parse(attributes as string),
        tenantId,
        categoryId,
        isPublish,
         image: {
          public_id: uploadResponse?.public_id,
          url: uploadResponse?.url
        },
    };
    

    const updatedProduct = await this.productService.updateProduct(productId, productToUpdate)

    if (!updatedProduct) {
      return next(createHttpError(500,"Something went while updating product details!"))
    }

    this.logger.info("Product updated successfully", { id: productId });

       await this.broker.sendMessage(
            "product",
            JSON.stringify({
                event_type: ProductEvents.PRODUCT_UPDATE,
                data: {
                    id: updatedProduct._id,
                    // todo: fix the typescript error
                    priceConfiguration: mapToObject(
                        updatedProduct.priceConfiguration as unknown as Map<
                            string,
                            any
                        >,
                    ),
                },
            }),
        );
    
    res.json({id: productId})

  }

  index = async (req: Request, res: Response, next: NextFunction) => {

    const { q, tenantId, categoryId, isPublish } = req.query;

    const filters: Filter = {};

    if (isPublish === "true") filters.isPublish = true;
    
    if (tenantId) filters.tenantId = tenantId as string;

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId as string)) {
        filters.categoryId = new mongoose.Types.ObjectId(categoryId as string);
    }


    const products = await this.productService.getProductsData(
        q as string,
        filters,
        {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
          limit: req.query.limit ? parseInt(req.query.limit as string):10,
        },
    );

    console.log("Aggregated Products:", products);

    res.status(200).json(products);
  }
}

