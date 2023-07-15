var apiKey = '7e69c89705d14234b4fc6e5559121972';




//welcome modal

// Function to check if the user has visited the site before
function hasVisitedBefore() {
  return localStorage.getItem('visited') === 'true';
}

// Function to show the welcome modal
function showWelcomeModal() {
  $('#welcomeModal').modal('show');
}

// Function to close the welcome modal and set "visited" in local storage
function closeModal() {
  $('#welcomeModal').modal('hide');

  // Set the "visited" variable to true in local storage
  localStorage.setItem('visited', 'true');
}

// Check if the user has visited the site before
if (!hasVisitedBefore()) {
  // If not visited before, show the welcome modal
  showWelcomeModal();
}

// Attach closeModal() to the modal's close event to set "visited" in local storage
$('#welcomeModal').on('hidden.bs.modal', function () {
  closeModal();
});

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

// Function to generate food trivia
function generateFoodtrivia() {
  var triviaURL = `https://api.spoonacular.com/food/trivia/random?apiKey=${apiKey}`;
  var foodtriviaElement = document.getElementById('food-trivia');

  fetch(triviaURL)
    .then(response => response.json())
    .then(data => {
      var trivia = data.text;
      foodtriviaElement.textContent = trivia;
    })
    .catch(function(error) {
      console.log('An error occurred while fetching the food trivia:', error);
    });
}



// Build page
generateFoodtrivia();

// Add click event listener to the "Random" button
var randomButton = document.getElementById('randomBtn');
randomButton.addEventListener('click', fetchRandomRecipe);