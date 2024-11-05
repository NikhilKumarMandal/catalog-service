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
