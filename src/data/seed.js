const connectDB = require("../config/db");
const Movie = require("../models/movie");

const seedMovies = async () => {
    await connectDB();

    const movies = [
        {
            title: "Inception",
            genre: ["Sci-Fi", "Thriller"],
            year: 2010,
            rating: 8.8,
            description: "A mind-bending story about dreams within dreams."
        },
        {
            title: "The Shawshank Redemption",
            genre: ["Drama"],
            year: 1994,
            rating: 9.3,
            description: "The story of hope and resilience in a prison."
        },
        {
            title: "Toy Story",
            genre: ["Animation", "Comedy"],
            year: 1995,
            rating: 8.3,
            description: "A heartwarming tale of toys coming to life."
        }
    ];

    try {
        await Movie.deleteMany(); // Clear existing data
        await Movie.insertMany(movies);
        console.log("Movies seeded successfully.");
        process.exit();
    } catch (error) {
        console.error(`Error seeding movies: ${error.message}`);
        process.exit(1);
    }
};

seedMovies();
