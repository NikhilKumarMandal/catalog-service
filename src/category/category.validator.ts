import { body } from "express-validator";

export default [
    body('name').exists().withMessage("Category name is requried!").isString().withMessage("Category name should be string!"),

    
    body("priceConfiguration").exists().withMessage("Price Configurration is requried!"),

    body("priceConfiguration.*.priceType").exists().withMessage("Price type is requried").custom((value: "base" | "addtional") => {
        const validKey = ["base", "addtional"];
        if (!validKey.includes(value)) {
            throw new Error(
                `${value} is invalid attribute for priceType fileds.Possible values are: [${validKey.join(
                    ", "
                )}]`
            )
        }
    }),

    body("attributes").exists().withMessage("Attribute is requried!")
    
]