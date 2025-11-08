document.addEventListener("DOMContentLoaded", function () {
  var userInitials = document.querySelector(".user-initials");
  if (!userInitials) return;

  fetch("/profile", { credentials: "include" })
    .then(function (response) {
      if (!response.ok) throw new Error("Failed to load profile");
      return response.json();
    })
    .then(function (result) {
      // Verifica se existe um nome válido
      const full_name = result.data.full_name;
      if (result && full_name) {
        var initials = getInitials(full_name);
        userInitials.textContent = initials;
      } else {
        userInitials.textContent = "?";
      }
    })
    .catch(function (err) {
      console.error("Error loading user initials:", err);
      userInitials.textContent = "?";
    });

  function getInitials(fullName) {
    var parts = fullName.trim().split(/\s+/); // split by space
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase(); // if single name returns the first 2 letters
    }
    var first = parts[0][0]; // first letter of first name
    var last = parts[parts.length - 1][0]; // first letter of last name
    return (first + last).toUpperCase();
  }
});
