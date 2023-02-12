import { userApi } from "./api/user-api.js";
import { categoryApi } from "./api/category-api.js";

export const apiRoutes = [
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },
  
  { method: "GET", path: "/api/category", config: categoryApi.find },
  { method: "DELETE", path: "/api/category",config: categoryApi.deleteAll},
  { method: "POST", path: "/api/category",config: categoryApi.create},
  { method: "GET", path: "/api/category/{id}", config: categoryApi.findOne },
];
