const BUTTON_RESET_FILTER = 0;
let globalGallery = JSON.parse(window.localStorage.getItem('gallery'));
let globalCategories = JSON.parse(window.localStorage.getItem('categories'));

init();
displayAdminUI();

async function init() {
   let response = await fetch('http://localhost:5678/api/works');
   globalGallery = await response.json();
   response = await fetch('http://localhost:5678/api/categories');
   globalCategories = await response.json();
   window.localStorage.setItem("gallery", JSON.stringify(globalGallery));
   window.localStorage.setItem("categories", JSON.stringify(globalCategories));

   generateGallery(globalGallery);
   createFilterButtons(globalCategories);
};

function displayAdminUI() {
   const userInfo = JSON.parse(window.sessionStorage.getItem('login'));
   const loginText = document.getElementById("login-btn");
   if (userInfo !== null) {
         loginText.innerText = "logout";
         const editionDisplayElements = document.querySelectorAll(".display-login");
         for (const element of editionDisplayElements) {
            element.style.display = "flex";
         }
         const editionFilterBar = document.querySelector(".filter");
         editionFilterBar.style.display = "none";
   }
}

function generateGallery(gallery) {
   const galleryDisplay = document.querySelector(".gallery");
   gallery.sort((a, b) => a.id - b.id);
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
   filterContainer.innerHTML = "";

   const button = document.createElement('button');
   button.classList.add("filter-btn");
   button.textContent = "Tous";
   button.setAttribute('data-category', BUTTON_RESET_FILTER);
   filterContainer.appendChild(button);
   categories.sort((a, b) => a.id - b.id);

   categories.forEach(category => {
     const button = document.createElement('button');
     button.classList.add("filter-btn");
     button.textContent = category.name;
     button.setAttribute('data-category', category.id);
     filterContainer.appendChild(button);
   }); 

   const filterButtons = document.querySelectorAll('[data-category]');
   filterButtons.forEach(button => {
      button.addEventListener('click', () => {
         const categoryID = parseInt(button.getAttribute('data-category'));
         const filter = categoryID === BUTTON_RESET_FILTER ? globalGallery : globalGallery.filter(work => work.categoryId === categoryID);
         generateGallery(filter);
      });
   });
};

const boutonLogin = document.getElementById("login-btn");
boutonLogin.addEventListener("click", () => {
   const userInfo = JSON.parse(window.sessionStorage.getItem('login'));
   if (userInfo) {
      window.sessionStorage.removeItem('login');
      location.reload();
   } else {
      location.href ="./login.html";
   }
});

/**************MODAL**********************/
const boutonModify = document.querySelector(".modify-btn");
const modal = document.getElementById("modal");
const modalMain = document.querySelector(".modal-content-main");
const modalAdd = document.querySelector(".modal-content-add");

function createModalGallery(gallery) {
   const modalGallery = document.querySelector(".modal-gallery");
   modalGallery.innerHTML = "";
   gallery.sort((a, b) => a.id - b.id);
   gallery.forEach(work => {
      const imageContainer = document.createElement("div");
      imageContainer.classList.add("modal-img-container");

      const imageElement = document.createElement("img");
      imageElement.src = work.imageUrl;

      const deleteElement = document.createElement("i");
      deleteElement.classList.add("modal-delete-item");
      deleteElement.classList.add("fa-solid");
      deleteElement.classList.add("fa-trash-can");
      imageContainer.appendChild(imageElement);
      imageContainer.appendChild(deleteElement);

      modalGallery.appendChild(imageContainer);
      deleteElement.addEventListener("click", (event) => {
         event.preventDefault();
         const userInfo = JSON.parse(window.sessionStorage.getItem('login'));
         const adminToken = userInfo.token;
      
         fetch(`http://localhost:5678/api/works/${work.id}`, {
            method: "DELETE",
            headers: {
               accept: "*/*",
               Authorization: `Bearer ${adminToken}`,
             },
         })
         .then(response => {
            if (response.ok) {
               gallery = gallery.filter(item => item.id !== work.id);
               window.localStorage.setItem("gallery", JSON.stringify(gallery));
               globalGallery = JSON.parse(window.localStorage.getItem('gallery'));
               createModalGallery(gallery);
               generateGallery(gallery);
            } else {
               alert("Echec de la suppression");
            }
         })
         .catch(error => {
         console.error('Erreur :', error);
         });
      });
   });
};

boutonModify.addEventListener("click", () => {
   modal.style.display = "flex";
   modalMain.style.display = "flex";
   modalAdd.style.display = "none";
   returnArrow.style.visibility = "hidden";
   createModalGallery(globalGallery);
});

modal.addEventListener("click", (event) => {
   if (event.target === modal || event.target.classList.contains("modal-close")) {
      modal.style.display = "none";
   }
});

/********Ajout des photos************/
const addNewWorkBtn = document.getElementById("add-work");
const returnArrow = document.querySelector(".return-arrow");

const formUpload = document.getElementById("form-upload");
const validateBtn = document.getElementById("validate-work");

const addImgBtn = document.querySelector(".add-image-btn");
const fileImg = document.querySelector(".file-img");

const fileInput = document.getElementById("file");
const workName = document.getElementById("work-name");
const categoryName = document.getElementById("select-cat");

const fileReader = new FileReader();

returnArrow.addEventListener("click", () => {
   returnArrow.style.visibility = "hidden";
   modalMain.style.display = "flex";
   modalAdd.style.display = "none";
});

addNewWorkBtn.addEventListener("click", () => {
   returnArrow.style.visibility = "visible";
   modalMain.style.display = "none";
   modalAdd.style.display = "flex";
   addImgBtn.style.display = "flex";
   fileImg.style.display = "none";

   workName.value = "";
   fileInput.value = "";
   validateBtn.classList.remove("btn-bg-green");
   validateBtn.classList.add("btn-bg-gray");
   validateBtn.disabled = true;
   createSelectCategory();
});

let selectedFile = null;
let workValue = null;
let categoryID = null;

formUpload.addEventListener("change", () => {
   workValue = workName.value;
   categoryID = categoryName.value;
   const maxFileSize = 4 * 1024 * 1024; // 4 MO

   if (fileInput.files.length > 0) {
      selectedFile = fileInput.files[0];

      if (selectedFile.size < maxFileSize) {
         addImgBtn.style.display = "none";
         fileImg.style.display = "block";

         fileReader.onload = function(event) {
            fileImg.src = event.target.result;
         };
         fileReader.readAsDataURL(selectedFile);
      } else {
         alert("Fichier trop lourd, taille maximum 4 mo.");
      }
   } else {
      addImgBtn.style.display = "flex";
      fileImg.style.display = "none";
   }

   let readyToSubmit = workValue !== "" && categoryID != 0 && fileInput.files.length > 0;
   if (readyToSubmit) {
      validateBtn.classList.remove("btn-bg-gray");
      validateBtn.classList.add("btn-bg-green");
      validateBtn.disabled = false;

      formUpload.removeEventListener("submit", submitHandler);
      formUpload.addEventListener("submit", submitHandler);
   } else {
      validateBtn.classList.remove("btn-bg-green");
      validateBtn.classList.add("btn-bg-gray");
      validateBtn.disabled = true;
      readyToSubmit = false;
   }
});

function submitHandler(event) {
   event.preventDefault();
   submitWorkToAPI(workValue, selectedFile, categoryID);
}

function submitWorkToAPI (title, imageUrl, categoryId) {
   const userInfo = JSON.parse(window.sessionStorage.getItem('login'));
   const adminToken = userInfo.token;

   const formData = new FormData();
   formData.append('title', title);
   formData.append('image', imageUrl);
   formData.append('category', categoryId);

   fetch ("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
         authorization: `Bearer ${adminToken}`
       },
      body: formData
   })
   .then(response => {
      if (!response.ok) {
         throw new Error('La demande a échoué avec le code ' + response.status);
      }
      return response.json();
  })
  .then(data => {
      if (data) {
         globalGallery.push(data);
         window.localStorage.setItem("gallery", JSON.stringify(globalGallery));
         globalGallery = JSON.parse(window.localStorage.getItem('gallery'));

         modal.style.display = "none";
         generateGallery(globalGallery);
      }
   })
  .catch(error => {
      console.error('Erreur :', error);
  });
}

function createSelectCategory() {
   if (globalCategories) {
      const selectCat = document.getElementById("select-cat");
      selectCat.innerHTML = "";

      const optionNull = document.createElement("option");
      optionNull.text = "";
      optionNull.value = 0;
      selectCat.appendChild(optionNull);

      globalCategories.forEach(category => {
         const option = document.createElement("option");
         option.text = category.name;
         option.value = category.id;

         selectCat.appendChild(option);
      });
   } else {
      alert("Impossible de retrouver les catégories.")
   }
}

const formContact = document.getElementById("form-contact");
formContact.addEventListener("submit", event => {
   event.preventDefault();
})