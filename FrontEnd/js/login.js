const form = document.querySelector('form');
const returnMainPage = document.getElementById("projects");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const regex = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+");
    const emailCheck = regex.test(email);
    if (emailCheck !== false) {
        const comboLogin = {
            email: email,
            password: password
        }
        const infoToSubmit = JSON.stringify(comboLogin);
        
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: infoToSubmit
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('La demande a échoué avec le code ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const login = JSON.stringify(data);
            window.sessionStorage.setItem("login", login);
            location.href ="./index.html";  
        })
        .catch(error => {
            const errorMsg = document.querySelector(".error-msg");
            errorMsg.textContent = "Erreur dans l’identifiant ou le mot de passe.";
            console.error('Erreur :', error);
        });
    } else {
        const errorMsg = document.querySelector(".error-msg");
        errorMsg.textContent = "Format d'E-mail invalide.";
    }
});

returnMainPage.addEventListener("click", () =>{
    location.href ="./index.html";
});
