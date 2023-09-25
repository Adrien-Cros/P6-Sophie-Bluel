const galleryDisplay = document.querySelector(".gallery");
const buttonAll = 0;
let gallery = window.localStorage.getItem('gallery');
let categories = window.localStorage.getItem('categories');

init();
displayAdminUI();

async function init() {
   if (gallery === null){
      let response = await fetch('http://localhost:5678/api/works');
      gallery = await response.json();
      response = await fetch('http://localhost:5678/api/categories');
      categories = await response.json();
      const galleryNumbers = JSON.stringify(gallery);
      const categoriesNumbers = JSON.stringify(categories);
      window.localStorage.setItem("gallery", galleryNumbers);
      window.localStorage.setItem("categories", categoriesNumbers);
   } else {
      gallery = JSON.parse(gallery);
      categories = JSON.parse(categories);
   }

   generateGallery(gallery);
   createFilterButtons(categories);
};

function displayAdminUI() {
   const userInfo = JSON.parse(window.sessionStorage.getItem('login'));
   const loginText = document.getElementById("login-btn");
   if (userInfo !== null) {
      if (userInfo.userId === 1) {
         console.log(userInfo);
         const editionDisplayElements = document.querySelectorAll(".display-login");
         for (const element of editionDisplayElements) {
            element.style.display = "flex";
            loginText.innerText = "logout";
         }
         const editionFilterBar = document.querySelector(".filter");
         editionFilterBar.style.display = "none";
      } else {
         loginText.innerText = "logout";
         console.log("User isn't an admin.");
      }
   } else {
      console.log("User not logged.");
   }
}

function generateGallery(gallery) {
   galleryDisplay.innerHTML = "";
   gallery.forEach(work => {
      const figure = document.createElement("figure");       
      const imageElement = document.createElement("img");
      imageElement.src = work.imageUrl;
      imageElement.alt = work.title;
      const figCaption = document.createElement("figcaption");
      figCaption.innerText = work.title;

      figure.appendChild(imageElement);
      figure.appendChild(figCaption);    

      galleryDisplay.appendChild(figure);
   });
};

function createFilterButtons (categories) {
   const filterContainer = document.querySelector(".filter")

   const button = document.createElement('button');
   button.classList.add("filter-btn");
   button.textContent = "Tous";
   button.setAttribute('data-category', buttonAll);
   filterContainer.appendChild(button);

   categories.forEach(category => {
      const button = document.createElement('button');
      button.classList.add("filter-btn");
      button.textContent = category.name;
      button.setAttribute('data-category', category.id);
      filterContainer.appendChild(button);
    }); 
};

const filterButtons = document.querySelectorAll('[data-category]');
filterButtons.forEach(button => {
   button.addEventListener('click', () => {
      const category = parseInt(button.getAttribute('data-category'));
      const filter = category === buttonAll ? gallery : gallery.filter(work => work.categoryId === category);
      generateGallery(filter);
   });
});

const boutonLogin = document.getElementById("login-btn");
boutonLogin.addEventListener("click", () => {
   const userInfo = JSON.parse(window.sessionStorage.getItem('login'));
   if (userInfo) {
      window.sessionStorage.removeItem('login');
   }
   location.href ="./login.html";
});

/**************MODAL**********************/
const boutonModify = document.querySelector(".modify-btn");
const modal = document.getElementById("modal");
const modalCloseImg = document.querySelector(".modal-close");

function createModalGallery(gallery) {
   const modalGallery = document.querySelector(".modal-gallery");
   modalGallery.innerHTML = "";
   gallery.forEach(work => {
      const imageContainer = document.createElement("div");
      imageContainer.classList.add("modal-img-container");
      imageContainer.setAttribute('data-work-id', work.id);

      const imageElement = document.createElement("img");
      imageElement.src = work.imageUrl;

      const deleteElement = document.createElement("i");
      deleteElement.classList.add("modal-delete-item");
      deleteElement.classList.add("fa-solid");
      deleteElement.classList.add("fa-trash-can");

      imageContainer.appendChild(imageElement);
      imageContainer.appendChild(deleteElement);

      modalGallery.appendChild(imageContainer);
   });
};

boutonModify.addEventListener("click", () => {
   modal.style.display = "flex";
   createModalGallery(gallery);
});

modalCloseImg.addEventListener("click", () => {
   modal.style.display = "none";
})