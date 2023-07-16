var apiKey = '7e69c89705d14234b4fc6e5559121972';

// Function to check if the user has visited the site before
var hasVisitedBefore = function () {
  return localStorage.getItem('visited') === 'true';
};

// Function to show the welcome modal
var showWelcomeModal = function () {
  var welcomeModal = document.getElementById('welcomeModal');
  welcomeModal.style.display = 'block';
};

// Function to close the welcome modal and set "visited" in local storage
var closeModal = function () {
  var welcomeModal = document.getElementById('welcomeModal');
  welcomeModal.style.display = 'none';
  localStorage.setItem('visited', 'true');
};

// Check if the user has visited the site before
if (!hasVisitedBefore()) {
  // If not visited before, show the welcome modal
  showWelcomeModal();
}

// Attach closeModal() to the modal's close button event to set "visited" in local storage
var closeButton = document.querySelector('#welcomeModal .close');
closeButton.addEventListener('click', closeModal);

// Function to fetch a random recipe from the Spoonacular API
var fetchRandomRecipe = function () {
  var recipeURL = 'https://api.spoonacular.com/recipes/random?apiKey=' + apiKey;

  fetch(recipeURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
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
    .catch(function (error) {
      console.log('Error fetching recipe:', error);
    });
};

// Function to generate food trivia
var generateFoodTrivia = function () {
  var triviaURL = 'https://api.spoonacular.com/food/trivia/random?apiKey=' + apiKey;
  var foodtriviaElement = document.getElementById('food-trivia');

  fetch(triviaURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var trivia = data.text;
      foodtriviaElement.textContent = trivia;
    })
    .catch(function (error) {
      console.log('An error occurred while fetching the food trivia:', error);
    });
};

// Function to create an accordion element with recipe details
var createAccordion = function (recipes) {
  var accordion = document.createElement('div');
  accordion.classList.add('accordion', 'mb-3');

  // Loop through the recipes and create accordion items for each recipe
  recipes.forEach(function (recipe) {
    var accordionItem = document.createElement('div');
    accordionItem.classList.add('card');

    var accordionHeader = document.createElement('div');
    accordionHeader.classList.add('card-header');

    var recipeTitle = document.createElement('h5');
    recipeTitle.classList.add('mb-0');
    recipeTitle.innerHTML = '<button class="btn btn-link" data-toggle="collapse" data-target="#recipe-' + recipe.id + '">\n                               ' + recipe.title + '\n                             </button>';

    accordionHeader.appendChild(recipeTitle);
    accordionItem.appendChild(accordionHeader);

    var accordionCollapse = document.createElement('div');
    accordionCollapse.id = 'recipe-' + recipe.id;
    accordionCollapse.classList.add('collapse');

    var accordionBody = document.createElement('div');
    accordionBody.classList.add('card-body');
    var recipeImage = document.createElement('img');
    recipeImage.src = recipe.image;

    var viewRecipeLink = document.createElement('a');
    viewRecipeLink.href = recipe.sourceUrl;
    viewRecipeLink.target = '_blank';
    viewRecipeLink.textContent = 'View Recipe';

    accordionBody.appendChild(recipeImage);
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(viewRecipeLink);
    accordionCollapse.appendChild(accordionBody);
    accordionItem.appendChild(accordionCollapse);
    accordion.appendChild(accordionItem);
  });

  return accordion;
};

// Function to search for recipes based on user input and display results using accordions
var searchRecipes = function (query) {
  var recipeURL = 'https://api.spoonacular.com/recipes/complexSearch?apiKey=' + apiKey + '&query=' + encodeURIComponent(query);

  fetch(recipeURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var recipes = data.results;
      var numPerPage = 10;
      var numPages = Math.ceil(recipes.length / numPerPage);

      // Clear previous search results
      var contentSection = document.querySelector('.holy-grail-middle');
      contentSection.innerHTML = ''; // Clear existing content

      // Loop through the recipes and create accordions for each page
      for (var i = 0; i < numPages; i++) {
        var accordion = createAccordion(recipes.slice(i * numPerPage, (i + 1) * numPerPage));
        contentSection.appendChild(accordion);
      }
    })
    .catch(function (error) {
      console.log('Error searching for recipes:', error);
    });
};

// Function to show the recipe search form when the "Recipe Search" button is clicked
var showRecipeSearchForm = function () {
  var recipeSearchForm = document.getElementById('recipeSearchForm');
  recipeSearchForm.style.display = 'block';
};

// Function to handle search button click
var handleSearch = function () {
  var searchInput = document.getElementById('searchInput').value;
  if (searchInput.trim() !== '') {
    searchRecipes(searchInput);
  }
};

// Build page
generateFoodTrivia();

// Add click event listener to the "Random" button
var randomButton = document.getElementById('randomBtn');
randomButton.addEventListener('click', fetchRandomRecipe);

// Add click event listener to the "Recipe Search" button
var recipeSearchButton = document.getElementById('recipeSearchBtn');
recipeSearchButton.addEventListener('click', showRecipeSearchForm);

// Add click event listener to the "Search" button inside the recipe search form
var searchButton = document.getElementById('searchBtn');
searchButton.addEventListener('click', handleSearch);
