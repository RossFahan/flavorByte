//Global Variables

var apiKey = '7e69c89705d14234b4fc6e5559121972';
var contentSection = document.querySelector('.content');

// Give welcome modal on first time visiting page
if (!localStorage.getItem("modalDisplayed")) {
  // Get the modal element
  var modal = document.getElementById("modal");

  // Get the close button element
  var closeBtn = document.getElementsByClassName("close")[0];

  // Function to open the modal
  function openModal() {
      modal.style.display = "block";
  }

  // Function to close the modal
  function closeModal() {
      modal.style.display = "none";
      // Set a value in local storage to indicate that the modal has been displayed
      localStorage.setItem("modalDisplayed", true);
  }

  // Event listener to show the modal on page load
  window.addEventListener("load", openModal);

  // Event listener for the close button
  closeBtn.addEventListener("click", closeModal);
  window.addEventListener("click", function(event) {
      if (event.target == modal) {
          closeModal();
      }
  });
}

// Function to fetch a random recipe
var fetchRandomRecipe = function () {
  var recipeURL = 'https://api.spoonacular.com/recipes/random?apiKey=' + apiKey;

  fetch(recipeURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("Random:", data);
      var recipe = data.recipes[0]; // Get the first recipe from the response

      // Create HTML elements to display the recipe information
      var recipeContainer = document.createElement('div');
      var recipeTitle = document.createElement('h3');
      recipeTitle.textContent = recipe.title;
      var recipeImage = document.createElement('img');
      recipeImage.src = recipe.image;
      var recipeInstructions = document.createElement('p');
      recipeInstructions.innerHTML = recipe.instructions;
      var ingredientsHeader = document.createElement('h3');
      ingredientsHeader.textContent = "Ingredients:";

      var recipeIngredients = document.createElement('ul');
      var ingredients = recipe.extendedIngredients;
      for (var i = 0; i < ingredients.length; i++) {
        var ingredientItem = document.createElement('li');
        ingredientItem.textContent = ingredients[i].original;
        recipeIngredients.appendChild(ingredientItem);
      }

      // Append the recipe elements to the content section
      contentSection.innerHTML = ''; // Clear existing content
      contentSection.appendChild(recipeContainer);
      recipeContainer.appendChild(recipeTitle);
      recipeContainer.appendChild(recipeImage);
      recipeContainer.appendChild(recipeInstructions);
      recipeContainer.appendChild(ingredientsHeader);
      recipeContainer.appendChild(recipeIngredients);
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
      console.log("Trivia:", data);
    })
    .catch(function (error) {
      console.log('An error occurred while fetching the food trivia:', error);
    });
};

var createAccordion = function (recipe) {
  var accordion = document.createElement('div');
  accordion.classList.add('accordion');

  var checkboxInput = document.createElement('input');
  checkboxInput.type = 'checkbox';
  checkboxInput.id = 'accordion-' + recipe.id;
  checkboxInput.name = 'accordion-checkbox';
  checkboxInput.hidden = true;

  var accordionHeader = document.createElement('label');
  accordionHeader.classList.add('accordion-header');
  accordionHeader.htmlFor = 'accordion-' + recipe.id;

  var arrowIcon = document.createElement('i');
  arrowIcon.classList.add('icon', 'icon-arrow-right', 'mr-1');

  var recipeTitle = document.createElement('span');
  recipeTitle.textContent = recipe.title;

  accordionHeader.appendChild(arrowIcon);
  accordionHeader.appendChild(recipeTitle);

  var accordionBody = document.createElement('div');
  accordionBody.classList.add('accordion-body');

  // Create the content for the accordion body
  var recipeContent = document.createElement('div');

  // Recipe image
  var recipeImage = document.createElement('img');
  recipeImage.src = recipe.image;

  // Recipe summary
  var recipeSummary = document.createElement('p');
  recipeSummary.innerHTML = recipe.summary;

  // Link to view recipe
  var viewRecipeLink = document.createElement('a');
  viewRecipeLink.href = recipe.sourceUrl;
  viewRecipeLink.target = '_blank';
  viewRecipeLink.textContent = 'View Recipe Source Page';

  // Append elements to the recipe content
  recipeContent.appendChild(recipeImage);
  recipeContent.appendChild(document.createElement('br'));
  recipeContent.appendChild(recipeSummary);
  recipeContent.appendChild(document.createElement('br'));
  recipeContent.appendChild(viewRecipeLink);

  accordionBody.appendChild(recipeContent);

  // Append elements to the accordion
  accordion.appendChild(checkboxInput);
  accordion.appendChild(accordionHeader);
  accordion.appendChild(accordionBody);

  return accordion;
};


// Function to search for recipes based on user input and display results using accordions
var searchRecipes = function (query) {

  var recipeURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}&addRecipeInformation=true&=addRecipeNutrition`;

  fetch(recipeURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("Search Data:", data)
      var recipes = data.results;
      var numPerPage = 10;
      var numPages = Math.ceil(recipes.length / numPerPage);

      // Clear previous search results
      contentSection.innerHTML = ''; // Clear existing content

      // Loop through the recipes and create accordions for each page
      for (var i = 0; i < numPages; i++) {
        var pageStartIndex = i * numPerPage;
        var pageRecipes = recipes.slice(pageStartIndex, pageStartIndex + numPerPage);
        pageRecipes.forEach(function (recipe) {
          var accordion = createAccordion(recipe);
          contentSection.appendChild(accordion);
        });
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

// Adding JS for tooltip from popper.js library
$document.ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
});