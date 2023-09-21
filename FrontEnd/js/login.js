//récupération du formulaire
const form = document.querySelector('form');

//traitement des infos lors du click sur le bouton se connecter
form.addEventListener("submit", (event) => {
    //empeche l'application par defaut de submit
    event.preventDefault();
    //récupération des informations de connection
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    //vérifie si l'email a le bon format mail (XXX @ XXX . XXX)
    const regex = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+");
    const emailCheck = regex.test(email);
    if (emailCheck !== false) {
        //création d'un objet qui contient les informations de connection
        const comboLogin = {
            email: email,
            password: password
        }
        //transformation en string de l'objet
        const infoToSubmit = JSON.stringify(comboLogin);
        
        //envoi de l'objet dans l'API
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: infoToSubmit
        })
        .then(response => {
            //vérifier le code de statut
            if (!response.ok) {
                throw new Error('La demande a échoué avec le code ' + response.status);
            }
            //convertir la réponse en JSON
            return response.json();
        })
        .then(data => {
            //stocke les données reçu du serveur si le code de réponse est 200
            const login = JSON.stringify(data);
            //stocke les informations de l'utilisateur connecté en session storage (pour reset les infos lorsque l'utilisateur ferme son navigateur)
            window.sessionStorage.setItem("login", login);
            //redirige vers la page principale
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
})
