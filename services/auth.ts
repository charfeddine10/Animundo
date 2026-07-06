import { account } from "./appwrite";

export const createAnonymousSession = async () => {
  try {
    // Check whether a session/user already exists
    await account.get();

    return;
  } catch {
    try {
      await account.createAnonymousSession();
    } catch (error) {
      console.error("Failed to create anonymous session:", error);
    }
  }
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};