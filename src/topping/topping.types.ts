export interface Topping{
    name: string;
    image: {
    public_id: string;  
    url: string;        
    };
    price: number;
    tenantId: string;
}
