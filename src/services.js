
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

console.log(getAllRecipes());  