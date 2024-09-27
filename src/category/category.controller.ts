import {Request,Response } from "express";
import { validationResult } from "express-validator";
import { Category } from "./category.types";
import { CategoryService } from "./category.service";
import { Logger } from "winston";



export class CategoryController {
    constructor(
        private categoryService: CategoryService,
        private logger: Logger) { 
        this.create = this.create.bind(this);
        }

    async create(req: Request, res: Response,) {
    // validated fields
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
        
        const { name, priceConfiguration, attributes } = req.body as Category
        

        const category = await this.categoryService.create({
            name,
            priceConfiguration,
            attributes
        })

        this.logger.info(`Create Category`,{id:category._id})

    
        res.json({id:category._id})
    }

    async getAll(req: Request, res: Response) {
        
        const categories = await this.categoryService.getAll();

        this.logger.info("Fetched Category Details");

        res.status(201).json(categories)
    }
}