var apiKey = '7e69c89705d14234b4fc6e5559121972';

// fetch a random recipe from the Spoonacular API
function fetchRandomRecipe() {
  var recipeURL = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`;

  fetch(recipeURL)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var recipe = data.recipes[0]; // Get the first recipe from the response

      // Create HTML elements to display the recipe information
      var recipeContainer = document.createElement('div');
      var recipeTitle = document.createElement('h3');
      recipeTitle.textContent = recipe.title;
      var recipeImage = document.createElement('img');
      recipeImage.src = recipe.image;
      var recipeInstructions = document.createElement('p');
      recipeInstructions.innerHTML = recipe.instructions;

      // Append the recipe elements to the content section
      var contentSection = document.querySelector('.holy-grail-middle');
      contentSection.innerHTML = ''; // Clear existing content
      contentSection.appendChild(recipeContainer);
      recipeContainer.appendChild(recipeTitle);
      recipeContainer.appendChild(recipeImage);
      recipeContainer.appendChild(recipeInstructions);
    })
    .catch(function(error) {
      console.log('Error fetching recipe:', error);
    });
}

// Function to generate food joke
function generateFoodJoke() {
  var jokeURL = `https://api.spoonacular.com/food/jokes/random?apiKey=${apiKey}`;
  var foodJokeElement = document.getElementById('food-joke');

  fetch(jokeURL)
    .then(response => response.json())
    .then(data => {
      var joke = data.text;
      foodJokeElement.textContent = joke;
    })
    .catch(function(error) {
      console.log('An error occurred while fetching the food joke:', error);
    });
}

// Build page
generateFoodJoke();

// Add click event listener to the "Random" button
var randomButton = document.getElementById('randomBtn');
randomButton.addEventListener('click', fetchRandomRecipe);