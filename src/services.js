const urlBase = "http://localhost:3000/platos/";
const container = document.getElementById("container");
//Método POST
function loadCreateForm() {
  resetBody();
  loadForm();
  document.getElementById("recipe-form").addEventListener("submit", (e) => {
    e.preventDefault();
    createRecipe();
  });
}

function loadForm() {
  if (document.getElementById("recipe-form")) {
    return;
  }

  const createForm = document.createElement("form");
  createForm.setAttribute("id", "recipe-form");
  createForm.innerHTML = `
    <label for="recipe-name">Nombre de la receta:</label>
    <input type="text" id="recipe-name" name="recipe-name"><br><br>
    <label for="recipe-origin">Origen:</label>
    <input type="text" id="recipe-origin" name="recipe-origin"><br><br>
    <label for="recipe-image">Propuesta:</label>
    <input type="text" id="recipe-image" name="recipe-image"><br><br>
    <label for="recipe-ingredients">Ingredientes:</label>
    <input type="text" id="recipe-ingredients" name="recipe-ingredients"> <span id="annotation">*(Separe con ',' cada ingrediente)</span><br><br>
    <label for="recipe-procedure">Procedimiento:</label>
    <textarea id="recipe-procedure" name="recipe-procedure"></textarea><br><br>
    <input class="button-submit" type="submit" value="Enviar">`;
  container.appendChild(createForm);
}

async function createRecipe() {
  const recipeName = document.getElementById("recipe-name").value.trim();
  const recipeOrigin = document.getElementById("recipe-origin").value.trim();
  const recipeImage = document.getElementById("recipe-image").value.trim();
  const recipeIngredients = document.getElementById("recipe-ingredients").value.split(",").map((ingredient) => ingredient.trim());
  const recipeProcedure = document.getElementById("recipe-procedure").value.trim();
  if (!validateFieldsForm(recipeName, recipeOrigin, recipeImage, recipeIngredients, recipeProcedure)) {
    alert("Rellene correctamente todos los campos");
    return;
  }

  const response = await postRecipe(recipeName, recipeOrigin, recipeImage, recipeIngredients, recipeProcedure);

  if (!response.ok) {
    alert("Error al guardar en base de datos");
  }

  resetBody();
  const p = document.createElement("p");
  p.setAttribute("id", "result");
  p.textContent = "Receta creada correctamente";
  container.appendChild(p);
}

function validateFieldsForm(recipeName, recipeOrigin, recipeImage, recipeIngredients, recipeProcedure) {
  if (recipeName.length == 0 || recipeOrigin.length == 0 || recipeImage.length == 0 || recipeIngredients.length == 0 || recipeProcedure.length == 0) {
    return false;
  }
  return true;
}

async function postRecipe(recipeName, recipeOrigin, recipeImage, recipeIngredients, recipeProcedure) {
  try {
    const response = await fetch(urlBase, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: recipeName,
        origin: recipeOrigin,
        image: recipeImage,
        ingredients: recipeIngredients,
        procedure: recipeProcedure,
      }),
    });

    return response;
  } catch (error) {
    console.log("Ha habido un error: " + error);
  }
}

//Método GET
async function getAllRecipes() {
  try {
    const response = await fetch(urlBase);
    return await response.json();
  } catch (error) {
    console.log("Ha habido un error: " + error);
  }
}

function resetBody() {
  const bodyButtons = [
    { text: "Mostrar recetas", onclick: "showRecipes()" },
    { text: "Crear receta", onclick: "loadCreateForm()" },
  ];
  container.innerHTML = "";
  bodyButtons.forEach((button) => {
    let buttonElement = document.createElement("button");
    buttonElement.textContent = button.text;
    buttonElement.setAttribute("onclick", button.onclick);
    buttonElement.setAttribute("class", "button");
    container.appendChild(buttonElement);
  });
}

async function loadTable(recipes, value = "") {
  resetBody();
  if (document.getElementById("recipe-table")) {
    return;
  }
  let recipesCountry;
  if (value == "") {
    recipesCountry = [...new Set(recipes.map(item => item.origin))];
  } else {
    recipesCountry = [value];
  }

  const table = document.createElement("table");
  table.setAttribute("id", "recipes-table");
  let tableContent = `<thead><th>Receta</th><th>Origen</th><th>Imagen</th><th>Países:</th>`
  tableContent += value ? `<th><select id='country-select'><option value=''>-</option>` : `<th><select id='country-select'><option selected value=''>-</option>`
  recipesCountry.forEach((country) => {
    tableContent += `<option `
    if (value == country) {
      tableContent += `selected `
    }

    tableContent += `value='${country}'>${country}</option>`
  });

  tableContent += "</select></th></thead>";
  table.innerHTML = tableContent;
  container.appendChild(table);
  document.getElementById("country-select").addEventListener("change", (e) => {
    filterByCountry();
  });
}

// Método PRINT
async function printRecipes(recipes, country = "") {
  loadTable(recipes, country);
  let table = document.getElementById("recipes-table");
  recipes.forEach((element) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `<td class="td-name" onclick="printInfo('${element.id}')">${element.name}</td><td>${element.origin}</td><td><img src="${element.image}"></td><td><button class="button-edit" onclick="getRecipeForm('${element.id}')">Editar</button></td><td><button class="button-delete" onclick="deleteRecipe('${element.id}')">Eliminar</button></td>`;
    table.appendChild(tr);
  });
}

async function showRecipes() {
  const recipes = await getAllRecipes();
  printRecipes(recipes);
}

// Método EDIT
function getRecipeForm(id) {
  loadForm();
  loadFieldsForm(id);
  document.getElementById("recipe-form").addEventListener("submit", (e) => {
    e.preventDefault();
    editRecipe(id);
  });
}

async function editRecipe(id) {
  const recipeName = document.getElementById("recipe-name").value.trim();
  const recipeOrigin = document.getElementById("recipe-origin").value.trim();
  const recipeImage = document.getElementById("recipe-image").value.trim();
  const recipeIngredients = document.getElementById("recipe-ingredients").value.split(",").map((ingredient) => ingredient.trim());
  const recipeProcedure = document.getElementById("recipe-procedure").value.trim();
  if (!validateFieldsForm(recipeName, recipeOrigin, recipeImage, recipeIngredients, recipeProcedure)) {
    alert("Rellene correctamente todos los campos");
    return;
  }
  const response = await putRecipe(id, recipeName, recipeOrigin, recipeImage, recipeIngredients, recipeProcedure);

  if (!response.ok) {
    alert("Error al guardar en base de datos");
  }

  resetBody();
  const p = document.createElement("p");
  p.setAttribute("id", "result");
  p.textContent = "Receta modificada correctamente";
  container.appendChild(p);
  console.log(container.innerHTML);

}


async function putRecipe(id, recipeName, recipeOrigin, recipeImage, recipeIngredients, recipeProcedure) {
  try {
    const response = await fetch(urlBase + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: recipeName,
        origin: recipeOrigin,
        image: recipeImage,
        ingredients: recipeIngredients,
        procedure: recipeProcedure,
      }),
    });

    return response;
  } catch (error) {
    console.log("Ha habido un error: " + error);
  }
}

async function getOneRecipe(id) {
  try {
    const response = await fetch(urlBase + id);
    return await response.json();
  } catch (error) {
    console.log("Ha habido un error: " + error);
  }
}

async function loadFieldsForm(id) {
  const response = await getOneRecipe(id);
  document.getElementById("recipe-name").value = response.name;
  document.getElementById("recipe-origin").value = response.origin;
  document.getElementById("recipe-image").value = response.image;
  document.getElementById("recipe-ingredients").value =
    response.ingredients.join();
  document.getElementById("recipe-procedure").value = response.procedure;
}

//Método DELETE
async function deleteRecipe(id) {
  const confirmation = confirm("¿Estás seguro de eliminar la receta?");
  if (!confirmation) {
    return;
  }

  const response = await deleteR(id);
  if (!response.ok) {
    alert("Error al eliminar la receta");
    return;
  }

  resetBody();
  const p = document.createElement("p");
  p.textContent = "Receta eliminada correctamente";
  container.appendChild(p);
}

async function deleteR(id) {
  try {
    const response = await fetch(urlBase + id, { method: "DELETE" });
    return response;
  } catch (error) {
    console.log("Ha habido un error: " + error);
  }
}

// PRINT CARD 
async function printInfo(id) {
  resetBody();
  const recipe = await getOneRecipe(id);
  printCard(recipe);
}

function printCard(recipe) {
  const card = document.createElement("div");
  card.classList.add("card");
  cardContent = `
    <h2>${recipe.name}</h2>
    <img src="${recipe.image}" alt="${recipe.name}">
    <p><strong>Origen:</strong> ${recipe.origin}</p>
    <p id="ingredients"><strong>Ingredientes:</strong></p>
    <ul>
    `
  recipe.ingredients.forEach((ingredient) => {
    ingredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1);
    cardContent += `<li>${ingredient}</li>`;
  });
  cardContent += `
    </ul>
    <h4>Procedimiento:</h4>
    <p>${recipe.procedure}</p>
    <div class="button-container">
    <button class="button" onclick="getRecipeForm('${recipe.id}')">Editar</button>
    <button class="button" onclick="deleteRecipe('${recipe.id}')">Eliminar</button></div>
    
  `;
  card.innerHTML = cardContent;
  container.appendChild(card);
}

//FILTER TABLE
async function filterByCountry() {
  const country = document.getElementById("country-select").value;
  const response = await filterBy("origin", country);
  resetBody();
  printRecipes(response, country);
}

async function filterBy(param, value) {
  try {
    const response = await fetch(urlBase + `?${param}=${value}`);
    return await response.json();
  } catch (error) {
    console.log("Ha habido un error: " + error);
  }
}

resetBody();
