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

  const contact = await createContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
    userId,
  });
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  console.log('-------');
  console.log(
    '----patchContactController проверка- contactId:',
    contactId,
    ' / userId:',
    userId,
    ' / userId.toString():',
    userId.toString(),
  );

  const result = await updateContact(contactId, userId.toString(), req.body);
  console.log('----patchContactController---');
  console.log('result -------');
  console.log(result);
  console.log('-------');
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
