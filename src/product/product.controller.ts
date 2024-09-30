import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ProductService } from "./product.service";
import { Logger } from "winston";
import createHttpError from "http-errors";
import { uploadOnCloudinary } from "../utils";


export class Product {
  constructor(
    private productService: ProductService,
    private logger: Logger
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

      console.log(avatarLocalPath);
    
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

      // Send a success response
      res.status(200).json({ id: newProduct._id });
      
    } catch (error) {
      // Handle unexpected errors
      next(error);
    }
  };
}

