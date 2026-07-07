import { database, ID, Query } from "./appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_WATCHLIST_COLLECTION_ID!;

export const isInWatchlist = async (userId: string, animeId: number) => {
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal("userId", userId),
    Query.equal("animeId", animeId),
  ]);

  return result.documents.length > 0;
};

export const addToWatchlist = async (userId: string, anime: any) => {
  const exists = await isInWatchlist(userId, anime.id);

  if (exists) {
    return;
  }

  return await database.createDocument(
    DATABASE_ID,
    COLLECTION_ID,
    ID.unique(),
    {
      userId,
      animeId: anime.id,
      title: anime.title?.english || anime.title?.romaji,
      posterUrl: anime.coverImage?.large || anime.coverImage?.extraLarge,
      favorite: false,
      completed: false,
    },
  );
};

export const removeFromWatchlist = async (userId: string, animeId: number) => {
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal("userId", userId),
    Query.equal("animeId", animeId),
  ]);

  if (result.documents.length > 0) {
    await database.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID,
      result.documents[0].$id,
    );
  }
};

export const toggleWatchlist = async (userId: string, anime: any) => {
  const exists = await isInWatchlist(userId, anime.id);

  if (exists) {
    await removeFromWatchlist(userId, anime.id);
    return false; // now removed
  } else {
    await addToWatchlist(userId, anime);
    return true; // now added
  }
};

export const getWatchlist = async (userId: string) => {
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal("userId", userId),
    Query.orderDesc("$createdAt"),
  ]);

  return result.documents;
};

export const isFavorite = async (userId: string, animeId: number) => {
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal("userId", userId),
    Query.equal("animeId", animeId),
    Query.equal("favorite", true),
  ]);

  return result.documents.length > 0;
};

export const toggleFavorite = async (userId: string, animeId: number) => {
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal("userId", userId),
    Query.equal("animeId", animeId),
  ]);

  if (result.documents.length === 0) {
    return false;
  }

  const document = result.documents[0];

  await database.updateDocument(DATABASE_ID, COLLECTION_ID, document.$id, {
    favorite: !document.favorite,
  });

  return !document.favorite;
};

export const getFavorites = async (userId: string) => {
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal("userId", userId),
    Query.equal("favorite", true),
    Query.orderDesc("$createdAt"),
  ]);

  return result.documents;
};
