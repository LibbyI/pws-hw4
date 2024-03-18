import { optional } from "joi";
import * as mongoose from "mongoose";


export const categoryValidTypes = ["CharityEvent","Concert","Conference","Convention","Exhibition",'Festival', "ProductLaunch", "SportsEvent"];

interface Ticket{
    name: string;
    quantity: number;
    price: number;
}
const ticketSchema = new mongoose.Schema<Ticket,mongoose.Model<Ticket>>(
  {
    name: { type: String, required: true , minlength: [1, 'ticket type cant be empty']},
    quantity: { type: Number, required: true, min: [1, 'quantity must be greater than 0']},
    price: { type: Number, required: true, min: [1, 'price must be greater than 0']}
  }
);

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
    isAvailable?: boolean;
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
        quantity: { type: Number, required: true, min: [1, 'quantity must be greater than 0']},
        price: { type: Number, required: true, min: [1, 'price must be greater than 0']}
    }], required: true,
      },
      image: { type: String, required: false }, 
      isAvailable: { type: Boolean }
    }
    // { timestamps: true }
  ); // for adding a timestamp in each document.
  
  // Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document.
  // Models are responsible for creating and reading documents from the underlying MongoDB database.
  // https://mongoosejs.com/docs/models.html
  export default mongoose.model<IEvent>("EventType", eventSchema, 'events');