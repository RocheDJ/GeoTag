/* eslint-disable func-names */
import Boom from "@hapi/boom";
import { db } from "../models/db.js";


export const categoryApi = {
    find: {
      auth: false,
      handler: async function (request, h) {
        try {
          const categories = await db.categoryStore.getCategories();
          return categories;
        } catch (err) {
          return Boom.serverUnavailable("Database Error");
        }
      },
    },
  create: {
      auth: false,
      handler: async function (request, h) {
        try {
          const cat = await db.categoryStore.addCategory(request.payload);
          if (cat) {
            return h.response(cat).code(201);
          }
          return Boom.badImplementation("error creating user");
        } catch (err) {
          return Boom.serverUnavailable("Database Error");
        }
      },
    },
  deleteAll: {
      auth: false,
      handler: async function (request, h) {
        try {
          await db.categoryStore.deleteAllCategories();
          return h.response().code(204);
        } catch (err) {
          return Boom.serverUnavailable("Database Error");
        }
      },
    },

  findOne: {
      auth: false,
      handler: async function (request, h) {
        try {
          const cat = await db.categoryStore.getCategoryById(request.params.id);
          if (!cat) {
            return Boom.notFound("No category with this id");
          }
          return cat;
        } catch (err) {
          return Boom.serverUnavailable("No category with this id");
        }
      },
    },
  
}
