import express from 'express';
import { 
    createStore, 
    deleteStore, 
    updateStore,
    listStores,
    getStore,
    replaceStore,
    publicStoresHandler
} from '../controllers/stores.controllers.js';
import authorize from '../middlewares/authorize.middlewares.js';
const storeRouter = express.Router();
import { upload } from '../utils/multer/multer.utils.js';

storeRouter.post('/create',  authorize, createStore);
storeRouter.get('/', publicStoresHandler);
storeRouter.get('/listAll', authorize, listStores);
storeRouter.get('/getOne/:id', authorize, getStore);
storeRouter.put('/replace/:id', authorize, replaceStore);

storeRouter.patch(
  "/update/:id",
  authorize,
  upload.single("uploadedFile"),
  updateStore
);

storeRouter.delete('/delete/:id', authorize, deleteStore);

export default storeRouter;
