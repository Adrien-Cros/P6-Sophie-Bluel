// PB: ma page ce refresh lorsque je supprime un élément de ma modal
const galleryDisplay = document.querySelector(".gallery");
const buttonAll = 0;
let gallery = window.localStorage.getItem('gallery');
let categories = window.localStorage.getItem('categories');

init();
displayAdminUI();

async function init() {
   let response = await fetch('http://localhost:5678/api/works');
   gallery = await response.json();
   response = await fetch('http://localhost:5678/api/categories');
   categories = await response.json();
   const galleryNumbers = JSON.stringify(gallery);
   const categoriesNumbers = JSON.stringify(categories);
   window.localStorage.setItem("gallery", galleryNumbers);
   window.localStorage.setItem("categories", categoriesNumbers);
  /* if (gallery === null){

   } else {
      gallery = JSON.parse(gallery);
      categories = JSON.parse(categories);
   }*/

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

   const filterButtons = document.querySelectorAll('[data-category]');
   filterButtons.forEach(button => {
      button.addEventListener('click', () => {
         const category = parseInt(button.getAttribute('data-category'));
         const filter = category === buttonAll ? gallery : gallery.filter(work => work.categoryId === category);
         generateGallery(filter);
      });
   });
};

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
const modalMain = document.querySelector(".modal-content-main");
const modalAdd = document.querySelector(".modal-content-add");

function createModalGallery(gallery) {
   const modalGallery = document.querySelector(".modal-gallery");
   modalGallery.innerHTML = "";
   gallery.forEach(work => {
      const imageContainer = document.createElement("div");
      imageContainer.classList.add("modal-img-container");

      const imageElement = document.createElement("img");
      imageElement.src = work.imageUrl;

      const deleteElement = document.createElement("i");
      deleteElement.classList.add("modal-delete-item");
      deleteElement.classList.add("fa-solid");
      deleteElement.classList.add("fa-trash-can");
      deleteElement.addEventListener("click", async (event) => {
         event.preventDefault();
         event.stopPropagation();
         const userInfo = JSON.parse(window.sessionStorage.getItem('login'));
         const adminToken = userInfo.token;
      
         let response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
            method: "DELETE",
            headers: {
               accept: "*/*",
               Authorization: `Bearer ${adminToken}`,
             },
         })
         if (response.ok) {
            console.log("Delete from database:" + work.id);
            gallery = gallery.filter(item => item.id !== work.id);
            const galleryNumbers = JSON.stringify(gallery);
            window.localStorage.setItem("gallery", galleryNumbers);
            createModalGallery(gallery);
         } else {
            alert("Echec de la suppression");
         }
      });

      imageContainer.appendChild(imageElement);
      imageContainer.appendChild(deleteElement);

      modalGallery.appendChild(imageContainer);
   });
};

boutonModify.addEventListener("click", () => {
   modal.style.display = "flex";
   modalMain.style.display = "flex";
   modalAdd.style.display = "none";
   returnArrow.style.visibility = "hidden";
   createModalGallery(gallery);
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

formUpload.addEventListener("change", () => {
   const workValue = workName.value;
   const categoryID = categoryName.value;

   if (fileInput.files.length > 0) {
      addImgBtn.style.display = "none";
      fileImg.style.display = "block";

      const selectedFile = fileInput.files[0];

      fileReader.onload = function(event) {
         addImgBtn.style.display = "none";
         fileImg.style.display = "block";
         fileImg.src = event.target.result;
      };
      fileReader.readAsDataURL(selectedFile);
   } else {
      addImgBtn.style.display = "flex";
      fileImg.style.display = "none";
   }

   if (workValue !== "" && categoryID != 0 && fileInput.files.length > 0) {
      validateBtn.classList.remove("btn-bg-gray");
      validateBtn.classList.add("btn-bg-green");
      validateBtn.disabled = false;
      console.log("Prêt pour l'upload");
   }
});

function createSelectCategory() {
   if (categories) {
      const selectCat = document.getElementById("select-cat");
      selectCat.innerHTML = "";

      const optionNull = document.createElement("option");
      optionNull.text = "";
      optionNull.value = 0;
      selectCat.appendChild(optionNull);

      categories.forEach(category => {
         const option = document.createElement("option");
         option.text = category.name;
         option.value = category.id;

         selectCat.appendChild(option);
      });
   } else {
      console.log("Impossible de retrouver les catégories.")
   }
}