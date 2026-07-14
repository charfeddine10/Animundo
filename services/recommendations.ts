const ANILIST_URL = "https://graphql.anilist.co";

export const fetchRecommendations = async (animeId: number) => {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        recommendations(sort: RATING_DESC) {
          nodes {
            mediaRecommendation {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              averageScore
              episodes
            }
          }
        }
      }
    }
  `;

  const response = await fetch(ANILIST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        id: animeId,
      },
    }),
  });

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data.Media.recommendations.nodes
    .map((item: any) => item.mediaRecommendation)
    .filter((anime: any) => anime !== null);
};
