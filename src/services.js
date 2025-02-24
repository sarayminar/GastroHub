
const urlBase = "http://localhost:3000/platos/";

//Método GET
async function getAllRecipes(){
    try{
        const response = await fetch(urlBase);
        const data = await response.json();
        return data;
    }catch(error){
        console.log("Ha habido un error: " + error);
    }
}

function resetBody(){
    const bodyButtons = [{text: "Mostrar recetas", onclick: "showRecipes()"}, {text: "Crear receta", onclick: "loadCreateForm()"}];
    document.body.innerHTML = "";
    bodyButtons.forEach(button => {
        let buttonElement = document.createElement("button");
        buttonElement.textContent = button.text;
        buttonElement.setAttribute("onclick", button.onclick);
        document.body.appendChild(buttonElement);
    })
}


resetBody();
console.log(getAllRecipes());  