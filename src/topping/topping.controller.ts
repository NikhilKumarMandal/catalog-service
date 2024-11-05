import { NextFunction, Request,Response } from "express"
import { ToppingService } from "./topping.services"
import { Logger } from "winston"
import { uploadOnCloudinary } from "../utils";
import { Topping } from "./topping.types";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";

export class ToppingController{
    constructor(
        private toppingService: ToppingService,
        private logger: Logger
    ) { }
    
    create = async (req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
        return next(createHttpError(400, result.array()[0].msg as string));
        }
        try {
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
            
        console.log(req.body.tenantId);
        
            
        const savedTopping = await this.toppingService.create({
            ...req.body,
            image: {
                public_id: uploadResponse.public_id,
                url: uploadResponse.url 
            },
            tenantId: req.body.tenantId,
        } as Topping);
        
        this.logger.info("Topping created successfully!")
            
        res.json({ id: savedTopping._id });
            
        } catch (error) {
            return next(error);
        }
    }
}


