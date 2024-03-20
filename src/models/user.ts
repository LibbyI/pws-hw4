import * as mongoose from "mongoose";
export const permissionValidTypes = ["None", "A", "M", "W"];

export interface IUser {
    username: string;
    password: string;
    permission: string;
    eventIds: String[];
    nearestEvent: Object;
}

export interface scrabedIUser {
  id: string | null;
  username: string | null;
  eventIds: String[] | null;
  token: string | null;
  nextEvent: Object | null;
}

export const userSchema = new mongoose.Schema(
    {
      username: { type: String, unique:true, required: true }, //TODO: add validation to uniqe name befor saving!!
      password: { type: String, required: true },
      permission: {type: String, required: true, enum: permissionValidTypes},  //TODO:change type
      eventIds: {type: [String], required: false, default: []},  //TODO:change type
      nearestEvent: {type: Object, require:false, default: null}, 
    },
    { timestamps: true }
  ); // for adding a timestamp in each document.


  userSchema.pre('save', function (next) {
    var self = this;
    User.find({username : self.username}, function (err, docs) {
        if (!docs.length){
            next();
        }else{                
            next(new Error("User exists!"));
        }
    });
}) ;
  
  // Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document.
  // Models are responsible for creating and reading documents from the underlying MongoDB database.
  // https://mongoosejs.com/docs/models.html

  var User = mongoose.model<IUser>('User' , userSchema, 'users');

  export default mongoose.model("User", userSchema);