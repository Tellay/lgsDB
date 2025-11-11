document.addEventListener("DOMContentLoaded", function () {
  const errorMessage = `<li class="error">Error loading data, please try again later.</li>`;

  // === Initialization ===
  loadDashboardSummary();
  loadTopPolyglots();
  loadTopAccessUsers();
  loadTopLanguageFamilies();
  loadTopSpokenLanguages();
  loadUserProfile();

  // === Fetch: Dashboard Summary ===
  function loadDashboardSummary() {
    fetch("/dashboard-summary")
      .then((response) =>
        response.json().then((result) => ({ response, result }))
      )
      .then(({ response, result }) => {
        if (!response.ok || !result.data)
          throw new Error("Invalid summary response");
        document.getElementById("stat-total-languages").textContent =
          result.data.total_languages;
        document.getElementById("stat-language-families").textContent =
          result.data.total_language_families;
        document.getElementById("stat-active-users").textContent =
          result.data.total_users;
      })
      .catch((err) => console.error("Failed to load dashboard summary:", err));
  }

  // === Fetch: Top Polyglots ===
  function loadTopPolyglots() {
    const list = document.getElementById("list-polyglots");
    fetch("/top-polyglots")
      .then((response) =>
        response.json().then((result) => ({ response, result }))
      )
      .then(({ response, result }) => {
        if (!response.ok || !result.data)
          throw new Error("Invalid polyglots response");
        list.innerHTML = "";
        result.data.forEach((user, index) => {
          list.innerHTML += `
            <li>
              <div class="profile"><span class="user-initials">${getInitials(
                user.full_name
              )}</span></div>
              <div class="card-stat-col">
                <div class="list-title">${index + 1}. ${user.full_name}</div>
                <div class="card-description">${
                  user.language_count
                } languages</div>
              </div>
            </li>`;
        });
      })
      .catch((err) => {
        list.innerHTML = errorMessage;
        console.error("Failed to load top polyglots:", err);
      });
  }

  // === Fetch: Top Users by Access ===
  function loadTopAccessUsers() {
    const list = document.getElementById("list-access");
    fetch("/top-users-access")
      .then((response) =>
        response.json().then((result) => ({ response, result }))
      )
      .then(({ response, result }) => {
        if (!response.ok || !result.data)
          throw new Error("Invalid access response");
        list.innerHTML = "";
        result.data.forEach((user, index) => {
          list.innerHTML += `
            <li>
              <div class="profile"><span class="user-initials">${getInitials(
                user.full_name
              )}</span></div>
              <div class="card-stat-col">
                <div class="list-title">${index + 1}. ${user.full_name}</div>
                <div class="card-description">${user.access_count} ${
            user.access_count == 1 ? "access" : "accesses"
          }</div>
              </div>
            </li>`;
        });
      })
      .catch((err) => {
        list.innerHTML = errorMessage;
        console.error("Failed to load top access users:", err);
      });
  }

  // === Fetch: Language Families ===
  function loadTopLanguageFamilies() {
    const list = document.getElementById("list-families");
    fetch("/top-language-families")
      .then((response) =>
        response.json().then((result) => ({ response, result }))
      )
      .then(({ response, result }) => {
        if (!response.ok || !result.data)
          throw new Error("Invalid families response");
        list.innerHTML = "";
        result.data.forEach((family, index) => {
          list.innerHTML += `
            <li class="family-item">
              <div class="card-stat-col">
                <div class="list-title">${index + 1}. ${family.name}</div>
                <div class="card-description">${family.language_count} ${
            family.language_count == 1 ? "language" : "languages"
          }</div>
              </div>
              <div class="badge">${family.percentage}%</div>
            </li>`;
        });
      })
      .catch((err) => {
        list.innerHTML = errorMessage;
        console.error("Failed to load language families:", err);
      });
  }

  // === Fetch: Spoken Languages ===
  function loadTopSpokenLanguages() {
    const list = document.getElementById("list-spoken");
    fetch("/top-languages")
      .then((response) =>
        response.json().then((result) => ({ response, result }))
      )
      .then(({ response, result }) => {
        if (!response.ok || !result.data)
          throw new Error("Invalid languages response");
        list.innerHTML = "";
        result.data.forEach((lang, index) => {
          list.innerHTML += `
            <li>
              <div class="spoken-item">
                <div class="card-stat-col">
                  <div class="list-title">${index + 1}. ${lang.name}</div>
                  <p class="card-description">${lang.user_count} ${
            lang.user_count == 1 ? "speaker" : "speakers"
          }</p>
                </div>
                <div class="progress-bar">
                  <div class="progress-bar__fill" style="width: ${
                    lang.percentage
                  }%"></div>
                </div>
              </div>
            </li>`;
        });
      })
      .catch((err) => {
        list.innerHTML = errorMessage;
        console.error("Failed to load spoken languages:", err);
      });
  }

  // === Fetch: User Profile ===
  function loadUserProfile() {
    const initialsEls = document.querySelectorAll(".user-initials");
    fetch("/profile", { credentials: "include" })
      .then((response) =>
        response.json().then((result) => ({ response, result }))
      )
      .then(({ response, result }) => {
        console.log(response, result);

        if (!response.ok || !result.data)
          throw new Error("Invalid profile response");
        const initials = getInitials(result.data.full_name);
        initialsEls.forEach((el) => (el.textContent = initials));
      })
      .catch((err) => {
        console.error("Failed to load user profile:", err);
        initialsEls.forEach((el) => (el.textContent = "?"));
      });
  }

  // === Helper: Get Initials ===
  function getInitials(fullName) {
    const parts = fullName.trim().split(/\s+/);
    return parts.length === 1
      ? parts[0].substring(0, 2).toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
});
