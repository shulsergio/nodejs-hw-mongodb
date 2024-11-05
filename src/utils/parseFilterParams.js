export const parseFavourites = (query) => {
  const { contactType, isFavourite } = query;
  const parsedIsFavourite =
    isFavourite === 'true' ? true : isFavourite === 'false' ? false : undefined;
  const parsedContactType = contactType ? contactType : undefined;
  return {
    isFavourite: parsedIsFavourite,
    contactType: parsedContactType,
  };
};
