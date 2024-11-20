#!/usr/bin/node

const request = require('request');

// Retrieve the Movie ID from the command line arguments
const movieId = process.argv[2];
if (!movieId) {
  console.error('Usage: ./0-starwars_characters.js <Movie ID>');
  process.exit(1);
}

// Star Wars API URL
const baseUrl = `https://swapi-api.alx-tools.com/api/films/${movieId}/`;

// Fetch the movie details
request(baseUrl, (error, response, body) => {
  if (error) {
    console.error('Error fetching movie details:', error);
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

    // Iterate through each character URL and fetch the character's name
    characters.forEach((characterUrl) => {
      request(characterUrl, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const character = JSON.parse(body);
          console.log(character.name);
        }
      });
    });
  } catch (e) {
    console.error('Error parsing response:', e.message);
  }
});
