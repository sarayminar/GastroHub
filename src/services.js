const urlBase = "http://localhost:3000/platos/";

//Método POST
function loadCreateForm() {
  resetBody();
  const createForm = document.createElement("form");
  createForm.setAttribute("id", "recipe-form");
  createForm.innerHTML = `
    <label for="recipe-name">Nombre de la receta:</label>
    <input type="text" id="recipe-name" name="recipe-name"><br><br>
    <label for="recipe-origin">Origen:</label>
    <input type="text" id="recipe-origin" name="recipe-origin"><br><br>
    <label for="recipe-image">Imagen:</label>
    <input type="text" id="recipe-image" name="recipe-image"><br><br>
    <label for="recipe-ingredients">Ingredientes:</label>
    <input type="text" id="recipe-ingredients" name="recipe-ingredients"> *(Separe con ',' cada ingrediente)<br><br>
    <label for="recipe-procedure">Procedimiento:</label>
    <textarea id="recipe-procedure" name="recipe-procedure"></textarea><br><br>
    <input type="submit" value="Crear">
  `;
  document.body.appendChild(createForm);
  createForm.addEventListener("submit", (e) => {
    e.preventDefault();
    createRecipe();
  });
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
  p.textContent = "Receta creada correctamente";
  document.body.appendChild(p);
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
        procedure: recipeProcedure
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
  document.body.innerHTML = "";
  bodyButtons.forEach((button) => {
    let buttonElement = document.createElement("button");
    buttonElement.textContent = button.text;
    buttonElement.setAttribute("onclick", button.onclick);
    document.body.appendChild(buttonElement);
  });
}

function loadTable() {
  resetBody();
  if (document.getElementById("recipe-table")) {
    return;
  }
  const table = document.createElement("table");
  table.setAttribute("id", "recipes-table");
  table.innerHTML =
    "<tr><th>Receta</th><th>Origen</th><th>Imagen</th><th> </th><th> </th></tr>";
  document.body.appendChild(table);
}

// Método PRINT
async function printRecipes(recipes) {
  loadTable();
  let table = document.getElementById("recipes-table");
  recipes.forEach((element) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `<td>${element.name}</td><td>${element.origin}</td><td>imagen</td><td><button onclick='getRecipeForm("${element.id}")'>Editar</button></td><td><button onclick='deleteRecipe("${element.id}")'>Eliminar</button></td>`;
    table.appendChild(tr);
  });
}

async function showRecipes() {
  const recipes = await getAllRecipes();
  printRecipes(recipes);
}

resetBody();
