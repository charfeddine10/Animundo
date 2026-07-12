import { NewsArticle } from "./news";
import { findAnimeImage } from "./animeImageResolver";

export const enrichNewsWithImages = async (
  articles: NewsArticle[],
): Promise<NewsArticle[]> => {
  const enrichedNews = await Promise.all(
    articles.map(async (article) => {
      try {
        const image = await findAnimeImage(article.title);
        console.log("IMAGE RESULT:", article.title, image);
        return {
          ...article,
          image,
        };
      } catch (error) {
        console.log("IMAGE ERROR:", article.title);

        return {
          ...article,
          image: null,
        };
      }
    }),
  );

  return enrichedNews;
};
