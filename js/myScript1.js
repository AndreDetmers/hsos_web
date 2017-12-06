/* global firebase*/
function alter() {
    alert("Bist du bereits 16 Jahre oder älter?");

}

function initFirebase() {
    var config = {
        apiKey: "AIzaSyCqLcfAN8p-PyBfuYUozHJp0_k1XB7qRuE",
        databaseURL: "https://beertasting-osna.firebaseio.com/",
        authDomain: "beertasting-osna.firebaseapp.com",
    };
    firebase.initializeApp(config);
}

initFirebase();
firebase.auth().onAuthStateChanged(loginChanged);


/*Produktliste auf der Bierseite*/
function bierliste() {
    var productRef = firebase.database().ref('products')
    productRef.once('value').then(setProductList);
}

function setProductList(value) {
    console.log(value);
    var products = value.val();
    products.forEach(addProductToBlock);
}

function addProductToBlock(product) {
    var block = document.querySelector("#biercontainer");
    var div = document.createElement('div');
    div.innerHTML = '<img class="flexbilder" src="' + product.imageUrl + '"<ul class="ul-biere"><li><b>' + product.name + '</b></li><li><b>' + product.price + '</b></li></ul>';
    div.classList += "biere";
    block.appendChild(div);
}

/*Newsanzeige an der Seite*/
function newsliste() {
    var newsRef = firebase.database().ref('news')
    newsRef.once('value').then(setNewsList);
}

function setNewsList(value) {
    console.log(value);
    var news = value.val();
    news.forEach(addNewsToBlock);
}

function addNewsToBlock(news) {
    var werbung = document.querySelector("#news-side");
    var div = document.createElement('div');
    div.innerHTML = '<img class="flexbilder" src="' + news.imageUrl + '"<ul><li>' + news.name + '</li><li><button type="button" class="btn button"><a class="button" href="biere.html">' + news.linkname + '</a></button></li></ul>';
    div.classList += "news";
    werbung.appendChild(div);
}

/* This change listener calls the loginChanged() function 
 * whenever a user logs in or out */

function login() {
    var user = firebase.auth().currentUser;
    var email = document.getElementById("inputEmail").value;
    var password = document.getElementById("inputPassword").value;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(handleError);

}

function logout() {
    firebase.auth().signOut().then(function() {
        console.log("Erfolgreich abgemeldet!");
        alert('Erfolgreich ausgeloggt');
    }).catch(handleError);
}
/* This is the callback function when the user changed.
 * Either because a new user logged in, or the current user
 * signed out. */
function loginChanged(user) {

    if (user) {
        document.getElementById("loginhide").setAttribute("hidden", "true");
        document.getElementById("btnLogout").removeAttribute("hidden");
        document.getElementById("profilseite").removeAttribute("hidden");
        document.getElementById("loginhide2").setAttribute("hidden", "true");
        document.getElementById("btnLogout").removeAttribute("hidden");
        console.log("Successfully logged in!");
        var email = user.email;
        document.getElementById("welcomeTitle").innerText = "Guten Tag " + email;
        var profileExists = false;
        var userProfile = firebase.database().ref('userprofiles/' + user.uid);
        userProfile.once('value', function(value) {
            if (value.val()) {
                console.log("User profile is already there...");
                updateDisplay();
            }
            else {
                console.log("User profile does not exist, must be a  new user...");
                createExtendedUserProfile();
            }
        });
        var emailVerified = user.emailVerified;
        if (emailVerified === false) { sendVerificationEMail(); }

    }
    else {
        document.getElementById("loginhide").removeAttribute("hidden");
        document.getElementById("btnLogout").setAttribute("hidden", "true");
        document.getElementById("profilseite").setAttribute("hidden", "true");
        document.getElementById("loginhide2").removeAttribute("hidden");
        document.getElementById("welcomeTitle").innerText = "";

    }

}

function createExtendedUserProfile() {
    var user = firebase.auth().currentUser;

    // Make sure we have a logged in user
    if (user) {
        var profileRef = firebase.database().ref('userprofiles/' + user.uid);
        profileRef.set({
            country: document.getElementById("country").value,
            birthday: document.getElementById("gebdat").value,
            username: document.getElementById("username").value,
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value

            // Here you can add as many properties as you like....
        }).then(() => {
            console.log("Successfully updated extended user profile...");
        });
    }
    sendVerificationEMail();
}
/* This is called if something goes wrong when logging in or logging out.
 * For example if the user's password is wrong. */
function handleError(error) {
    console.error(error.code + ": " + error.message);
}


function handleSignUp() {

    var email = document.getElementById('signupEmail').value;
    var password = document.getElementById('signupPasswort').value;
    var country = document.getElementById('country').value;
    var birthday = document.getElementById('gebdat').value;
    var lastname = document.getElementById('lastname').value;
    var firstname = document.getElementById('firstname').value;
    var username = document.getElementById('username').value;
    var passwort2 = document.getElementById('passwort2').value;

    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }
    if (country.length < 4) {
        alert('Please select a country');
        return;
    }
    if (birthday.length < 4) {
        alert('Please select a birthday');
        return;
    }
    if (lastname.length < 2) {
        alert('Please select a last name');
        return;
    }
    if (firstname.length < 2) {
        alert('Please select a first name');
        return;
    }
    if (username.length < 4) {
        alert('Please select a user name');
        return;
    }
    if (passwort2 != password) {
        alert('password is incorrect');
        return;
    }

    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(handleError);
    // [END createwithemail]
    createExtendedUserProfile();
}

function sendVerificationEMail() {
    var user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function() {
        console.log("Verification e-Mail has been sent!");
    }).catch(handleError);
}

function checkEmailVerified() {
    // Antoher way to get the current user
    var user = firebase.auth().currentUser;
    // Get some user data
    var emailVerified = user.emailVerified;
    if (emailVerified === false) {
        document.getElementById("welcomeTitle").innerText = "Welcome " + user.email;
        document.getElementById("welcomeText").innerHTML = "Please verify your account by clicking the button below!";
        document.getElementById("btnVerify").removeAttribute("hidden");
    }
    else {
        document.getElementById("welcomeTitle").innerText = "Welcome " + user.email;
        document.getElementById("welcomeText").innerHTML = "Your account email has been verified!";
    }
}

function updateProfile() {
    var user = firebase.auth().currentUser;
    user.updateProfile({}).then(function() {
        console.log("Profile update was successful!");
        updateDisplay();
    }).catch(handleError);
    /* This call writes the extended properties
     * to the Firebase real-time database */
    updateExtendedProfile();
}

function updateExtendedProfile() {
    var user = firebase.auth().currentUser;
    if (user) {
        var username = document.getElementById("inputDisplayName").value;
        var photoURL = document.getElementById("inputPhotoUrl").value;
        var country = document.getElementById("inputCountry").value;
        var zipCode = document.getElementById("inputZipCode").value;
        var city = document.getElementById("inputCity").value;
        var street = document.getElementById("inputStreet").value;
        var beer = document.getElementById("inputBeer").value;
        var newsletter = document.getElementById("inputCheckboxNewsletter").checked;
        var userRef = firebase.database().ref('userprofiles/' + user.uid);
        userRef.update({
            username: username,
            photoURL: photoURL,
            country: country,
            zip: zipCode,
            city: city,
            street: street,
            beer: beer,
            subscribeNewsletter: newsletter
        });
    }
}
/* This function update the profile picture
 * and the display name on the website */
function updateDisplay() {
    var user = firebase.auth().currentUser;
    // Read the extended user profile from the database
    firebase.database().ref('userprofiles/' + user.uid).once('value', function(value) {
        document.getElementById("cardUserDisplayName").innerText = value.val().username;
        document.getElementById("imgProfilePhoto").setAttribute("src", value.val().photoURL);
        document.getElementById("displayCountry").innerText = value.val().country;
        document.getElementById("displayZipCode").innerText = value.val().zip;
        document.getElementById("displayCity").innerText = value.val().city;
        document.getElementById("displayStreet").innerText = value.val().street;
        document.getElementById("displayBeer").innerText = value.val().beer;
        // Set the form values
        document.getElementById("inputDisplayName").value = value.val().username;
        document.getElementById("inputPhotoUrl").value = value.val().photoURL;
        document.getElementById("inputCountry").value = value.val().country;
        document.getElementById("inputZipCode").value = value.val().zip;
        document.getElementById("inputCity").value = value.val().city;
        document.getElementById("inputStreet").value = value.val().street;
        document.getElementById("inputBeer").value = value.val().beer;
        document.getElementById("inputCheckboxNewsletter").checked = value.val().subscribeNewsletter;
    })
}
