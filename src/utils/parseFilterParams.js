export const parseFavourites = (query) => {
  const isFavourite = query.isFavourite === 'true';
  return isFavourite === undefined ? {} : { isFavourite };
};
