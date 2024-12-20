import { Router } from "express";
import authenticate from "../middlewares/authenticate";
import { ToppingController } from "./topping.controller";
import { ToppingService } from "./topping.services";
import logger from "../config/logger";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../common/constant";
import { upload } from "../middlewares/multer";
import { asyncWrapper } from "../utils";
import { createMessageProducerBroker } from "../common/factories/brokerFactory";

const router = Router();
const toppingService = new ToppingService()
const broker = createMessageProducerBroker(); 
const toppingCotroller = new ToppingController(toppingService,logger,broker)

router.post(
    "/create",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    upload.fields([
        {
            name: "image",
            maxCount: 1
        }, 
        
    ]),
    asyncWrapper(toppingCotroller.create)
)

router.get("/", asyncWrapper(toppingCotroller.get));
export default router