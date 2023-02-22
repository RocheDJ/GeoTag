import Mongoose  from "mongoose";
import { Category } from "./category.js";
import { poiMongoStore } from "./poi-mongo-store.js";

export const categoryMongoStore = {
  async getAllCategories() {
    const categories = await Category.find().lean();
    return categories;
  },

  async getCategoryById(id) {
    if (Mongoose.Types.ObjectId.isValid(id)){   
      const category = await Category.findOne({ _id: id }).lean();
      if (category) {
        category.poi = await poiMongoStore.getPOIByCategoryId(category._id);
      }
      return category;
    }
    return null;
  },

  async getCategoryPOIById(id) {
    if (Mongoose.Types.ObjectId.isValid(id)){  
      const list = await Category.find({ _id: id }).lean;
      if (list) {
        list.poi = await poiMongoStore.getPOIByCategoryId(list._id);
        return list;
      }
    }
    return null;
  },
  async addCategory(category) {
    const newCategory = new Category(category);
    const categoryObj = await newCategory.save();
    return this.getCategoryById(categoryObj._id);
  },

  async getUserCategories(id) {
    try {
      const category = await Category.find({ userid: id }).lean();
      if (category) {
        return category;
      }
    } catch (error) {
      console.log(`Delete Poi Error = ${  error.description}` );
    } return null;
  },

  async deleteCategoryById(id) {
    try {
      await Category.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllCategories() {
    await Category.deleteMany({});
  },
};