document.addEventListener("DOMContentLoaded", function () {
  const userInitialsEls = document.querySelectorAll(".user-initials");
  const fullNameEl = document.getElementById("user-full_name");
  const emailEl = document.getElementById("user-email");
  const languagesEl = document.getElementById("user-languages");
  const joinedDateEl = document.getElementById("user-joined-date");

  const messageBoxEl = document.getElementById("message-box");
  const profileForm = document.getElementById("profile-form");
  const inputFullName = document.getElementById("fullName");
  const inputEmail = document.getElementById("email");
  const saveBtn = document.getElementById("btn-save");
  const originalSaveBtnText = saveBtn.textContent;
  const cancelBtn = document.getElementById("btn-cancel");

  const rankingTopPolyglots = document.getElementById(
    "ranking-top-polyglots-position"
  );
  const rankingTopAccesses = document.getElementById(
    "ranking-top-accesses-position"
  );

  setFormDisabled(true);

  fetch("/profile", { credentials: "include" })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load profile");
      return response.json();
    })
    .then((result) => {
      const data = result.data;
      if (!data) throw new Error("Profile data missing");

      const fullName = data.full_name;
      const email = data.email;
      const numLanguages = data.language_count;
      const createdAt = data.created_at;

      const initials = getInitials(fullName);
      userInitialsEls.forEach((el) => (el.textContent = initials));

      fullNameEl.textContent = fullName;
      emailEl.textContent = email;
      languagesEl.innerHTML = `<strong>${numLanguages}</strong> ${
        numLanguages === 1 ? "language" : "languages"
      }`;

      const formattedJoinDate = formatJoinDate(createdAt);
      joinedDateEl.innerHTML = `<strong>Joined in</strong> ${formattedJoinDate}`;

      inputFullName.value = fullName;
      inputEmail.value = email;
    })
    .catch((err) => {
      console.error("Error loading user profile:", err);
      console.log(err);

      userInitialsEls.forEach((el) => (el.textContent = "?"));
    })
    .finally(() => {
      setFormDisabled(false);
    });

  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();

    messageBoxEl.style.display = "none";
    messageBoxEl.textContent = "";
    messageBoxEl.className = "";

    const data = {};
    new FormData(profileForm).forEach((value, key) => {
      data[key] = value.trim();
    });

    const errors = [];
    if (data.full_name.length === 0) {
      errors.push("Full name is required.");
    }

    if (!validateEmail(data.email)) {
      errors.push("Please enter a valid email address.");
    }

    if (errors.length > 0) {
      showMessage(errors.join(" "), "error");
      return;
    }

    saveBtn.textContent = "Saving...";
    saveBtn.disabled = true;
    setFormDisabled(true);

    fetch("/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json().then(function (result) {
          if (response.ok) {
            const { full_name, email } = data;

            fullNameEl.textContent = full_name;
            emailEl.textContent = email;

            inputFullName.value = full_name;
            inputEmail.value = email;

            const initials = getInitials(full_name);
            userInitialsEls.forEach((el) => (el.textContent = initials));

            showMessage(result.message || "Success!", "success");
          } else {
            showMessage(result.message || "An error occurred.", "error");
          }
        });
      })
      .catch(() => {
        showMessage("Network error. Please try again later.", "error");
      })
      .finally(() => {
        saveBtn.textContent = originalSaveBtnText;
        setFormDisabled(false);
      });
  });

  fetch("/profile/ranking/top-polyglots", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok)
        throw new Error("Failed to user ranking in top polyglots");
      return response.json();
    })
    .then((result) => {
      const data = result.data;
      if (!data) throw new Error("Ranking data missing");

      const ranking = data.rank;
      rankingTopPolyglots.textContent = `#${ranking}`;
    })
    .catch((err) => {
      console.error("Error loading user ranking in top polyglots", err);
      console.log(err);

      rankingTopPolyglots.textContent = "#?";
    });

  fetch("/profile/ranking/top-accesses", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok)
        throw new Error("Failed to user ranking in top accesses");
      return response.json();
    })
    .then((result) => {
      const data = result.data;
      if (!data) throw new Error("Ranking data missing");

      const ranking = data.rank;
      rankingTopAccesses.textContent = `#${ranking}`;
    })
    .catch((err) => {
      console.error("Error loading user ranking in top accesses:", err);
      console.log(err);

      rankingTopAccesses.textContent = "#?";
    });

  function setFormDisabled(state) {
    inputFullName.disabled = state;
    inputEmail.disabled = state;
    saveBtn.disabled = state;
    cancelBtn.disabled = state;
  }

  function getInitials(fullName) {
    var parts = fullName.trim().split(/\s+/); // split by space
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase(); // if single name returns the first 2 letters
    }
    var first = parts[0][0]; // first letter of first name
    var last = parts[parts.length - 1][0]; // first letter of last name
    return (first + last).toUpperCase();
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
