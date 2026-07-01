// export const TMDB_CONFIG = {
//   BASE_URL: "https://api.themoviedb.org/3",
//   API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
//   headers: {
//     accept: "application/json",
//     Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
//   },
// };

// export const fetchMovies = async ({ query }: { query: string }) => {
//   const endpoint = query
//     ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
//     : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

//   const response = await fetch(endpoint, {
//     method: "GET",
//     headers: TMDB_CONFIG.headers,
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch movies: ${response.statusText}`);
//   }

//   const data = await response.json();

//   return data.results;
// };

// export const fetchMovieDetails = async (
//   movieId: string,
// ): Promise<MovieDetails> => {
//   try {
//     const response = await fetch(
//       `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
//       {
//         method: "GET",
//         headers: TMDB_CONFIG.headers,
//       },
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to fetch movie details: ${response.statusText}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

// const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTAyYjdmODY1Y2Y5YzE2MGU0MDA2ZTA5MWQ3ZTJjMSIsIm5iZiI6MTU3MTU4MTE3NC4yODksInN1YiI6IjVkYWM2Y2Y2ZWQyOGI5MDAxN2RiNTM1YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.m7TiKqrVZ_Fajykm7zhoGRx3j8YxI9C6_pdl4gk4S3o'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));

export const ANILIST_API = "https://graphql.anilist.co";

export const fetchAnime = async ({ query }: { query: string }) => {
  const graphqlQuery = query
    ? `
      query ($search: String) {
        Page(page: 1, perPage: 20) {
          media(search: $search, type: ANIME) {
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
    `
    : `
      query {
        Page(page: 1, perPage: 50) {
          media(type: ANIME, sort: TRENDING_DESC) {
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
    `;

  const response = await fetch(ANILIST_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: graphqlQuery,
      variables: query ? { search: query } : {},
    }),
  });

  const json = await response.json();

  return json.data.Page.media;
};

export const fetchAnimeDetails = async (animeId: number) => {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
        }
        description
        episodes
        averageScore
        genres
        coverImage {
          extraLarge
        }
        bannerImage
      }
    }
  `;

  const response = await fetch(ANILIST_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { id: animeId },
    }),
  });

  const json = await response.json();

  return json.data.Media;
};
