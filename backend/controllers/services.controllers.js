import Store from "../db/schema/stores.models.js";
import Service from "../db/schema/services.models.js";

export const createService = async (req, res, next) => {
  try {

    const {servicename, description, price, currency, servicetime, startHour, endHour, storeId} = req.body;
    const user = req.user;

    if (!servicename || !price || !currency || !servicetime || !startHour || !endHour || !storeId) {
      return res.status(400).json({
        message: "servicename, price, currency, servicetime, startHour, endHour, and storeId are required.",
      });
    }
    
    const newService = new Service({
      name: servicename,                  // match schema field
      description,
      price,
      currency,
      serviceTime: servicetime,          // match schema field
      provider: user._id,                          // must be a valid ObjectId string
      store: storeId,                             // must be a valid ObjectId string
      workingHours: {
        start: startHour,
        end: endHour
      },                          // optional
    });
    
    const savedService = await newService.save();

    res.status(201).json({
      success: true,
      message: "Service created successfully.",
      service: savedService,
    });
  } catch (error) {
    console.error("Error in createService:", error);
    next(error);
  }
};

export const listAll = async (req, res, next) => {
  try {
    const services = await Service.find();
    console.log('services: ', services);

    // Option 1: Basic fix using for...of
    const enrichedServices = [];

    for (const service of services) {
      const store = await Store.findById(service.store);
      const serviceObj = service.toObject(); // Convert to plain JS object
      serviceObj.location = store?.location;
      serviceObj.category = store.category;
      enrichedServices.push(serviceObj);
    }

    console.log(`enrichedServices: `, enrichedServices);

    res.status(200).json({
      success: true,
      services: enrichedServices,
    });
  } catch (error) {
    console.error("Error in listAll:", error);
    next(error);
  }
};



export const listServices = async (req, res, next) => {
  try {
    const userId = req.user._id;
    

    const services = await Service.find({ provider: userId }).populate("store");

    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    console.error("Error in listServices:", error);
    next(error);
  }
};


export const getService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const service = await Service.findOne({
      _id: id,
      provider: userId,
    }).populate("store");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found or not authorized.",
      });
    }

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Error in getService:", error);
    next(error);
  }
};



export const replaceService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const {
      name,
      category,
      price,
      currency,
      store
    } = req.body;

    if (!name || !price || !currency || !store) {
      return res.status(400).json({
        message: "name, price, currency, and store are required.",
      });
    }

    const imageUrl = req.file ? req.file.path : null;

    const updatedService = await Service.findOneAndReplace(
      { _id: id, provider: userId },
      {
        name,
        category,
        price,
        currency,
        store,
        imageUrl,
        provider: userId,
      },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found or not authorized.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service replaced successfully.",
      service: updatedService,
    });
  } catch (error) {
    console.error("Error in replaceService:", error);
    next(error);
  }
};




export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const updateData = { ...req.body };

    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const updatedService = await Service.findOneAndUpdate(
      { _id: id, provider: userId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found or not authorized.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      service: updatedService,
    });
  } catch (error) {
    console.error("Error in updateService:", error);
    next(error);
  }
};




export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const service = await Service.findOneAndDelete({
      _id: id,
      provider: userId,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found or not authorized.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteService:", error);
    next(error);
  }
};






