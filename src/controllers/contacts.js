import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFavourites } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filters = parseFavourites(req.query);
  const { _id: userId } = req.user;
  console.log('userId in getAllContactsController = ', userId);
  console.log('filter= ', filters);
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter: { ...filters },
    userId,
  });
  console.log('contacts= ', contacts);
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const contact = await getContactById({ contactId, userId });
  if (!contact) {
    next(createHttpError(404, 'Contact not Found'));
    return;
  }
  res.status(200).json({
    status: 200,
    message: 'ok',
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  const { _id: userId } = req.user;
  console.log(email);
  console.log(isFavourite);
  if (!name || !phoneNumber || !contactType) {
    return next(
      createHttpError(400, 'Need input Name, phoneNumber, and contactType.'),
    );
  }

  const photo = req.file;

  let photoUrl;

  console.log('=======');
  console.log('photoUrl 1111');
  console.log(photoUrl);
  console.log('=======');

  // console.log('ENABLE_CLOUDINARY ЭТО сейчас:', newEC);
  const dataIf = env('ENABLE_CLOUDINARY').toLowerCase() === 'true';
  console.log('dataIf ЭТО сейчас:', dataIf);
  if (photo) {
    if (dataIf) {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  console.log('=======');
  console.log('photoUrl 2222 ');
  console.log(photoUrl);
  console.log('=======');

  const contact = await createContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
    userId,
    photo: photoUrl,
  });
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const photo = req.file;
  console.log('photo in patchContactController = ', photo);
  let photoUrl;
  const { _id: userId } = req.user;
  const dataIf = env('ENABLE_CLOUDINARY').toLowerCase() === 'true';
  if (photo) {
    if (dataIf) {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  const result = await updateContact(contactId, userId.toString(), {
    ...req.body,
    photo: photoUrl,
  });
  console.log('----patchContactController---');
  console.log('result -------');
  console.log(result);
  console.log('-------');
  console.log('result.contact -------');
  console.log(result.contact);
  console.log('sverka-------');
  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const contact = await deleteContact(contactId, userId);
  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.status(204).send();
};
