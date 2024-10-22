import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getAllContacts, getContactById } from '../services/contacts.js';

const router = Router();

router.get('/places', ctrlWrapper(getAllContacts));
router.get('/places/:placeId', ctrlWrapper(getContactById));

export default router;
