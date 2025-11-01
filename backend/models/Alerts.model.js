import mongoose, { Schema } from "mongoose";

const alertSchema=new Schema({
    email:String,
    coin:String,
    targetPrice:Number,
    condition:{type:String ,enum:["above" , "below"]},
    triggered:{type:Boolean , default:false}

},{timestamps:true})

export default mongoose.model("Alerts",alertSchema)