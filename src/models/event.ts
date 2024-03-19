import { optional } from "joi";
import * as mongoose from "mongoose";


export const categoryValidTypes = ["CharityEvent","Concert","Conference","Convention","Exhibition",'Festival', "ProductLaunch", "SportsEvent"];

export interface Ticket{
    name: string;
    quantity: number;
    price: number;
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
    tickets: mongoose.Types.DocumentArray<Ticket>;
    image?: string;
  }

const eventSchema = new mongoose.Schema<IEvent,mongoose.Model<IEvent>>(
    {
      title: { type: String, required: true, validate: {
        validator: function(value) {
          return value.length > 0; 
        },
        message: 'cant be empty'
        } 
      },
      category: { type: String, required: true, enum: categoryValidTypes },
      description: { type: String, required: true },
      organizer: { type: String, required: true },
      start_date: { type: Date, required: true },
      end_date: { type: Date, required: true, validate: {
        validator: function(value) {
          value.a
        },
        message: 'End date must be after start date'
      }
      
      },
      location: { type: String, required: true },
      tickets: { type: [{
        name: { type: String, required: true , minlength: [1, 'ticket type cant be empty']},
        quantity: { type: Number, required: true, min: [0, 'quantity must be greater than 0']},
        price: { type: Number, required: true, min: [0, 'price must be greater than 0']}
    }], required: true,
      },
      image: { type: String, required: false }
    }
  ); 


  export default mongoose.model<IEvent>("EventType", eventSchema, 'events');