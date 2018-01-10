/* global firebase*/

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

function login() {
    var user = firebase.auth().currentUser;
    var email = document.getElementById("inputEmail").value;
    var password = document.getElementById("inputPassword").value;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(handleError);

}

function loginChanged(user) {

    if (user) {
        console.log("Successfully logged in!");
        var email = user.email;
        var profileExists = false;
        var userProfile = firebase.database().ref('userprofiles/' + user.uid);
        userProfile.once('value', function(value) {
            if (value.val()) {
                console.log("User profile is already there...");
            }
            else {

            }
        });

    }
    else {
        document.getElementById("anmelden").removeAttribute("hidden");
        bierliste();
    }


}
/*Produktliste auf der Bierseite*/
function bierliste() {
    var productRef = firebase.database().ref('products')
    productRef.once('value').then(setProductList);
}

function setProductList(value) {

    var products = value.val();
    products.forEach(addProductToBlock);
}

function addProductToBlock(products, productId) {
    var block = document.querySelector("#biercontainer");
    var div = document.createElement('div');
    div.setAttribute("data-id", productId);
    return getRatingForProduct(productId).then(ratingForProduct => {
        var thumbsup = 0,
            votes = 0;
        if (ratingForProduct !== null) {
            thumbsup = ratingForProduct.thumbsup;
            votes = ratingForProduct.votes;
            div.innerHTML = '<img class="flexbilder" src="' + products.imageUrl + '"' +
                '<ul class="ul-biere"><li><b>' + products.name + '</b></li><li><b>' + products.price + '</b></li></ul>' +
                '<p>' + thumbsup + ' von ' + votes + ' gefällt dieses Bier (' + Math.round(thumbsup / votes * 100) + '%)</p>';
            div.classList += " biere";
            return div;
        }
    });
    /*return getUserRatings().then(userRating => {
        if (userRating !== null)
            var userProductRating = userRating[productId];
        var thumbUpSelected = userProductRating === 1 ? " up" : "";
        var thumbDownSelected = userProductRating === 0 ? " down" : "";

        div.innerHTML = '<h4>' + product.name + '</h4>' +
            '<p>' + product.description + '</p>' +
            '<p><strong>' + product.price + '</strong></p>' +
            '<p>' + thumbsup + ' von ' + votes + ' gefällt dieses Bier (' + Math.round(thumbsup / votes * 100) + '%)</p>';
        div.classList += "biere";
        block.appendChild(div);
    });*/
}

/* This function gets the ratings for the current user 
 * If no user is logged in, it returns null */
function getUserRatings() {
    var user = firebase.auth().currentUser;
    var userRatingsRef = firebase.database().ref('userratings/' + user.uid);
    return userRatingsRef.once('value').then(value => {
        return value.val();
    });
}


/* This function gets the rating for the product with the given id 
 * If the rating does not exist, it returns null */
function getRatingForProduct(id) {
    var prodRatingRef = firebase.database().ref("productratings/" + id);
    return prodRatingRef.once('value').then(value => {
        return value.val();
    });
}

/* This function takes care of creating the div element
 * for a single product. It calls the getUserRatings() and
 * getRatingsForProduct() functions */
function setupProductDiv(product, productId) {
    // Create a new div element using JavaScript
    var newDiv = document.createElement('div');
    var user = firebase.auth().currentUser;

    // Add the bootstrap class and our own product class
    newDiv.className += "col-md product";
    // Add two icons, thump up and down, to allow rating (when logged in)
    newDiv.setAttribute("data-id", productId);
    return getRatingForProduct(productId).then(ratingForProduct => {

        var thumbsup = 0,
            votes = 0;
        if (ratingForProduct !== null) {
            thumbsup = ratingForProduct.thumbsup;
            votes = ratingForProduct.votes;

            if (user !== null) {
                return getUserRatings().then(userRating => {

                    var userProductRating;

                    if (userRating !== null)
                        userProductRating = userRating[productId];

                    var thumbUpSelected = userProductRating === 1 ? " up" : "";
                    var thumbDownSelected = userProductRating === 0 ? " down" : "";
                    newDiv.innerHTML = '<img class="flexbilder" src="' + product.imageUrl + '"' +
                        '<ul class="ul-biere"><li><b>' + product.name + '</b></li><li><b>' + product.price + '</b></li></ul>' +
                        '<p>' + thumbsup + ' von ' + votes + ' gefällt dieses Bier (' + Math.round(thumbsup / votes * 100) + '%)</p>' +
                        '<div class="rate">' +
                        '<i onclick="thumb(this, 1)" class="fas fa-thumbs-up fa-2x' + thumbUpSelected + '"></i>' +
                        '<i onclick="thumb(this, 0)" class="fas fa-thumbs-down fa-2x' + thumbDownSelected + '"></i>' +
                        '</div>';

                    newDiv.classList += " biere";
                    newDiv.setAttribute("data-rating", Math.round(thumbsup / votes * 100));
                    return newDiv;

                });
            }
            else {
                newDiv.innerHTML = '<img class="flexbilder" src="' + product.imageUrl + '"' +
                    '<ul class="ul-biere"><li><b>' + product.name + '</b></li><li><b>' + product.price + '</b></li></ul>' +
                    '<p>' + thumbsup + ' von ' + votes + ' gefällt dieses Bier (' + Math.round(thumbsup / votes * 100) + '%)</p>';
                newDiv.classList += " biere";
                newDiv.setAttribute("data-rating", Math.round(thumbsup / votes * 100));
                    
                return newDiv;
            }
        }

    });

    // Get the user's ratings
    /*return getUserRatings().then(userRating => {
        if (userRating !== null) {
            var userProductRating = userRating[productId];
            var thumbUpSelected = userProductRating === 1 ? " up" : "";
            var thumbDownSelected = userProductRating === 0 ? " down" : "";
            newDiv.innerHTML = '<img class="flexbilder" src="' + product.imageUrl + '"' +
                '<ul class="ul-biere"><li><b>' + product.name + '</b></li><li><b>' + product.price + '</b></li></ul>' +
                '<p>' + thumbsup + ' von ' + votes + ' gefällt dieses Bier (' + Math.round(thumbsup / votes * 100) + '%)</p>' +
                '<div class="rate">' +
                '<i onclick="thumb(this, 1)" class="fas fa-thumbs-up fa-2x' + thumbUpSelected + '"></i>' +
                '<i onclick="thumb(this, 0)" class="fas fa-thumbs-down fa-2x' + thumbDownSelected + '"></i>' +
                '</div>';
            newDiv.classList += " biere";
            return newDiv;
        }

    });*/

}
/*'<img class="flexbilder" src="' + product.imageUrl + '"<ul class="ul-biere"><li><b>' + product.name + '</b></li><li><b>' + product.price + '</b></li></ul>';
 */
var productsRef = firebase.database().ref('products');

refreshProdcutList();


/* This function bundles all necessary steps to 
 * refresh the product's information */
function refreshProdcutList() {
    productsRef.once('value').then(value => {

        var products = value.val();
        var promises = [];

        products.forEach((product, index) => {

            promises.push(setupProductDiv(product, index));
        });

        Promise.all(promises).then((productDivs) => {

            productDivs.sort((a, b) => { return b.dataset.rating - a.dataset.rating; });

            // Get the div element that contains the products
            var listContainer = document.querySelector("#biercontainer");
            // Remove all old div elements (this is faster than innerHTML = "")
            while (listContainer.firstChild) {
                listContainer.removeChild(listContainer.firstChild);
            }
            // Loop through all productDivs and append them to the list

            productDivs.forEach(productDiv => {
                listContainer.appendChild(productDiv);

            });
        });
    });
}


/* This function is called when a thumb (up or down) icon
 * is clicked. The function get the information about up or down 
 * in the rating parameter */
function thumb(event, rating) {
    var user = firebase.auth().currentUser;
    var productId = event.parentElement.parentElement.dataset.id;
    if (user) {
        // Check if the user has previously rated this product
        var userRatingRef = firebase.database().ref('userratings/' + user.uid + '/' + productId);
        // Get a reference to the product's rating (not user specific)
        var productRatingRef = firebase.database().ref('productratings/' + productId);
        userRatingRef.once('value', function(userRating) {
            var previousRating = userRating.val();
            // If the user has already voted for this product
            if (previousRating !== null) {
                // Deduct the previous rating from the total
                productRatingRef.once('value', function(productRating) {
                    var prodRating = productRating.val();
                    // If the rating entry for this product exists already
                    // Decuct previous user rating, and add one. Votes stay the same.
                    if (prodRating) {
                        var ratingObj = { thumbsup: prodRating.thumbsup - previousRating + rating, votes: prodRating.votes };
                        productRatingRef.set(ratingObj);
                        userRatingRef.set(rating);
                    }
                    // If not, create a new one (cannot be reached, as user has already voted for this product)
                    else {
                        var ratingObj = { thumbsup: rating, votes: 1 };
                        productRatingRef.set(ratingObj);
                        userRatingRef.set(rating);
                    }
                });
            }
            // No vote for this product from the user so far
            else {
                productRatingRef.once('value', function(productRating) {
                    var prodRating = productRating.val();
                    // If the rating entry for this product exists already
                    // Add user rating and vote.
                    if (prodRating !== null) {
                        var ratingObj = { thumbsup: prodRating.thumbsup + rating, votes: prodRating.votes + 1 };
                        productRatingRef.set(ratingObj);
                        userRatingRef.set(rating);
                    }
                    // If not, create a new one (cannot be reached, as user has already voted for this product)
                    else {
                        var ratingObj = { thumbsup: rating, votes: 1 };
                        productRatingRef.set(ratingObj);
                        userRatingRef.set(rating);
                    }

                });
            }
            refreshProdcutList();
        });
    }
}


/*Newsanzeige an der Seite*/
function newsliste() {
    var newsRef = firebase.database().ref('news')
    newsRef.once('value').then(setNewsList);
}

function setNewsList(value) {

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

/* This is called if something goes wrong when logging in or logging out.
 * For example if the user's password is wrong. */
function handleError(error) {
    console.error(error.code + ": " + error.message);
}

function counter(id) {
    var votes = firebase.database().ref('productratings');
    votes.on('value', counter2);
}

function counter2(value) {
    var zahl = value.val();

    var votesCount = 0;

    zahl.forEach((rating) => {

        votesCount += rating.votes;
    });

    var votesCount2 = zahl.reduce((a, rating) => { return a + rating.votes; }, 0);

    addZahlToBlock(votesCount);
}

function addZahlToBlock(votesCount) {
    var uebersicht = document.querySelector('#uebersicht');
    uebersicht.innerHTML = '<div class="biere"><p> Es wurden bereits ' + votesCount + ' Bewertungen abgegeben!</p></div>';
    
}