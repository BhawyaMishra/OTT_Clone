// TMDB is used to fetch real poster/banner art at runtime.
// Get your own free key at https://www.themoviedb.org/settings/api
const TMDB_API_KEY = "07d0b27d5edbdbe9c9da03aacc39d05b";
const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/";

// "tmdb" holds the search title TMDB should look up; "fallback" is the
// local SVG used if the API call fails or the key runs out of quota.
const movies = [
  { id: 1, title: "Stranger Things", tmdb: "Stranger Things", tmdbType: "tv", fallback: "poster1.svg", category: "thriller" },
  { id: 2, title: "Bhool Bhulaiyaa", tmdb: "Bhool Bhulaiyaa", tmdbType: "movie", fallback: "poster2.svg", category: "horror" },
  { id: 3, title: "Breaking Bad", tmdb: "Breaking Bad", tmdbType: "tv", fallback: "poster3.svg", category: "thriller" },
  { id: 4, title: "Chennai Express", tmdb: "Chennai Express", tmdbType: "movie", fallback: "poster4.svg", category: "romcom" },
  { id: 5, title: "Money Heist", tmdb: "Money Heist", tmdbType: "tv", fallback: "poster5.svg", category: "thriller" },
  { id: 6, title: "Stree", tmdb: "Stree", tmdbType: "movie", fallback: "poster6.svg", category: "horror" },
  { id: 7, title: "Business Proposal", tmdb: "Business Proposal", tmdbType: "tv", fallback: "poster7.svg", category: "romcom" },
  { id: 8, title: "RRR", tmdb: "RRR", tmdbType: "movie", fallback: "poster8.svg", category: "indian" },
  { id: 9, title: "Pathaan", tmdb: "Pathaan", tmdbType: "movie", fallback: "poster9.svg", category: "indian" },
  { id: 10, title: "Jawan", tmdb: "Jawan", tmdbType: "movie", fallback: "poster10.svg", category: "indian" },
  { id: 11, title: "Gangs of Wasseypur", tmdb: "Gangs of Wasseypur", tmdbType: "movie", fallback: "poster11.svg", category: "indian" },
  { id: 12, title: "Drishyam", tmdb: "Drishyam", tmdbType: "movie", fallback: "poster12.svg", category: "thriller" },
  { id: 13, title: "Tumbbad", tmdb: "Tumbbad", tmdbType: "movie", fallback: "poster13.svg", category: "horror" },
  { id: 14, title: "Zindagi Na Milegi Dobara", tmdb: "Zindagi Na Milegi Dobara", tmdbType: "movie", fallback: "poster14.svg", category: "romcom" },
  { id: 15, title: "The Conjuring", tmdb: "The Conjuring", tmdbType: "movie", fallback: "assets/images/poster15.svg", category: "horror" },
  { id: 16, title: "Dark", tmdb: "Dark", tmdbType: "tv", fallback: "assets/images/poster16.svg", category: "thriller" }
];

const continueWatching = [
  { id: 101, title: "Stranger Things", tmdb: "Stranger Things", tmdbType: "tv", fallback: "assets/images/poster1.svg", progress: 65 },
  { id: 102, title: "Money Heist", tmdb: "Money Heist", tmdbType: "tv", fallback: "assets/images/poster5.svg", progress: 30 },
  { id: 103, title: "Dark", tmdb: "Dark", tmdbType: "tv", fallback: "assets/images/poster16.svg", progress: 85 },
  { id: 104, title: "Breaking Bad", tmdb: "Breaking Bad", tmdbType: "tv", fallback: "assets/images/poster3.svg", progress: 45 }
];

const featured = [
  { title: "Stranger Things", tmdb: "Stranger Things", tmdbType: "tv", fallback: "assets/images/banner.svg", description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, supernatural forces, and one strange little girl." },
  { title: "Money Heist", tmdb: "Money Heist", tmdbType: "tv", fallback: "assets/images/banner.svg", description: "A criminal mastermind leads a group of robbers to take over the Royal Mint of Spain in an unprecedented heist." },
  { title: "RRR", tmdb: "RRR", tmdbType: "movie", fallback: "assets/images/banner.svg", description: "A fearless revolutionary and a fierce protector unite against the British Raj in this larger-than-life action saga." },
  { title: "Dark", tmdb: "Dark", tmdbType: "tv", fallback: "assets/images/banner.svg", description: "A missing child sets four families on a frantic hunt for answers as they uncover a small town's sinister secrets." },
  { title: "Tumbbad", tmdb: "Tumbbad", tmdbType: "movie", fallback: "assets/images/banner.svg", description: "A mythological horror story about a goddess, her cursed son, and a family's endless greed for gold." }
];
