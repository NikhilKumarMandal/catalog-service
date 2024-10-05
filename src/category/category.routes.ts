import express from "express"
import { CategoryController } from "./category.controller";
import categoryValidator from "./category.validator";
import { CategoryService } from "./category.service";
import logger from "../config/logger";
import { asyncWrapper } from "../utils";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../common/constant";
;
const router = express.Router()




const categoryService = new CategoryService()

const categoryController = new CategoryController(categoryService,logger)



router.post("/",
    authenticate,
    canAccess([Roles.ADMIN]),
    categoryValidator,
    asyncWrapper(categoryController.create)
)

router.get("/", categoryController.getAll)
router.get("/:categoryId", asyncWrapper(categoryController.getOne));


export default router;