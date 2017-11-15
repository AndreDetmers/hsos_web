function alter() {
    alert("Bist du bereits 16 Jahre oder älter?");

}

function initFirebase() {
    var config = {
        apiKey: "AIzaSyCqLcfAN8p-PyBfuYUozHJp0_k1XB7qRuE",
        databaseURL: "https://beertasting-osna.firebaseio.com/"
    };
    firebase.initializeApp(config);
}

initFirebase();

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

/*Newsanzeige an der Seite (noch nicht fertig)*/
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
