import * as mongoose from "mongoose";

export interface Icomment {
    eventId: string;
    author: string;
    date: Date;
    content: string;
  }

const commentsSchema = new mongoose.Schema<Icomment,mongoose.Model<Icomment>>(
    {
      eventId: { type: String, required: true }, 
      author: { type: String, required: true },
      date: {type: Date, required: true},
      content: {type: String, required: false, validate: {
        validator: function(value: any) {
          return value.length > 0; 
        },
        message: 'cant be empty'
        } 
      },
    },
       
    { timestamps: true }
  ); // for adding a timestamp in each document.
  export default mongoose.model<Icomment>("CommentType", commentsSchema, 'comments');
