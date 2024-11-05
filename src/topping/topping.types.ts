export interface Topping{
    _id?: string
    name: string;
    image: {
    public_id: string;  
    url: string;        
    };
    price: number;
    tenantId: string;
}

export enum ToppingEvents {
    TOPPING_CREATE = "TOPPING_CREATE",
    TOPPING_UPDATE = "TOPPING_UPDATE",
    TOPPING_DELETE = "TOPPING_DELETE",
}