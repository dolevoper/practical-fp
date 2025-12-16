type Movie = {
    id: number,
    title: string,
    year: number,
    genre: string,
    plot: string,
    poster: string
};

const movies: Movie[] = [
  {
    id: 1,
    title: "Star Wars: The Last Jedi",
    year: 2017,
    genre: "Action, Adventure, Fantasy",
    plot: "Rey develops her newly discovered abilities with the guidance of Luke Skywalker, who is unsettled by the strength of her powers. Meanwhile, the Resistance prepares to do battle with the First Order.",
    poster: "https://images-na.ssl-images-amazon.com/images/M/MV5BMjQ1MzcxNjg4N15BMl5BanBnXkFtZTgwNzgwMjY4MzI@._V1_SX300.jpg"
  },
  {
    id: 2,
    title: "Black Swan",
    year: 2010,
    genre: "Drama, Thriller",
    plot: "A committed dancer wins the lead role in a production of Tchaikovskys \"Swan Lake\" only to find herself struggling to maintain her sanity.",
    poster: "https://images-na.ssl-images-amazon.com/images/M/MV5BNzY2NzI4OTE5MF5BMl5BanBnXkFtZTcwMjMyNDY4Mw@@._V1_SX300.jpg"
  },
  {
    id: 3,
    title: "Fight Club",
    year: 1999,
    genre: "Drama",
    plot: "An insomniac office worker, looking for a way to change his life, crosses paths with a devil-may-care soapmaker, forming an underground fight club that evolves into something much, much more.",
    poster: "https://images-na.ssl-images-amazon.com/images/M/MV5BMzFjMWNhYzQtYTIxNC00ZWQ1LThiOTItNWQyZmMxNDYyMjA5XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg"
  },
  {
    id: 4,
    title: "The Godfather: Part II",
    year: 1974,
    genre: "Crime, Drama",
    plot: "The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.",
    poster: "https://images-na.ssl-images-amazon.com/images/M/MV5BMjZiNzIxNTQtNDc5Zi00YWY1LThkMTctMDgzYjY4YjI1YmQyL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg"
  }
];

// Add to each movie the number of words in the plot summary (field name: plotWordCount)
export const moviesWithPlotWordCount = movies
  .map((movie) => ({ ...movie, plotWordCount: movie.plot.split(" ").length }));

// Show only movie titles after year 2000
export const titlesAfter2000 = movies
  // .flatMap(({ year, title }) => year > 2000 ? [title] : []);
  .filter(({ year }) => year > 2000)
  .map(({ title }) => title);

// Create a CSV containing movie year, title and poster
// Include only movies with more than 1 genre
// Order movies by title
export const moviesReport = [
  ["year", "title", "poster"],
  ...movies
    .filter(({ genre }) => genre.includes(","))
    .toSorted(({ title: titleA }, { title: titleB }) => titleA.localeCompare(titleB))
    .map(({ year, title, poster }) => [year, title, poster])
].map((row) => row.join(",")).join("\n");


// Group movies by genre
export const moviesBygenre = movies
  .map((movie) => movie.genre.split(", ").map((genre) => [genre, movie] as const))
  // [string, movie][][]
  .flat()
  // [string, movie][]
  .reduce(
    (res, [genre, movie]) => ({
      ...res,
      [genre]: [...(res[genre] ?? []), movie]
    }),
    {} as Record<string, Movie[]>
  );
