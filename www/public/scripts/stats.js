document.addEventListener("DOMContentLoaded", function () {
  loadStats();

  function loadStats() {
    fetch("/dashboard-summary")
      .then((response) => {
        return response.json().then(function (result) {
          if (response.ok) {
            document.getElementById("total-languages").textContent =
              result.data.total_languages;
            document.getElementById("language-families").textContent =
              result.data.total_language_families;
            document.getElementById("active-users").textContent =
              result.data.total_users;
          } else {
            console.error("API returned an error:", result);
          }
        });
      })
      .catch((err) => {
        console.error("Failed to load stats:", err);
      });
  }
});
