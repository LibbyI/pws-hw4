import { optional } from "joi";
import * as mongoose from "mongoose";


export const categoryValidTypes = ["CharityEvent","Concert","Conference","Convention","Exhibition",'Festival', "ProductLaunch", "SportsEvent"];

interface Ticket{
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
          return this.start_date <= value; 
        },
        message: 'End date must be after start date'
      }
      
      },
      location: { type: String, required: true },
      tickets: { type: [{name: String,  quantity: Number, price: Number}], required: true, validate: {
        validator: function(value) {
          if (value.length < 1){return false;}
          else{
            for (const item of value){
              if ("name" in item){ if (typeof item["name"] !== "string" || item["name"].trim() == ""){return false;} } else { return false; };
              if ("quantity" in item){ if (typeof item["quantity"] !== "number" || item["quantity"] < 0){return false;} } else {return false;};
              if ("price" in item){ if (typeof item["price"] !== "number" || item["price"] < 0){return false;} } else {return false;};              
              if (Object.keys(item).length != 3){return false;};
            };
            return true;
          }
        },
        message: 'tickect list is not valid'
        }
      },
      image: { type: String, required: false }, 
      isAvailable: { type: Boolean, required: true }
    }
    // { timestamps: true }
  ); // for adding a timestamp in each document.
  
  // Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document.
  // Models are responsible for creating and reading documents from the underlying MongoDB database.
  // https://mongoosejs.com/docs/models.html
  export default mongoose.model<IEvent>("EventType", eventSchema, 'events');