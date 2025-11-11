document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("language-form");
  var messageBox = document.getElementById("message-box");
  var submitBtn = form.querySelector("button[type='submit']");
  var originalBtnText = submitBtn.textContent;

  var titleEl = document.getElementById("language-form__title");
  var inputName = document.getElementById("name");
  var inputOrigin = document.getElementById("origin-history");
  var inputWords = document.getElementById("words");
  var inputSpeakers = document.getElementById("speakers");
  var familySelect = document.getElementById("family-id");
  var deleteBtn = document.getElementById("btn-delete");

  var cancelBtn = form.querySelector('button[type="reset"]');

  var pathParts = window.location.pathname.split("/");
  var lastPart = pathParts[pathParts.length - 1];

  var isEditMode = !isNaN(lastPart);
  var isAddMode = lastPart === "add";
  var langId = isEditMode ? lastPart : null;

  if (!isEditMode && !isAddMode) {
    window.location.href = "/langs";
  }

  if (isEditMode) {
    deleteBtn.style.display = "inline-block";
    titleEl.textContent = "Edit Language";
    loadLanguage(langId);
  } else {
    deleteBtn.style.display = "none";
    titleEl.textContent = "Add a Language";
    loadLanguageFamilies();
  }

  cancelBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/langs";
  });

  deleteBtn.addEventListener("click", function () {
    if (!confirm("Are you sure you want to delete this language?")) return;

    fetch("/languages/" + langId, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete language");
        return res.json();
      })
      .then((result) => {
        showMessage(
          [result.message || "Language deleted successfully!"],
          "success"
        );

        window.location.href = "/langs";
      })
      .catch((err) => {
        console.log(err);
        showMessage(
          [err.message || "Network error. Please try again later."],
          "error"
        );
      });
  });

  function loadLanguageFamilies(selectedId) {
    fetch("/families")
      .then((res) => res.json())
      .then((result) => {
        if (!result.data) return;
        familySelect.innerHTML = "";
        result.data.forEach((fam) => {
          var option = document.createElement("option");
          option.value = fam.id;
          option.textContent = fam.name;
          if (selectedId && selectedId == fam.id) option.selected = true;
          familySelect.appendChild(option);
        });
      })
      .catch((err) => console.error("Error loading families:", err));
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    messageBox.style.display = "none";
    messageBox.innerHTML = "";
    messageBox.className = "";

    var name = inputName.value.trim();
    var origin_history = inputOrigin.value.trim();
    var words = inputWords.value
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);
    var num_speakers = Number(inputSpeakers.value);
    var language_family_id = familySelect.value;

    var errors = [];
    if (!name || name.length < 2)
      errors.push("Language name must be at least 2 characters.");
    if (!origin_history || origin_history.length < 20)
      errors.push("Origin and history must be at least 20 characters.");
    if (words.length < 3)
      errors.push(
        "Please provide at least 3 common words separated by commas."
      );
    if (isNaN(num_speakers) || num_speakers <= 0)
      errors.push("Number of speakers must be a positive number.");
    if (!language_family_id) errors.push("Please select a language family.");

    if (errors.length) {
      showMessage(errors, "error");
      return;
    }

    var payload = {
      name,
      description: origin_history,
      num_speakers,
      words,
      language_family_id,
    };

    submitBtn.textContent = "Loading...";
    submitBtn.disabled = true;

    fetch(isEditMode ? "/languages/" + langId : "/languages", {
      method: isEditMode ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) =>
        res.json().then((result) => {
          if (res.ok) {
            showMessage(
              [
                "Language " +
                  (isEditMode ? "updated" : "created") +
                  " successfully!",
              ],
              "success"
            );

            window.location.href = "/langs";
          } else {
            showMessage([result.message || "Failed to save language"], "error");
          }
        })
      )
      .catch(() =>
        showMessage(["Network error. Please try again later."], "error")
      )
      .finally(() => {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      });
  });

  function showMessage(messages, type) {
    messageBox.innerHTML = messages.map((msg) => "<p>" + msg + "</p>").join("");
    messageBox.style.display = "block";
    messageBox.className =
      type === "error" ? "error-message" : "success-message";
  }

  function loadLanguage(id) {
    fetch("/languages/" + id)
      .then((res) => res.json())
      .then((result) => {
        if (!result.data) {
          window.location.href = "/langs";
          return;
        }
        var lang = result.data;
        inputName.value = lang.name || "";
        inputOrigin.value = lang.description || "";
        inputWords.value = lang.words ? lang.words.join(", ") : "";
        inputSpeakers.value = lang.num_speakers || "";
        loadLanguageFamilies(lang.language_family_id);
      })
      .catch(() => (window.location.href = "/langs"));
  }
});
