
export const categoryValidTypes = ["CharityEvent","Concert","Conference","Convention","Exhibition",'Festival', "ProductLaunch", "SportsEvent"];

export interface Ticket{
    name: string;
    quantity: number;
    price: number;
    original_quantity: number;
}
export interface IEvent {
    _id: string;
    title: string;
    category: string;
    description: string;
    organizer: string;
    start_date: Date;
    end_date: Date;
    location: string;
    tickets: Ticket[];
    image?: string;
  }


