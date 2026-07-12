// const ANILIST_API = "https://graphql.anilist.co";

// export const findAnimeImage = async (title: string) => {
//   try {
//     const query = `
//       query ($search: String) {
//         Page(page: 1, perPage: 1) {
//           media(search: $search, type: ANIME) {
//             id
//             coverImage {
//               large
//             }
//           }
//         }
//       }
//     `;

//     const response = await fetch(ANILIST_API, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify({
//         query,
//         variables: {
//           search: title,
//         },
//       }),
//     });

//     const json = await response.json();

//     const anime = json?.data?.Page?.media?.[0];

//     return anime?.coverImage?.large ?? null;
//   } catch (error) {
//     console.log("IMAGE RESOLVER ERROR:", error);
//     return null;
//   }
// };

import { fetchAnime } from "./api";

export const findAnimeImage = async (newsTitle: string) => {
  try {
    const wordsToRemove = [
      "anime",
      "manga",
      "review",
      "season",
      "film",
      "movie",
      "news",
      "series",
      "episode",
      "episodes",
    ];

    let searchTitle = newsTitle;

    wordsToRemove.forEach((word) => {
      searchTitle = searchTitle.replace(new RegExp(word, "gi"), "");
    });

    // take only first part before common separators
    searchTitle = searchTitle.split(":")[0].split(" - ")[0].trim();

    console.log("ANI SEARCH:", searchTitle);

    const results = await fetchAnime({
      query: searchTitle,
    });

    if (!results || results.length === 0) {
      return null;
    }

    return (
      results[0]?.coverImage?.extraLarge ??
      results[0]?.coverImage?.large ??
      null
    );
  } catch (error) {
    console.log("RESOLVER ERROR:", error);
    return null;
  }
};
