//Global Variables

var apiKey = '7e69c89705d14234b4fc6e5559121972';
var contentSection = document.querySelector('.content');
var recipeSearchForm = document.getElementById('recipeSearchForm');
var ingredientsListContainer = document.querySelector('.ingredients-list ul');
var beerSearchButton = document.getElementById('beerSearchBtn');

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
  window.addEventListener("click", function (event) {
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

      var recipeIngredients = document.createElement('ul');
      var ingredients = recipe.extendedIngredients;
      for (var i = 0; i < ingredients.length; i++) {
        var ingredientItem = document.createElement('li');
        ingredientItem.textContent = ingredients[i].original;
        recipeIngredients.appendChild(ingredientItem);
      }

      // Clear previous search results
      var ingredientsListContainer = document.querySelector('.ingredients-list ul');
      ingredientsListContainer.innerHTML = ''; // Clear existing content
      ingredientsListContainer.appendChild(recipeIngredients);

      // Append the recipe elements to the content section
      contentSection.innerHTML = ''; // Clear existing content
      contentSection.appendChild(recipeContainer);
      recipeContainer.appendChild(recipeTitle);
      recipeContainer.appendChild(recipeImage);
      recipeContainer.appendChild(recipeInstructions);

      // Instead of appending the ingredients to recipeContainer, we'll append them directly to the "ingredients-list" container
      var ingredientsListContainer = document.querySelector('.ingredients-list ul');
      ingredientsListContainer.innerHTML = ''; // Clear existing content
      ingredientsListContainer.appendChild(recipeIngredients);
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


//Accordion Function
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

  // Recipe instructions
  var recipeInstructions = document.createElement('ul');
  recipeInstructions.textContent = 'Cooking Instructions:';
  var instructionsArray = recipe.analyzedInstructions.map(instruction => instruction.steps.map(step => step.step));
  instructionsArray.forEach(instructionSteps => {
    instructionSteps.forEach(step => {
      var listItem = document.createElement('li');
      listItem.textContent = step;
      recipeInstructions.appendChild(listItem);
    });
  });

  // Append elements to the recipe content
  recipeContent.appendChild(recipeImage);
  recipeContent.appendChild(document.createElement('br'));
  recipeContent.appendChild(recipeSummary);
  recipeContent.appendChild(document.createElement('br'));
  recipeContent.appendChild(recipeInstructions);

  // Append elements to the accordion body
  accordionBody.appendChild(recipeContent);

  // Append elements to the accordion
  accordion.appendChild(checkboxInput);
  accordion.appendChild(accordionHeader);
  accordion.appendChild(accordionBody);

  return accordion;
};


// Function to search for recipes based on user input and display results using accordions
var searchRecipes = function (query) {

  var recipeURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}&addRecipeInformation=true&addRecipeNutrition=true&includeIngredients=true`;

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

// Function to fetch recipe Ingredients
var getRecipeIngredientsById = function (recipeId) {
  var recipeURL = `https://api.spoonacular.com/recipes/${recipeId}/ingredientWidget.json?apiKey=${apiKey}`;

  return fetch(recipeURL)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(function (data) {
      console.log("Ingredients:", data);
      return data.ingredients;
    })
    .catch(function (error) {
      console.log('Error fetching recipe ingredients:', error);
      return [];
    });
};


// Function to show the recipe search form when the "Recipe Search" button is clicked
var showRecipeSearchForm = function () {
  var searchFormContainer = document.createElement('div');
  searchFormContainer.classList.add('search-form-container');

  var searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'searchInput';
  searchInput.placeholder = 'Search for recipes...';

  var searchButton = document.createElement('button');
  searchButton.id = 'searchBtn';
  searchButton.textContent = 'Search';

  searchFormContainer.appendChild(searchInput);
  searchFormContainer.appendChild(searchButton);

  // Clear previous content and append the search form container and ingredients list
  ingredientsListContainer.innerHTML = '';
  contentSection.innerHTML = '';
  contentSection.appendChild(searchFormContainer);

  // Add click event listener to the "Search" button inside the recipe search form
  searchButton.addEventListener('click', handleSearch);

  // Add keyup event listener on the search input to trigger search on Enter key press
  searchInput.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
      handleSearch();
    }
  });
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

// Function to fetch random beer data
function fetchRandomBeer() {
  var url = 'https://api.punkapi.com/v2/beers/random';

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Random Beer Data:', data);
      return data;
    })
    .catch(error => {
      console.error('Error fetching random beer:', error);
      return null;
    });
}

// Function to display the fetched beer data in the content section
function displayBeerData(beerData) {
  if (beerData) {
    // Get the content section element
    var contentSection = document.querySelector('.content');

    // Get random beer from the array
    if (beerData.length > 1) {
      var randomIndex = Math.floor(Math.random() * beerData.length);
      beer = beerData[randomIndex];
    } else if (beerData.length === 1) {
      beer = beerData[0];
    } else {
      throw new Error("No beer data available.");
    }

    // Create elements to display beer data
    var beerNameElement = document.createElement('h2');     // Beer name
    beerNameElement.textContent = beer.name;


    var beerTaglineElement = document.createElement('p');   // Beer tagline
    beerTaglineElement.textContent = beer.tagline;


    var beerDescriptionElement = document.createElement('p');   // Beer description
    beerDescriptionElement.textContent = beer.description;

    // Beer image
    var beerImageElement = document.createElement('img');
    beerImageElement.src = beer.image_url;
    beerImageElement.alt = beer.name;
    beerImageElement.style.maxWidth = '100%'; // Limit image width to fit the container
    beerImageElement.style.maxHeight = '300px'; // Set the maximum height to 300 pixels
    beerImageElement.style.height = 'auto'; // Automatically adjust height to maintain aspect ratio

    // Beer food pairing
    var beerFoodPairingElement = document.createElement('ul');
    beerFoodPairingElement.innerHTML = '<h3>Food Pairing:</h3>';
    beer.food_pairing.forEach(function (food) {
      var liElement = document.createElement('li');
      liElement.textContent = food;
      beerFoodPairingElement.appendChild(liElement);
    });

    // Clear previous content and append new elements
    contentSection.appendChild(beerNameElement);
    contentSection.appendChild(beerTaglineElement);
    contentSection.appendChild(beerDescriptionElement);
    contentSection.appendChild(beerImageElement);
    contentSection.appendChild(beerFoodPairingElement);
  } else {
    // If beerData is invalid or empty, log an error message
    console.error('Invalid beer data.');
  }
}

// Add click event listener to the fetch beer button
var randomBeerBtn = document.getElementById('randomBeerBtn');
randomBeerBtn.addEventListener('click', () => {
  fetchRandomBeer()
    .then(data => {
      displayBeerData(data);
    });
});

var fetchBeersByFood = function (food) {
  var apiUrl = 'https://api.punkapi.com/v2/beers?food=' + encodeURIComponent(food);

  return fetch(apiUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(function (data) {
      console.log("Beers matching the food:", data);
      return data; // Return the data as the resolved value of the promise
    })
    .catch(function (error) {
      console.log('Error fetching beers:', error);
      throw error; // Re-throw the error to be caught in the calling function if needed
    });
};


// Function to show the beer search form when the "Search Beer" button is clicked
var showBeerSearchForm = function () {
  var beerSearchFormContainer = document.createElement('div');
  beerSearchFormContainer.classList.add('search-form-container');

  var beerSearchInput = document.createElement('input');
  beerSearchInput.type = 'text';
  beerSearchInput.id = 'beerSearchInput';
  beerSearchInput.placeholder = 'Enter a food pairing...';

  var beerSearchButton = document.createElement('button');
  beerSearchButton.id = 'beerSearchBtn';
  beerSearchButton.textContent = 'Search';

  beerSearchFormContainer.appendChild(beerSearchInput);
  beerSearchFormContainer.appendChild(beerSearchButton);

  // Clear previous content and append the beer search form container
  contentSection.innerHTML = '';
  contentSection.appendChild(beerSearchFormContainer);

  // Add click event listener to the "Search" button inside the beer search form
  beerSearchButton.addEventListener('click', handleBeerSearch);

  // Add keyup event listener on the search input to trigger search on Enter key press
  beerSearchInput.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
      handleBeerSearch();
    }
  });
};

// Function to handle beer search button click
var handleBeerSearch = function () {
  var beerSearchInput = document.getElementById('beerSearchInput').value;
  if (beerSearchInput.trim() !== '') {
    fetchBeersByFood(beerSearchInput)
      .then(data => {
        displayBeerData(data);
      });
  }
};

beerSearchButton.addEventListener('click', function () {
  // Clear the ingredients section
  ingredientsListContainer.innerHTML = '';

  // Show the beer search form
  showBeerSearchForm();
});