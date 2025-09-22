import Joi from "joi";
import { errorRes } from "../utils/response.js";
const handleValidationError = (res, error) => {
  return errorRes(res, 400, error.details[0].message.replace(/"/g, ""));
};

export const validations = {
  validateSocialLogin: (req, res, next) => {
    const schema = Joi.object({
      social_token: Joi.string().required(),
      type: Joi.number().required(),
      device_token: Joi.string().optional(),
      device_type: Joi.number().optional(),
      device_model: Joi.string().optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateRegister: (req, res, next) => {
    const schema = Joi.object({
      country_code: Joi.string().required(),
      phone_number: Joi.number().required(),
      role: Joi.number().required(),
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      license_number: Joi.string().optional(),
      password: Joi.string().required(),
      email: Joi.string().optional(),
      device_token: Joi.string().optional(),
      device_type: Joi.number().optional(),
      device_model: Joi.string().optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateLogin: (req, res, next) => {
    const schema = Joi.object({
      country_code: Joi.string().required(),
      phone_number: Joi.number().required(),
      device_token: Joi.string().optional(),
      password: Joi.string().required(),
      device_type: Joi.number().optional(),
      device_model: Joi.string().optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateVerifyOtp: (req, res, next) => {
    const schema = Joi.object({
      userId: Joi.string().required(),
      otp: Joi.number().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateResendOtp: (req, res, next) => {
    const schema = Joi.object({
      userId: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateForgotpassword: (req, res, next) => {
    const schema = Joi.object({
      country_code: Joi.string().required(),
      phone_number: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateResetPassword: (req, res, next) => {
    const schema = Joi.object({
      userId: Joi.string().required(),
      password: Joi.string().min(4).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateAddVehicle: (req, res, next) => {
    const schema = Joi.object({
      vehicle_type: Joi.number().required(),
      vehicle_brand: Joi.string().required(),
      vehicle_model: Joi.string().required(),
      manufacturing_year: Joi.string().required(),
      city: Joi.string().optional(),
      owner: Joi.number().required(),
      vehicle_used: Joi.number().required(),
      vehicle_plan: Joi.number().required(),
      fuel_type: Joi.number().required(),
      transmission: Joi.number().required(),
      variant: Joi.number().required(),
      vehicle_price: Joi.number().required(),
      pin: Joi.string().optional(),
      block: Joi.string().optional(),
      flat: Joi.string().optional(),
      posting_date: Joi.string().required(),
      lat: Joi.string().optional(),
      long: Joi.string().optional(),
      vehicle_images: Joi.array().items(Joi.string()).optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateAddTravel: (req, res, next) => {
    const schema = Joi.object({
      travel_name: Joi.string().required(),
      travel_desc: Joi.any().optional(),
      travel_image: Joi.string().optional(),
      start_date: Joi.string().required(),
      end_date: Joi.string().required(),
      accompanied_by: Joi.array().items(Joi.string()).optional(),
    });
    if (req.body.accompanied_by == "") {
      delete req.body.accompanied_by;
    }
    if (
      req.body.accompanied_by &&
      typeof req.body.accompanied_by === "string"
    ) {
      req.body.accompanied_by = req.body.accompanied_by.split(",");
    }
    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateEditTravel: (req, res, next) => {
    const schema = Joi.object({
      travelId: Joi.string().required(),
      travel_name: Joi.string().optional(),
      travel_desc: Joi.any().optional(),
      travel_image: Joi.string().optional(),
      start_date: Joi.string().optional(),
      end_date: Joi.string().optional(),
      accompanied_by: Joi.array().items(Joi.string()).optional(),
      spotId: Joi.string().optional(),
      date: Joi.string().optional(),
      accomodation: Joi.string().optional(),
    });
    if (req.body.accompanied_by == "") {
      delete req.body.accompanied_by;
    }
    if (
      req.body.accompanied_by &&
      typeof req.body.accompanied_by === "string"
    ) {
      req.body.accompanied_by = req.body.accompanied_by.split(",");
    }
    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateAddTrip: (req, res, next) => {
    const schema = Joi.object({
      trip_name: Joi.string().required(),
      trip_desc: Joi.string().required(),
      trip_image: Joi.string().optional(),
      trip_desc: Joi.string().optional(),
      start_date: Joi.string().required(),
      end_date: Joi.string().required(),
      accompanied_by: Joi.array().items(Joi.string()).optional(),
    });
    if (req.body.accompanied_by == "") {
      delete req.body.accompanied_by;
    }
    if (
      req.body.accompanied_by &&
      typeof req.body.accompanied_by === "string"
    ) {
      req.body.accompanied_by = req.body.accompanied_by.split(",");
    }
    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateEditTrip: (req, res, next) => {
    const schema = Joi.object({
      tripId: Joi.string().optional(),
      trip_name: Joi.string().optional(),
      trip_desc: Joi.string().optional(),
      trip_image: Joi.string().optional(),
      trip_desc: Joi.string().optional(),
      start_date: Joi.string().optional(),
      end_date: Joi.string().optional(),
      accompanied_by: Joi.array().items(Joi.string()).optional(),
    });
    if (req.body.accompanied_by == "") {
      delete req.body.accompanied_by;
    }
    if (
      req.body.accompanied_by &&
      typeof req.body.accompanied_by === "string"
    ) {
      req.body.accompanied_by = req.body.accompanied_by.split(",");
    }
    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateAddSpot: (req, res, next) => {
    const schema = Joi.object({
      tripId: Joi.string().optional(),
      spot_images: Joi.array().items(Joi.string()).optional(),
      lat: Joi.string().optional(),
      long: Joi.string().optional(),
      spot_date: Joi.string().optional(),
      spot_time: Joi.string().optional(),
      spot_address: Joi.string().optional(),
      spot_country: Joi.string().optional(),
      spot_caption: Joi.string().optional(),
      accompanied_by: Joi.array().items(Joi.string()).optional(),
      accomodation_hotelId: Joi.string().optional(),
      spot_tip: Joi.string().optional(),
    });

    if (req.body.accompanied_by == "") {
      delete req.body.accompanied_by;
    }
    if (
      req.body.accompanied_by &&
      typeof req.body.accompanied_by === "string"
    ) {
      req.body.accompanied_by = req.body.accompanied_by.split(",");
    }
    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateUpdateSpot: (req, res, next) => {
    const schema = Joi.object({
      spotId: Joi.string().optional(),
      tripId: Joi.string().optional(),
      spot_images: Joi.array().items(Joi.string()).optional(),
      lat: Joi.string().optional(),
      long: Joi.string().optional(),
      spot_date: Joi.string().optional(),
      spot_time: Joi.string().optional(),
      spot_address: Joi.string().optional(),
      spot_country: Joi.string().optional(),
      spot_caption: Joi.string().optional(),
      accompanied_by: Joi.array().items(Joi.string()).optional(),
      accomodation_hotelId: Joi.string().optional(),
      spot_tip: Joi.string().optional(),
    });
    console.log(req.body.accompanied_by, "data");
    if (
      req.body.accompanied_by &&
      typeof req.body.accompanied_by === "string"
    ) {
      req.body.accompanied_by = req.body.accompanied_by.split(",");
    }
    if (
      Array.isArray(req.body.accompanied_by) &&
      req.body.accompanied_by.length === 0
    ) {
      delete req.body.accompanied_by;
    }
    console.log(req.body.accompanied_by, "after");
    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateLikeSpot: (req, res, next) => {
    const schema = Joi.object({
      spotId: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateCommentSpot: (req, res, next) => {
    const schema = Joi.object({
      spotId: Joi.string().required(),
      comment: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateSaveSpot: (req, res, next) => {
    const schema = Joi.object({
      spotId: Joi.any().optional(),
      collectionId: Joi.string().optional(),
      tripId: Joi.string().optional(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateSaveExistingSpot: (req, res, next) => {
    const schema = Joi.object({
      date: Joi.string().required(),
      tripId: Joi.string().required(),
      spotId: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateAddCollection: (req, res, next) => {
    const schema = Joi.object({
      collection_name: Joi.string().required(),
      collection_image: Joi.string().optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateEditCollection: (req, res, next) => {
    const schema = Joi.object({
      collection_name: Joi.string().required(),
      collection_image: Joi.string().optional(),
      collectionId: Joi.string().optional(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateContactUs: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      message: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateFollow: (req, res, next) => {
    const schema = Joi.object({
      userId: Joi.string().required(),
      type: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateCreateRoom: (req, res, next) => {
    const schema = Joi.object({
      created_with: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateAcceptRequest: (req, res, next) => {
    const schema = Joi.object({
      roomId: Joi.string().required(),
      type: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },
  validateDelMessage: (req, res, next) => {
    const schema = Joi.object({
      messageIds: Joi.array().items(Joi.string()).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return handleValidationError(res, error);
    }

    next();
  },


  validateUpdateBaskets: (req, res, next) => {
  const schema = Joi.object({
    basketId: Joi.string().required(),
    basket_name: Joi.string().optional(),
    basket_type: Joi.string().optional(),
    basket_image: Joi.string().optional(),
    products: Joi.array().items(Joi.string()).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return handleValidationError(res, error);
  }

  next();
},

validateAddBaskets: (req, res, next) => {
  const schema = Joi.object({
    basket_name: Joi.string().optional(),
    basket_type: Joi.string().optional(),
    basket_image: Joi.string().optional(),
    products: Joi.array().items(Joi.string()).optional()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return handleValidationError(res, error);
  }

  next();
},

validateUpdateProduct: (req, res, next) => {
  const schema = Joi.object({
    productId: Joi.string().required(),
    product_name: Joi.string().optional(),
    product_type: Joi.string().optional(),
    product_image: Joi.string().optional(),
    product_desc: Joi.string().optional(),
    discount: Joi.number().optional(),
    product_price: Joi.number().optional(),
    total_stock: Joi.number().optional(),
    product_quantity: Joi.number().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return handleValidationError(res, error);
  }

  next();
},

validateAddProduct: (req, res, next) => {
  const schema = Joi.object({
    product_name: Joi.string().optional(),
    product_type: Joi.string().optional(),
    product_image: Joi.string().optional(),
    product_desc: Joi.string().optional(),
    discount: Joi.number().optional(),
    product_price: Joi.number().optional(),
    total_stock: Joi.number().optional(),
    product_quantity: Joi.number().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return handleValidationError(res, error);
  }

  next();
},
 validateCreateProfile : (req, res, next) => {
  const schema = Joi.object({
    profile_image: Joi.string().optional(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    gender: Joi.number().valid(0, 1, 2).optional() 
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return handleValidationError(res, error);
  }

  next();
},
validateCreateAddress : (req, res, next) => {
  const schema = Joi.object({
   delivery_details: Joi.string().allow(null, "").optional(),
    address_details: Joi.string().allow(null, "").optional(),
    name: Joi.string().optional(),
    country_code: Joi.string().optional(),
    phone_number: Joi.number().optional(),
    address_type: Joi.number().valid(0, 1, 2).optional(),
    lat: Joi.number().optional(),
    long: Joi.number().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return handleValidationError(res, error);
  }
  next();
},

validateUpdateAddress : (req, res, next) => {
  const schema = Joi.object({
    delivery_details: Joi.string().allow(null, "").optional(),
    address_details: Joi.string().allow(null, "").optional(),
    name: Joi.string().optional(),
    country_code: Joi.string().optional(),
    phone_number: Joi.number().optional(),
    address_type: Joi.number().valid(0, 1, 2).optional(),
    lat: Joi.number().optional(),
    long: Joi.number().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
   return handleValidationError(res, error);
  }
  next();
}

};
