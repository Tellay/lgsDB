var languagesContainer = document.querySelector(".languages");
var searchInput = document.getElementById("language_name");
var languagesFound = document.getElementById("languages-found");

var isAuthenticated = false;
var allLanguages = [];

searchInput.disabled = true;

function checkAuthStatus() {
  return fetch("/session")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      isAuthenticated = data.authenticated;
    })
    .catch(function (err) {
      console.error("Error checking auth:", err);
    });
}

function loadLanguages() {
  return fetch("/languages")
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      const languages = result.data;
      allLanguages = languages;
      renderLanguages(languages);
      searchInput.disabled = false;
    })
    .catch(function (err) {
      languagesFound.textContent = "0 languages found";
      console.error("Error loading languages:", err);
    });
}

function renderLanguages(languages) {
  languagesContainer.innerHTML = "";

  if (languages.length === 0) {
    languagesFound.textContent = "0 languages found";
    return;
  }

  if (languages.length === 1) {
    languagesFound.textContent = "1 language found";
  } else {
    languagesFound.textContent = languages.length + " languages found";
  }

  languages.forEach(function (lang) {
    var card = document.createElement("div");
    card.classList.add("card", "language-card");

    var html =
      '<div class="language-card__header">' +
      "<h2 class='card-title'>" +
      lang.name +
      "</h2>" +
      "<p class='card-description'>" +
      lang.family_name +
      "</p>" +
      "</div>" +
      '<div class="language-card__footer">' +
      '<a href="/langs/' +
      lang.id +
      '" class="btn btn-primary view-details">See Details</a>' +
      (isAuthenticated
        ? '<a href="/langs/edit/' +
          lang.id +
          '" class="btn btn-secondary edit-lang">Edit</a>'
        : "") +
      "</div>";

    card.innerHTML = html;
    languagesContainer.appendChild(card);
  });
}

function filterLanguages(query) {
  query = query.toLowerCase();

  var filtered = allLanguages.filter(function (lang) {
    var nameMatch = lang.name.toLowerCase().includes(query);
    var familyMatch = lang.family_name.toLowerCase().includes(query);
    return nameMatch || familyMatch;
  });

  renderLanguages(filtered);
}

searchInput.addEventListener("input", function (e) {
  var query = e.target.value.trim();
  filterLanguages(query);
});

checkAuthStatus()
  .then(function () {
    return loadLanguages();
  })
  .catch(function (err) {
    console.error("Something went wrong:", err);
  });
