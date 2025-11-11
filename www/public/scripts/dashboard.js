document.addEventListener("DOMContentLoaded", function () {
  // ======================================================================== //
  // Element references
  // ======================================================================== //
  const userInitialsEls = document.querySelectorAll(".user-initials");
  const fullNameEl = document.getElementById("user-full_name");
  const emailEl = document.getElementById("user-email");
  const joinedDateEl = document.getElementById("user-joined-date");
  const messageBoxEl = document.getElementById("message-box");

  const profileForm = document.getElementById("profile-form");
  const inputFullName = document.getElementById("fullName");
  const inputEmail = document.getElementById("email");
  const saveBtn = document.getElementById("btn-save");
  const cancelBtn = document.getElementById("btn-cancel");
  const originalSaveBtnText = saveBtn.textContent;

  // Account buttons
  const btnLogout = document.getElementById("btn-logout");
  const btnDelete = document.getElementById("btn-delete-account");

  // Languages section
  const languagesListEl = document.getElementById("languages-list");
  const addLanguageBtn = document.getElementById("btn-add-language");
  const languageModal = document.getElementById("language-modal");
  const closeModalEl = document.getElementById("btn-close-modal");
  const languageForm = document.getElementById("language-form");
  const languageNameSelect = document.getElementById("language-name");
  const fluencySelect = document.getElementById("language-fluency");
  const languageSubmitBtn = languageForm.querySelector("button[type='submit']");
  const originalAddBtnText = languageSubmitBtn.textContent;

  // Rankings
  const rankingTopAccesses = document.getElementById(
    "ranking-top-accesses-position"
  );
  const rankingTopPolyglots = document.getElementById(
    "ranking-top-polyglots-position"
  );

  setFormDisabled(true);
  addLanguageBtn.disabled = true;

  // ======================================================================== //
  // Profile loading
  // ======================================================================== //
  fetch("/profile", { credentials: "include" })
    .then(function (response) {
      if (!response.ok) throw new Error("Failed to load profile");
      return response.json();
    })
    .then(function (result) {
      const data = result.data;
      if (!data) throw new Error("Profile data missing");

      const fullName = data.full_name;
      const email = data.email;
      const numLanguages = data.language_count;
      const createdAt = data.created_at;

      const initials = getInitials(fullName);
      userInitialsEls.forEach(function (el) {
        el.textContent = initials;
      });

      fullNameEl.textContent = fullName;
      emailEl.textContent = email;

      updateLanguageCount(numLanguages);
      joinedDateEl.innerHTML =
        "<strong>Joined in</strong> " + formatJoinDate(createdAt);

      inputFullName.value = fullName;
      inputEmail.value = email;
    })
    .catch(function (err) {
      console.error("Error loading user profile:", err);
      userInitialsEls.forEach(function (el) {
        el.textContent = "?";
      });
    })
    .finally(function () {
      setFormDisabled(false);
    });

  // ======================================================================== //
  // Profile update
  // ======================================================================== //
  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();

    messageBoxEl.style.display = "none";
    messageBoxEl.textContent = "";
    messageBoxEl.className = "";

    const data = {};
    new FormData(profileForm).forEach(function (value, key) {
      data[key] = value.trim();
    });

    const errors = [];
    if (data.full_name.length === 0) errors.push("Full name is required.");
    if (!validateEmail(data.email))
      errors.push("Please enter a valid email address.");

    if (errors.length > 0) {
      showMessage(errors.join(" "), "error");
      return;
    }

    saveBtn.textContent = "Saving...";
    saveBtn.disabled = true;
    setFormDisabled(true);

    fetch("/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then(function (response) {
        return response.json().then(function (result) {
          if (response.ok) {
            const full_name = data.full_name;
            const email = data.email;

            fullNameEl.textContent = full_name;
            emailEl.textContent = email;
            inputFullName.value = full_name;
            inputEmail.value = email;

            const initials = getInitials(full_name);
            userInitialsEls.forEach(function (el) {
              el.textContent = initials;
            });

            showMessage(
              result.message || "Profile updated successfully!",
              "success"
            );
          } else {
            showMessage(result.message || "An error occurred.", "error");
          }
        });
      })
      .catch(function () {
        showMessage("Network error. Please try again later.", "error");
      })
      .finally(function () {
        saveBtn.textContent = originalSaveBtnText;
        setFormDisabled(false);
      });
  });

  // ======================================================================== //
  // Rankings
  // ======================================================================== //
  function loadRankings(force = false) {
    if (force) {
      rankingTopAccesses.textContent = "#?";
      rankingTopPolyglots.textContent = "#?";
    }

    fetch("/profile/ranking/top-polyglots", { credentials: "include" })
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load polyglot ranking");
        return res.json();
      })
      .then(function (result) {
        const data = result.data;
        if (!data) throw new Error("Ranking data missing");
        rankingTopPolyglots.textContent = "#" + data.rank;
      })
      .catch(function () {
        rankingTopPolyglots.textContent = "#?";
      });

    fetch("/profile/ranking/top-accesses", { credentials: "include" })
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load access ranking");
        return res.json();
      })
      .then(function (result) {
        const data = result.data;
        if (!data) throw new Error("Ranking data missing");
        rankingTopAccesses.textContent = "#" + data.rank;
      })
      .catch(function () {
        rankingTopAccesses.textContent = "#?";
      });
  }

  loadRankings();

  // ======================================================================== //
  // Languages
  // ======================================================================== //
  function loadUserLanguages() {
    fetch("/profile/languages", { credentials: "include" })
      .then(function (response) {
        if (!response.ok) throw new Error("Failed to load languages");
        return response.json();
      })
      .then(function (result) {
        const languages = result.data;
        renderLanguages(languages);
        updateLanguageCount(languages.length);
        addLanguageBtn.disabled = false; // 🔓 Reativa botão após sucesso
      })
      .catch(function (error) {
        console.error("Error loading languages:", error);
        languagesListEl.innerHTML = "<p>Error loading languages</p>";
        addLanguageBtn.disabled = true; // 🔒 Mantém desativado se falhar
      });
  }

  function renderLanguages(languages) {
    languagesListEl.innerHTML = "";

    if (!languages || languages.length === 0) {
      languagesListEl.innerHTML = `<p class="empty-languages-spoken__list">No languages added.</p>`;
      return;
    }

    languages.forEach(function (lang) {
      const item = document.createElement("div");
      item.classList.add("language-item");
      item.dataset.id = lang.id;

      item.innerHTML =
        '<div class="language-item__info">' +
        '<span class="language-item__name">' +
        lang.language_name +
        "</span>" +
        '<span class="badge language-item__fluency">' +
        lang.fluency_name +
        "</span>" +
        "</div>" +
        '<button class="btn btn-ghost btn-language-remove" data-id="' +
        lang.id +
        '">' +
        '<img src="/assets/icons/x.svg" alt="Remove ' +
        lang.language_name +
        '" />' +
        "</button>";

      languagesListEl.appendChild(item);
    });

    attachLanguageRemoveEvents();
  }

  function attachLanguageRemoveEvents() {
    const removeBtns = document.querySelectorAll(".btn-language-remove");
    removeBtns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        const id = e.currentTarget.dataset.id;
        const item = e.currentTarget.closest(".language-item");
        const langNameEl = item.querySelector(".language-item__name");
        const langName = langNameEl
          ? langNameEl.textContent.trim()
          : "this language";

        if (
          !confirm("Remove " + langName.toLowerCase() + " from your languages?")
        )
          return;

        fetch("/profile/languages/" + id, {
          method: "DELETE",
          credentials: "include",
        })
          .then(function (res) {
            if (!res.ok) throw new Error("Failed to delete language");
            item.remove();

            const remainingCount =
              languagesListEl.querySelectorAll(".language-item").length;
            updateLanguageCount(remainingCount);

            if (remainingCount === 0) {
              languagesListEl.innerHTML = `<p class="empty-languages-spoken__list">No languages added.</p>`;
            }

            loadRankings(true);
          })
          .catch(function (err) {
            console.error("Error deleting language:", err);
            alert("Unable to delete language. Please try again.");
          });
      });
    });
  }

  function updateLanguageCount(count) {
    const countEls = document.querySelectorAll(".languages-count");
    countEls.forEach(function (el) {
      el.innerHTML =
        "<strong>" +
        count +
        "</strong> " +
        (count === 1 ? "language" : "languages");
    });
  }

  loadUserLanguages();

  // ======================================================================== //
  // Add Language Modal
  // ======================================================================== //
  addLanguageBtn.addEventListener("click", function () {
    if (addLanguageBtn.disabled) return;
    languageModal.style.display = "flex";
    loadLanguageOptions();
    loadFluencyOptions();
  });

  closeModalEl.addEventListener("click", function () {
    languageModal.style.display = "none";
  });

  window.addEventListener("click", function (e) {
    if (e.target === languageModal) {
      languageModal.style.display = "none";
    }
  });

  languageForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const languageData = {};
    new FormData(languageForm).forEach(function (value, key) {
      languageData[key] = value.trim();
    });

    if (!languageData.language_id || !languageData.fluency_id) {
      alert("Please fill in all fields");
      return;
    }

    languageSubmitBtn.textContent = "Adding...";
    languageSubmitBtn.disabled = true;

    fetch("/profile/languages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(languageData),
    })
      .then(function (res) {
        return res.json().then(function (result) {
          if (res.ok) {
            languageModal.style.display = "none";
            loadUserLanguages();
            loadRankings(true);
          } else {
            alert(result.message || "Error adding language");
          }
        });
      })
      .catch(function (err) {
        console.error(err);
        alert("Network error. Please try again.");
      })
      .finally(function () {
        languageSubmitBtn.textContent = originalAddBtnText;
        languageSubmitBtn.disabled = false;
      });
  });

  function loadLanguageOptions() {
    fetch("/languages", { credentials: "include" })
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load languages list");
        return res.json();
      })
      .then(function (result) {
        const languages = result.data || [];
        languageNameSelect.innerHTML =
          '<option value="">Select language</option>' +
          languages
            .map((lang) => `<option value="${lang.id}">${lang.name}</option>`)
            .join("");
      })
      .catch(function (err) {
        console.error("Error loading languages:", err);
        languageNameSelect.innerHTML =
          '<option value="">Error loading languages</option>';
      });
  }

  function loadFluencyOptions() {
    fetch("/fluencies", { credentials: "include" })
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load fluencies");
        return res.json();
      })
      .then(function (result) {
        const fluencies = result.data || [];
        fluencySelect.innerHTML =
          '<option value="">Select fluency</option>' +
          fluencies
            .map((f) => `<option value="${f.id}">${f.name}</option>`)
            .join("");
      })
      .catch(function (err) {
        console.error("Error loading fluencies:", err);
        fluencySelect.innerHTML =
          '<option value="">Error loading fluencies</option>';
      });
  }

  // ======================================================================== //
  // Logout and delete account (loading only on clicked button)
  // ======================================================================== //
  function handleRedirect() {
    window.location.href = "/login";
  }

  btnLogout.addEventListener("click", function () {
    if (btnLogout.disabled) return;

    btnLogout.disabled = true;
    btnLogout.textContent = "Logging out...";

    fetch("/logout", { method: "POST", credentials: "include" })
      .then(function (res) {
        window.location.href = "/login";
      })
      .catch(function () {
        alert("Network error. Please try again.");
        btnLogout.disabled = false;
        btnLogout.textContent = "Logout";
      });
  });

  btnDelete.addEventListener("click", function () {
    if (btnDelete.disabled) return;

    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    btnDelete.disabled = true;
    btnDelete.textContent = "Deleting...";

    fetch("/profile", { method: "DELETE", credentials: "include" })
      .then(function (res) {
        window.location.href = "/login";
      })
      .catch(function () {
        alert("Network error. Please try again.");
        btnDelete.disabled = false;
        btnDelete.textContent = "Delete Account";
      });
  });

  // ======================================================================== //
  // Helpers
  // ======================================================================== //
  function setFormDisabled(state) {
    inputFullName.disabled = state;
    inputEmail.disabled = state;
    saveBtn.disabled = state;
    cancelBtn.disabled = state;
  }

  function getInitials(fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function formatJoinDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  function showMessage(msg, type) {
    messageBoxEl.textContent = msg;
    messageBoxEl.className =
      type === "error" ? "error-message" : "success-message";
    messageBoxEl.style.display = "block";
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
});
