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
            //traiter les données de la réponse
            console.log('Réponse du serveur :', data);        
        })
        .catch(error => {
            console.error('Erreur :', error);
        });
    } else {
        console.log("Email invalide");
    }
})
