import Service from '../db/schema/services.models.js';
import Store from '../db/schema/stores.models.js';
import dotenv from 'dotenv';

dotenv.config();

export const createStore = async (req, res, next) => {
  try {
    const user = req.user;
    const { storename, category, coordinates, address, description } = req.body;
    if (!storename || !category || !description  || !address || !coordinates) {
      return res.status(400).json({ success: false, message: "please send all fields required." });
    }
    // Validate category manually (optional – already in schema enum)
    const allowedCategories = [
      'salon', 'counselling', 'physiotherapy', 'business consultant', 'hospital', 'dental clinic',
      'spa', 'personal trainer', 'yoga instructor', 'legal consultant', 'nutritionist', 'diagnostic center',
      'veterinary clinic', 'home cleaning', 'appliance repair', 'driving school', 'photography studio',
      'makeup artist', 'tattoo studio', 'massage therapy', 'astrology'
    ];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ success: false, message: `Invalid category: ${category}` });
    }

    const display_name = address?.display_name;
    const city = address?.address?.city 
    || address?.address?.state_district
    || address?.address?.district;
    const country = address?.address?.country;
    const state = address?.address?.state;
    const postalCode = address?.address?.postcode;

    
    const newStore = new Store({
      name: storename,
      owner: user?._id,
      ownername: user?.userName,
      category,
      location: {
       city,
       state,
       postalCode,
       country,
       address: display_name
      },
      description,
      coordinates: [
        coordinates?.lat,
        coordinates?.lon
      ]
    });

    

    const savedStore = await newStore.save();

    return res.status(201).json({
      success: true,
      message: "Store created successfully.",
      savedStore
    });
  } catch (error) {
    console.error("Error occurred while creating a store:", error);
    next(error);
  }
};




export const deleteStore = async (req, res, next) => {
  try {
    const _id = req.params.id;

    // Check if store exists
    const existsStore = await Store.findById(_id);
    if (!existsStore) {
      console.log(`store does not exist`);
      return res.status(404).json({
        type: `error`,
        message: `Store does not exist`,
      });
    }

    // Delete all services for this store
    const servicesDeletedResponse = await Service.deleteMany({ store: _id });
    console.log(
      `Deleted ${servicesDeletedResponse.deletedCount} services for store ${_id}`
    );

    // Delete the store
    const storeDeletedResponse = await Store.findByIdAndDelete(_id);
    if (!storeDeletedResponse) {
      console.log(`error while deleting store`);
      return res.status(500).json({
        type: `error`,
        message: `Error while deleting store`,
      });
    }

    res.status(200).json({
      type: `success`,
      message: `Store and related services deleted successfully`,
      deletedStore: storeDeletedResponse,
    });
  } catch (error) {
    console.log(`error while deleting store`, error);
    next(error);
  }
};



export const updateStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    const updatedStore = await Store.findOneAndUpdate(
      { _id: id, owner: userId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedStore) {
      return res.status(404).json({ message: 'Store not found or not authorized.' });
    }

    res.status(200).json({
      success: true,
      message: 'Store updated successfully.',
      store: updatedStore,
    });
  } catch (error) {
    console.error('Error in updateStore:', error);
    next(error);
  }
};


export const listStores = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const stores = await Store.find({ owner: userId });

    res.status(200).json({
      success: true,
      message: 'Stores retrieved successfully.',
      stores,
    });
  } catch (error) {
    console.error('Error in listStores:', error);
    next(error);
  }
};


export const publicStoresHandler = async (req, res, next) => {
try {
    const stores = await Store.find();

    res.status(200).json({
      success: true,
      message: 'Stores retrieved successfully.',
      stores,
    });
  } catch (error) {
    console.error('Error in listStores:', error);
    next(error);
  }
};


export const getStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const store = await Store.findOne({ _id: id, owner: userId });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found or not authorized.',
      });
    }

    res.status(200).json({
      success: true,
      store,
    });
  } catch (error) {
    console.error('Error in getStore:', error);
    next(error);
  }
};


export const replaceStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { name, category, imageUrl, location } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: 'Store name and category are required.' });
    }

    const updatedStore = await Store.findOneAndReplace(
      { _id: id, owner: userId },
      { name, category, imageUrl, location, owner: userId },
      { new: true }
    );

    if (!updatedStore) {
      return res.status(404).json({ message: 'Store not found or not authorized.' });
    }

    res.status(200).json({
      success: true,
      message: 'Store replaced successfully.',
      store: updatedStore,
    });
  } catch (error) {
    console.error('Error in replaceStore:', error);
    next(error);
  }
};





