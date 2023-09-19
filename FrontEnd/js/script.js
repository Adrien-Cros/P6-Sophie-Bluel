//Récupération de la class .gallery
const galleryDisplay = document.querySelector(".gallery");

//Récupération des infos stockées dans le localStorage si deja existant
let gallery = window.localStorage.getItem('gallery');
let categories = window.localStorage.getItem('categories');
if (gallery === null){
   // Récupération depuis l'API
   let response = await fetch('http://localhost:5678/api/works');
   gallery = await response.json();
   response = await fetch('http://localhost:5678/api/categories');
   categories = await response.json();
   // Transformation des éléments en JSON
   const galleryNumbers = JSON.stringify(gallery);
   const categoriesNumbers = JSON.stringify(categories);
   // Stockage des informations dans le localStorage
   window.localStorage.setItem("gallery", galleryNumbers);
   window.localStorage.setItem("categories", categoriesNumbers);
} else {
   gallery = JSON.parse(gallery);
   categories = JSON.parse(categories);
}

//créé les figures qui contiennent la galerie sur le site
function generateGallery(gallery){
    for (let i = 0; i < gallery.length; i++) {
        //récupération de l'index de la galerie correspondante
        const work = gallery[i];
        //création de la figure qui contient l'image et le texte
        const figure = document.createElement("figure");       
        //création de l'image et de son alt
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        //création du texte de l'image
        const figCaption = document.createElement("figcaption");
        figCaption.innerText = work.title;

        //ajout de l'image et du texte dans la figure
        figure.appendChild(imageElement);
        figure.appendChild(figCaption);    
        //ajout de la figure contenant toutes les infos dans la div class .gallery
        galleryDisplay.appendChild(figure)
     }
}

//affichage de la galerie dans la page html
generateGallery(gallery);

//regarder le categoryId de chaque éléments dans ma liste gallery, comparer leurs categoryId à ceux dans categories.id
const filterAll = document.getElementById("filter-all");
const filterObjects = document.getElementById("filter-objects");
const filterAppartments = document.getElementById("filter-appartments");
const filterHotels = document.getElementById("filter-hotels");

filterAll.addEventListener("click", () => {
   resetFilter(gallery, categories);
})

filterObjects.addEventListener("click", () => {
   filterByObjects(gallery, categories);
})

filterAppartments.addEventListener("click", () => {
   filterByAppartments(gallery, categories);
})

filterHotels.addEventListener("click", () => {
   filterByHotels(gallery, categories);
})

//A FAIRE FONCTION NO FILTER
function resetFilter (gallery) {
   document.querySelector(".gallery").innerHTML = "";
   generateGallery(gallery);
};

//A FAIRE FONCTION TRIER PAR OBJETS 
function filterByObjects (gallery, categories) {
   const filter = gallery.filter(function (gallery) {
      if (gallery.categoryId === 1) {
         return gallery;
      }
  });
  document.querySelector(".gallery").innerHTML = "";
  generateGallery(filter);
};

//A FAIRE FONCTION TRIER PAR APPARTEMENTS
function filterByAppartments (gallery, categories) {
   const filter = gallery.filter(function (gallery) {
      if (gallery.categoryId === 2) {
         return gallery;
      }
  });
  document.querySelector(".gallery").innerHTML = "";
  generateGallery(filter);
};

//A FAIRE FONCTION TRIER PAR HOTEL/RESTAU
function filterByHotels (gallery, categories) {
   const filter = gallery.filter(function (gallery) {
      if (gallery.categoryId === 3) {
         return gallery;
      }
  });
  document.querySelector(".gallery").innerHTML = "";
  generateGallery(filter);
};

//suite et test pour voir si les commit marchent