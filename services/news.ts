import { XMLParser } from "fast-xml-parser";

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  publishedAt: string;
  image?: string;
}
const RSS_URL = "https://www.animenewsnetwork.com/all/rss.xml";

const cleanHTML = (text: string = "") => {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
};

const extractImage = (item: any) => {
  // media:content
  if (item["media:content"]) {
    const media = item["media:content"];

    if (Array.isArray(media)) {
      return media[0]["@_url"];
    }

    return media["@_url"];
  }

  // enclosure fallback
  if (item.enclosure) {
    return item.enclosure["@_url"];
  }

  return undefined;
};

export const fetchAnimeNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(RSS_URL);

    const xml = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });

    const result = parser.parse(xml);

    const items = result?.rss?.channel?.item || [];

    console.log("RSS CATEGORIES:", [
      ...new Set(items.map((item: any) => item.category).filter(Boolean)),
    ]);

    const blockedKeywords = ["game", "games", "live-action", "webtoon"];
    const animeCategories = ["Anime", "Animation", "Manga"];

    const filteredItems = items.filter((item: any) => {
      const title = (item.title || "").toLowerCase();

      const passesKeywordFilter = !blockedKeywords.some((keyword) =>
        title.includes(keyword),
      );

      const categories = Array.isArray(item.category)
        ? item.category
        : [item.category];

      const passesCategoryFilter = categories.some((cat: string) =>
        animeCategories.includes(cat),
      );

      return passesKeywordFilter && passesCategoryFilter;
    });
    console.log("FIRST NEWS ITEM:", JSON.stringify(items[0], null, 2));

    console.log("TOTAL RSS:", items.length);
    console.log("FILTERED RSS:", filteredItems.length);

    return filteredItems.slice(0, 20).map((item: any, index: number) => ({
      id:
        typeof item.guid === "object"
          ? item.guid["#text"]
          : item.guid || `${index}`,

      title: item.title || "",

      description: cleanHTML(item.description),

      link: item.link || "",

      publishedAt: item.pubDate || "",
      image: extractImage(item),
    }));
  } catch (error) {
    console.log("NEWS ERROR:", error);
    return [];
  }
};
