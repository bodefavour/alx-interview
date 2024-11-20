#!/usr/bin/node

const request = require('request');

// Retrieve the Movie ID from the command line arguments
const movieId = process.argv[2];
if (!movieId) {
  console.error("Usage: ./0-starwars_characters.js <Movie ID>");
  process.exit(1);
}

// Star Wars API URL
const baseUrl = `https://swapi-api.alx-tools.com/api/films/${movieId}/`;

// Fetch the movie details
request(baseUrl, (error, response, body) => {
  if (error) {
    console.error("Error fetching movie details:", error);
    return;
  }

  if (response.statusCode !== 200) {
    console.error(`Failed to retrieve data (status code: ${response.statusCode})`);
    return;
  }

  try {
    // Parse the response body
    const data = JSON.parse(body);

    // Get the list of character URLs
    const characters = data.characters;

    // Fetch all character names using Promise.all
    const characterPromises = characters.map((characterUrl) => {
      return new Promise((resolve, reject) => {
        request(characterUrl, (error, response, body) => {
          if (!error && response.statusCode === 200) {
            const character = JSON.parse(body);
            resolve(character.name);
          } else {
            reject(error || `Failed to fetch character at ${characterUrl}`);
          }
        });
      });
    });

    // Wait for all promises to resolve and print names in order
    Promise.all(characterPromises)
      .then((names) => {
        names.forEach((name) => console.log(name));
      })
      .catch((error) => {
        console.error("Error fetching characters:", error);
      });
  } catch (e) {
    console.error("Error parsing response:", e.message);
  }
});
