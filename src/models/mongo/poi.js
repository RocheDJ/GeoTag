import Mongoose from "mongoose";

const { Schema } = Mongoose;

const poiSchema = new Schema({
  name        : String,
  description : String,
  latitude    : Number,
  longitude   : Number,
  categoryID: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
});

export const POI = Mongoose.model("POI", poiSchema);
