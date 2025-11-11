var languageContent = document.getElementById("language-content");
var loadingEl = document.getElementById("loading");
var errorEl = document.getElementById("error");

function getLanguageIdFromURL() {
  const path = window.location.pathname.split("/");
  return path[path.length - 1];
}

function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}

function renderLanguage(data) {
  document.getElementById("lang-name").textContent = data.name;
  document.getElementById("lang-family").textContent = data.family_name;
  document.getElementById("lang-speakers").innerHTML = `<strong>${formatNumber(
    data.num_speakers
  )}</strong> speakers`;
  document.getElementById("lang-description").textContent = data.description;

  const wordsContainer = document.getElementById("lang-words");
  wordsContainer.innerHTML = "";

  data.words.forEach((word) => {
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = word;
    wordsContainer.appendChild(span);
  });
}

function showError(message) {
  languageContent.innerHTML = "";

  errorEl.textContent = message;
  errorEl.style.display = "block";
}

function loadLanguage() {
  const id = getLanguageIdFromURL();

  loadingEl.style.display = "block";
  errorEl.style.display = "none";
  languageContent.style.display = "flex";

  fetch(`/languages/${id}`)
    .then((res) => res.json())
    .then((result) => {
      loadingEl.style.display = "none";

      if (!result || !result.data) {
        return showError("Language not found.");
      }

      renderLanguage(result.data);
    })
    .catch((err) => {
      loadingEl.style.display = "none";
      showError("Failed to load language data.");
      console.error(err);
    });
}

loadLanguage();
