import express from "express"
import { asyncWrapper } from "../utils";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../common/constant";
import createProductValidator from "./createProduct.validator";
import { Product } from "./product.controller";
import { ProductService } from "./product.service";
import logger from "../config/logger";
import { upload } from "../middlewares/multer";
import updateProductValidator from "./update.product.validator";
// import { upload } from "../middlewares/multer";

const router = express.Router()


const productService = new ProductService()

const productController = new Product(productService,logger)



router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN,Roles.MANAGER]),
    upload.fields([
        {
            name: "image",
            maxCount: 1
        }, 
        
    ]),
    createProductValidator,
    asyncWrapper(productController.create)
)

router.patch(
    "/:productId",
    authenticate,
    canAccess([Roles.ADMIN,Roles.MANAGER]),
    upload.fields([
        {
            name: "image",
        }, 
    ]),
    updateProductValidator,
    asyncWrapper(productController.update)
)

router.get( "/", asyncWrapper(productController.index))



export default router;