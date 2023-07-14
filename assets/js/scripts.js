var apiKey = '7e69c89705d14234b4fc6e5559121972'; // Replace with your actual Spoonacular API key
var url = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`;

// fetch a random recipe from the Spoonacular API
function fetchRandomRecipe() {

    fetch(url)
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
        recipeInstructions.textContent = recipe.instructions;
  
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
  
  // Add click event listener to the "Random" button
  var randomButton = document.getElementById('randomBtn');
  randomButton.addEventListener('click', fetchRandomRecipe);