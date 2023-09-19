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

//affichage de la galerie dans la page html
generateGallery(gallery);
//affichage des boutons suivant les catégories dans la page html
createFilterButtons(categories);

//créé les figures qui contiennent la galerie sur le site
function generateGallery(gallery) {
   galleryDisplay.innerHTML = "";
   //pour chaque éléments présent dans la gallery, créé une figure lui correspondant
   gallery.forEach(work => {
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
      galleryDisplay.appendChild(figure);
   });
};

function createFilterButtons (categories) {
   //selectionne le parent avec la classe filter
   const filterContainer = document.querySelector(".filter")
   //création du bouton "Tous" avec le data-attribute défini sur 0
   const button = document.createElement('button');
   button.classList.add("filter-btn");
   button.textContent = "Tous";
   button.setAttribute('data-category', 0);
   filterContainer.appendChild(button);
   //pour chaque éléments présent dans la categories, créé un bouton lui correspondant
   categories.forEach(category => {
      const button = document.createElement('button');
      button.classList.add("filter-btn");
      button.textContent = category.name;
      button.setAttribute('data-category', category.id);
      filterContainer.appendChild(button);
    }); 
};

//boutons de filtre
const filterButtons = document.querySelectorAll('[data-category]');

// sélectionne tous les boutons avec l'attribut 'data-category'
filterButtons.forEach(button => {
   // ajoute un event listener sur chaque bouton
   button.addEventListener('click', () => {
      // récupère la valeur de l'attribut 'data-category' et la convertit en nombre
      const category = parseInt(button.getAttribute('data-category'));

     // détermine si la catégorie sélectionnée est "Tous" (0) ou une autre catégorie
     // si c'est "Tous" (0) affiche tout, sinon filtre par catégorie
     const filter = category === 0 ? gallery : gallery.filter(work => work.categoryId === category);
     
     // affiche seulement les objets filtrés ou tout les objets si data-category était de 0
     generateGallery(filter);
   });
});

//bouton de login
const boutonLogin = document.getElementById("login-btn");
boutonLogin.addEventListener("click", () => {
   location.href ="./login.html";
});