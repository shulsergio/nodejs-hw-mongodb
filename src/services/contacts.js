import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../utils/parseSortParams.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  console.log('Current User ID: ', userId);
  console.log('getAllContacts Data filter= ', filter);
  console.log('getAllContacts Data page/perPage= ', page, perPage);
  const limit = perPage;
  const skip = (page - 1) * perPage;
  console.log('getAllContacts Data limit/skip= ', limit, skip);
  const contactsQuery = ContactsCollection.find({ userId });
  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
  if (filter.contactType !== undefined) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  const contactsCount = await ContactsCollection.countDocuments({ userId });
  // const contactsCount = await ContactsCollection.find({ userId })
  //   .merge(contactsQuery)
  //   .countDocuments();
  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const PaginationData = calculatePaginationData(contactsCount, limit, page);
  console.log('getAllContacts PaginationData= ', PaginationData);
  return { data: contacts, ...PaginationData };
};

export const getContactById = async ({ contactId, userId }) => {
  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId: userId,
  });
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!rawResult || !rawResult.value) return null;

  return rawResult.value;
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({ _id: contactId });
  return contact;
};
