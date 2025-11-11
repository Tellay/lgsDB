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

  const facts = [
    "English has over 170,000 words in active use",
    "It is the official language of 67 countries",
    "Shakespeare added around 1,700 words to English",
    "The longest word has 45 letters: pneumonoultramicroscopicsilicovolcanoconiosis",
    "English is the most studied second language worldwide",
  ];

  const factsContainer = document.getElementById("lang-facts");
  factsContainer.innerHTML = "";
  facts.forEach((fact) => {
    const li = document.createElement("li");
    li.textContent = fact;
    factsContainer.appendChild(li);
  });
}

function showError(message) {
  const errorEl = document.getElementById("error");
  errorEl.textContent = `Error: ${message}`;
  errorEl.style.display = "block";
}

function loadLanguage() {
  const id = getLanguageIdFromURL();

  fetch(`/languages/${id}`)
    .then((res) => res.json())
    .then((result) => {
      if (!result.data) throw new Error("Invalid response from server");
      renderLanguage(result.data);
    })
    .catch((err) => {
      showError(err.message);
    });
}

loadLanguage();
