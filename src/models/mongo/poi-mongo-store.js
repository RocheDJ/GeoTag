import { POI } from "./poi.js";
import { Category } from "./category.js";

export const poiMongoStore = {
  async getAllPOI() {
    const poi = await POI.find().lean();
    return poi;
  },

  async addPOI(categoryId, poi) {
    poi.categoryid = categoryId;
    const newPoi = new POI(poi);
    const PoiObj = await newPoi.save();
    return this.getPOIById(PoiObj._id);
  },

  async getPOIByCategoryId(id) {
    const poi = await POI.find({ categoryid: id }).lean();
    return poi;
  },

  async getPOIById(id) {
    if (id) {
      const poi = await POI.findOne({ _id: id }).lean();
      return poi;
    }
    return null;
  },

  async deletePOIById(id) {
    try {
      await POI.deleteOne({ _id: id });
    } catch (error) {
      console.log(`Delete Poi Error = ${  error.description}` );
    }
  },

  async deleteAllPOI() {
    await POI.deleteMany({});
  },

  async updatePOI(poi, updatedPOI) {
    poi.name = updatedPOI.name;
    poi.description = updatedPOI.description;
    poi.latitude = updatedPOI.latitude;
    poi.longitude = updatedPOI.longitude;
    await poi.save();
  },
};
