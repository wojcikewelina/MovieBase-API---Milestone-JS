"use strict"
const MOVIE_API_URL = "https://us-central1-itfighters-movies.cloudfunctions.net/api/movie"
let listOfMoviesNotToChange = [];
let listOfMovies = [];

// left bar

let navSearchButton;
let searchingInput;
let leftBarConteiner;
let leftMovieDivConatainer;

// right bar

let rightDetailsConteiner;
let imageConatiner;
let detailsContainer;
let detailsOfMovie = {};
let detailsTitleOfMovie;
let detailsRestOfMovie;

// nav bar
let navigationBar;
let navAddButton;
let navDeleteButton;

// Add bar

let addOrEditMovieDiv;

// delete-or-edit 

var getButtons;

loadAllMovies();

window.onload = () => {

    getElementsFromDOM();
    createSearchTableOnEvent();
    navAddMovieToAPIOnEvent();
    navDeleteMovieOnEvent();
}

// funkcja pobierająca elementy z DOM

function getElementsFromDOM() {

    navigationBar = document.querySelector("nav")
    navSearchButton = document.querySelector("#navSearchButton");
    navAddButton = document.querySelector('#navAddButton');
    navDeleteButton = document.querySelector("#navDeleteButton");

    leftBarConteiner = document.querySelector("#leftBarConteiner");
    rightDetailsConteiner = document.querySelector("#rightDetailsConteiner");

    addOrEditMovieDiv = document.querySelector("#addOrEditMovieDiv");
}

// Tworzenie paska do wyszukiwania filmów pojawiajacego się po naciśnięciu przyciski "Wyszukaj Film"

function createSearchTableOnEvent() {
    navSearchButton.addEventListener("click", startWindow);
}

// Funkcja wywołujaca się wraz z otwarciem strony i na klika "Szukaj"

function startWindow() {

    addOrEditMovieDiv.innerText = "";
    listOfMovies = listOfMoviesNotToChange;
    leftBarConteiner.innerHTML = "";

    var searchingTitle = document.createElement("p");
    searchingInput = document.createElement("input");
    searchingInput.setAttribute("placeholder", "Nazwa szukanego filmu");
    leftMovieDivConatainer = document.createElement("div");
    leftMovieDivConatainer.setAttribute("id", "leftMovieDivConatainer");

    searchingTitle.innerText = "\n Wyszukaj film:";

    searchingInput.addEventListener("input", generateSerchedMovies);

    leftBarConteiner.appendChild(searchingTitle);
    leftBarConteiner.appendChild(searchingInput);
    leftBarConteiner.appendChild(leftMovieDivConatainer);

    generateMovies()

    rightDetailsConteiner.innerText = "";
    imageConatiner = document.createElement("div");
    imageConatiner.setAttribute("id", "imageConatiner");
    rightDetailsConteiner.appendChild(imageConatiner);

    detailsContainer = document.createElement("div");
    detailsContainer.setAttribute("id", "detailsContainer");

    detailsTitleOfMovie = document.createElement("h1");
    detailsRestOfMovie = document.createElement("div");
    detailsContainer.appendChild(detailsTitleOfMovie);
    detailsContainer.appendChild(detailsRestOfMovie);
    rightDetailsConteiner.appendChild(detailsContainer);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
}

// generowanie listy wszystkich filmów 

function generateMovies() {

    leftMovieDivConatainer.innerText = "";
    listOfMovies.forEach((element) => {
        var idOfElement = element.id;

        var wholeMovieDiv = document.createElement("div");
        wholeMovieDiv.setAttribute("class", "wholeMovieDiv");

        var leftImgPart = document.createElement("div");
        leftImgPart.setAttribute("class", "leftImgPart");

        var leftTitlePart = document.createElement("div");
        leftTitlePart.setAttribute("class", "leftTitlePart");

        var leftRatePart = document.createElement("div");
        leftRatePart.setAttribute("class", "leftRatePart");

        var leftDeleteButton = document.createElement("button");
        leftDeleteButton.innerText = "x";
        leftDeleteButton.setAttribute("class", "btn btn-dark delete-or-edit-button");
        leftDeleteButton.style.visibility = "hidden";
        leftDeleteButton.addEventListener("click", () => {

            fetch(MOVIE_API_URL + "/" + element.id, {
                method: "DELETE",
            })
                .then(loadAllMovies)
                .then(startWindow)
                .catch(err => console.warn("nie działa, nie udało ponieważ wystapił błąd: ", err))
        });

        var leftEditButton = document.createElement("button");
        leftEditButton.innerText = "Edit";
        leftEditButton.setAttribute("class", "btn btn-dark delete-or-edit-button");
        leftEditButton.style.visibility = "hidden";

        // funkcja edycji elementu

        leftEditButton.addEventListener("click", () => {

            addOrEditMovieDiv.innerText = ""

            var editTitleOfMovie = document.createElement("input");
            editTitleOfMovie.setAttribute("placeholder", "Nowa nazwa filmu");

            var editYearOfMovie = document.createElement("input");
            editYearOfMovie.setAttribute("placeholder", "Edytuj rok produkcji");

            var editActorsOfMovie = document.createElement("input");
            editActorsOfMovie.setAttribute("placeholder", "Edytuj aktorów");

            var editGenreOfMovie = document.createElement("input");
            editGenreOfMovie.setAttribute("placeholder", "Edytuj gatunek");

            var editUrlOfPicture = document.createElement("input");
            editUrlOfPicture.setAttribute("placeholder", "Edytuj zdjęcie (link)");

            var editRateOfMovie = document.createElement("input");
            editRateOfMovie.setAttribute("placeholder", "Edytuj ocenę (1-6)");

            var editDescriptionOfMovie = document.createElement("input");
            editDescriptionOfMovie.setAttribute("placeholder", "Edytuj opis");

            var EditMovieOnServerButton = document.createElement("button");
            EditMovieOnServerButton.innerText = "Edytuj film!";
            EditMovieOnServerButton.setAttribute("class", "btn");

            EditMovieOnServerButton.addEventListener("click", function addMovieByEventClick() {

                fetch(MOVIE_API_URL + "/" + idOfElement, {
                    method: "PUT",
                    headers: { "Content-type": "application/json; charset=UTF-8" },
                    body: JSON.stringify({
                        title: editTitleOfMovie.value,
                        year: editYearOfMovie.value,
                        cast: editActorsOfMovie.value,
                        genres: editGenreOfMovie.value,
                        imgSrc: editUrlOfPicture.value,
                        rate: editRateOfMovie.value,
                        description: editDescriptionOfMovie.value,
                    })
                })
                    .then(loadAllMovies)
                    .then(startWindow)
                    .catch(err => console.warn("nie działa, nie udało się edytować danych na serwerze ponieważ wystapił błąd: ", err))
            });

            addOrEditMovieDiv.appendChild(editTitleOfMovie);
            addOrEditMovieDiv.appendChild(editYearOfMovie);
            addOrEditMovieDiv.appendChild(editActorsOfMovie);
            addOrEditMovieDiv.appendChild(editGenreOfMovie);
            addOrEditMovieDiv.appendChild(editUrlOfPicture);
            addOrEditMovieDiv.appendChild(editRateOfMovie);
            addOrEditMovieDiv.appendChild(editDescriptionOfMovie);
            addOrEditMovieDiv.appendChild(EditMovieOnServerButton);
            changeAllDeleteButtonsVisibility("hidden");
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        })

        // zmiana obrazka jesli sie nie wyświetla

        var imgSource = `url(${element.imgSrc})`

        fetch(element.imgSrc)
            .then(res => {
                if (res.ok) {
                    imgSource = `url(${element.imgSrc})`
                    leftImgPart.style.backgroundImage = imgSource;
                }
                else {
                    imgSource = `url(https://bi.im-g.pl/im/15/b7/15/z22769941Q,Shrek.jpg)`
                    leftImgPart.style.backgroundImage = imgSource;
                }
            })
            .catch(err => {
                if (err.status === 404) {
                    console.warn("404 - elementu nie znaleziono");
                }
            });

        leftTitlePart.innerText = element.title;
        leftRatePart.innerHTML = "<span>&#9734;</span>" + element.rate

        wholeMovieDiv.appendChild(leftImgPart);
        wholeMovieDiv.appendChild(leftTitlePart);
        wholeMovieDiv.appendChild(leftRatePart);
        wholeMovieDiv.appendChild(leftDeleteButton);
        wholeMovieDiv.appendChild(leftEditButton);

        // funkcja wypisująca detale filmu w wyznacoznym divie:

        wholeMovieDiv.addEventListener('click', () => {
            imageConatiner.style.backgroundImage = imgSource;
            detailsTitleOfMovie.innerText = element.title;

            getData("/" + idOfElement)
                .then((details) => {
                    detailsOfMovie = details;
                    console.log(detailsOfMovie);
                })
                .then(() => {

                    detailsRestOfMovie.innerText = "\n\n Rok produkcji: " + detailsOfMovie.year
                        + "\n Opis filmu: \n" + detailsOfMovie.description + "\n Obsada: " + detailsOfMovie.cast + "\n Gatunek: " + detailsOfMovie.genres
                        + "\n Ocena: " + detailsOfMovie.rate + "/6"
                }).
                catch(err => console.warn("nie działa, nie udało się ponieważ wystapił błąd: ", err))
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        });

        leftMovieDivConatainer.appendChild(wholeMovieDiv);
    })
}
// Pobranie danych z serwera na temat wszystkich filmów

function loadAllMovies() {
    getData("").then((movieData) => {
        listOfMovies = sortArrey(movieData);
        listOfMoviesNotToChange = sortArrey(movieData);
        console.log(listOfMovies)   // to edzie można usunąć
    }).then(startWindow)
        .then(() => {
            getButtons = document.getElementsByClassName("delete-or-edit-button");
            changeAllDeleteButtonsVisibility("hidden");
        })
        .catch(err => console.warn("nie działa, nie udało się ponieważ wystapił błąd: ", err))
}

// generowanie listy szukanych filmów:

function generateSerchedMovies() {
    getData("?name=" + searchingInput.value)
        .then((movieData) => {
            listOfMovies = sortArrey(movieData);
            console.log(listOfMovies);   // to bedzie można usunąć
            generateMovies();
        })
        .catch(err => console.warn("nie działa, nie udało się ponieważ wystapił błąd: ", err))
}

// dodawanie elementu na serwer

function navAddMovieToAPIOnEvent() {
    navAddButton.addEventListener("click", () => {
        addOrEditMovieDiv.innerText = ""

        var addTitleOfMovie = document.createElement("input");
        addTitleOfMovie.setAttribute("placeholder", "Wpisz nazwę filmu");

        var addYearOfMovie = document.createElement("input");
        addYearOfMovie.setAttribute("placeholder", "Wpisz rok produkcji");

        var addActorsOfMovie = document.createElement("input");
        addActorsOfMovie.setAttribute("placeholder", "Wpisz aktorów");

        var addGenreOfMovie = document.createElement("input");
        addGenreOfMovie.setAttribute("placeholder", "Wpisz gatunek");

        var addUrlOfPicture = document.createElement("input");
        addUrlOfPicture.setAttribute("placeholder", "Link do zdjęcia");

        var addRateOfMovie = document.createElement("input");
        addRateOfMovie.setAttribute("placeholder", "Oceń film (1-6)");

        var addDescriptionOfMovie = document.createElement("input");
        addDescriptionOfMovie.setAttribute("placeholder", "Dodaj opis");

        var addMovieToServerButton = document.createElement("button");
        addMovieToServerButton.innerText = "Dodaj film!";
        addMovieToServerButton.setAttribute("class", "btn");

        addMovieToServerButton.addEventListener("click", function addMovieByEventClick() {

            fetch(MOVIE_API_URL, {
                method: "POST",
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    title: addTitleOfMovie.value,
                    year: addYearOfMovie.value,
                    cast: addActorsOfMovie.value,
                    genres: addGenreOfMovie.value,
                    imgSrc: addUrlOfPicture.value,
                    rate: addRateOfMovie.value,
                    description: addDescriptionOfMovie.value,
                })
            })
                .then((resp) => {
                    if (resp.ok) {
                        return resp.json();
                    } else {
                        Promise.reject("http code: ", resp.status);
                    }
                })
                .then(loadAllMovies)
                .then(data => {
                    console.log("dane od serwera", data);
                    startWindow()
                })
                .catch(err => console.warn("nie działa, nie udało się wysłac na serwer ponieważ wystapił błąd: ", err))
        }
        )

        addOrEditMovieDiv.appendChild(addTitleOfMovie);
        addOrEditMovieDiv.appendChild(addYearOfMovie);
        addOrEditMovieDiv.appendChild(addActorsOfMovie);
        addOrEditMovieDiv.appendChild(addGenreOfMovie);
        addOrEditMovieDiv.appendChild(addUrlOfPicture);
        addOrEditMovieDiv.appendChild(addRateOfMovie);
        addOrEditMovieDiv.appendChild(addDescriptionOfMovie);
        addOrEditMovieDiv.appendChild(addMovieToServerButton);
        changeAllDeleteButtonsVisibility("hidden");
        document.body.scrollTop = document.documentElement.scrollTop = 0
    })
}

// Funkcja umożliwiajaca usunięcie filmu:

function navDeleteMovieOnEvent() {
    navDeleteButton.addEventListener("click", () => {
        addOrEditMovieDiv.innerText = ""
        console.log(getButtons);
        changeAllDeleteButtonsVisibility("visible");
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    })
}

// funkcja zmieniająca widocznosc przycisków usuwania i edycji

function changeAllDeleteButtonsVisibility(typeOfVisibility) {
    for (var i = 0; i < getButtons.length; i++) {
        getButtons[i].style.visibility = typeOfVisibility;
    }
}

//funkcja do pobierania danych z serwera

function getData(path) {
    return fetch(`${MOVIE_API_URL}${path}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response.status);
        })
        .catch(err => {
            console.warn("wyświetlił się błąd: " + err);
            navigationBar.innerText = "Upsi! jest problem z serwerem, odśwież stronę, ponieważ wystapił błąd: " + err;
        });
};

// Funkcja do sortowania tablicy po rate

function sortArrey(arrey) {

    function compare(a, b) {
        if (a.rate > b.rate) return -1;
        if (b.rate > a.rate) return 1;
        return 0;
    }
    return arrey.sort(compare);
}

