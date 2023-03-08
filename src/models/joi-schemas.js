import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const UserSpec = Joi.object()
    .keys({
      firstName: Joi.string().example("Homer").required(),
      lastName: Joi.string().example("Simpson").required(),
      email: Joi.string().email().example("homer@simpson.com").required(),
      password: Joi.string().example("secret").required(),
      _id: IdSpec,
      __v: Joi.number(),
    })
    .label("UserDetails");

export const UserArray = Joi.array().items(UserSpec).label("UserArray");

// ################ Place of interest Spec #############################
export const PoiSpec = Joi.object()
.keys({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  latitude: Joi.number().required(),
  longitude : Joi.number().required(),
  categoryID: IdSpec,
})
.label("POI");

export const PoiSpecPlus = PoiSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("PoiPlus");

export const PoiArraySpec = Joi.array().items(PoiSpecPlus).label("PoiArray");

// ################ Category Spec         #############################
export const CategorySpec = Joi.object()
.keys({
  title: Joi.string().required().example("Beaches"),
  poi:PoiArraySpec,
  userID:IdSpec,
})
.label("Category");

export const CategorySpecPlus = CategorySpec.keys({
  _id:IdSpec,
  __v: Joi.number(),
})
.label("CategoryPlus");

export const CategoryArraySpec = Joi.array().items(CategorySpecPlus).label("CategoryArray");
