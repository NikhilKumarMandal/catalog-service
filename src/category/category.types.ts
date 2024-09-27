export interface PriceConfiguration{
    [key: string]: {
        priceType: "base" | "aditional";
        availabelOptions: string[];
    }
}

export interface Attributes {
    name: string;
    widgetType: 'switch' | 'radio';
    defaultValue: string;
    availabelOptions: string[];
}

export interface Category {
    name: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attributes[];
}