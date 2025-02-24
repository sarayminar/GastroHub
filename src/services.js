const urlBase = "http://localhost:3000/platos/";

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
