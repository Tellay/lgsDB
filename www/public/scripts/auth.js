document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".auth-form");
  const messageBoxEl = document.getElementById("message-box");
  const submitBtn = form.querySelector("button[type='submit']");
  const originalBtnText = submitBtn.textContent;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    messageBoxEl.style.display = "none";
    messageBoxEl.textContent = "";
    messageBoxEl.className = "";

    const isSignup = form.id === "signup-form";
    const url = isSignup ? "/signup" : "/login";

    const data = {};
    new FormData(form).forEach(function (value, key) {
      data[key] = value.trim();
    });

    const errors = [];
    if (isSignup) {
      if (
        !data.full_name ||
        !data.email ||
        !data.password ||
        !data.password_confirmation
      ) {
        errors.push("All fields are required.");
      }
      if (data.password !== data.password_confirmation) {
        errors.push("Passwords do not match.");
      }
    } else {
      if (!data.email || !data.password) {
        errors.push("Please enter your email and password.");
      }
    }

    if (errors.length > 0) {
      showMessage(errors.join(" "), "error");
      return;
    }

    submitBtn.textContent = "Loading...";
    submitBtn.disabled = true;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json().then(function (result) {
          if (response.ok) {
            showMessage(result.message || "Success!", "success");
            window.location.href = "/dashboard";
          } else {
            showMessage(result.message || "An error occurred.", "error");
          }
        });
      })
      .catch(() => {
        showMessage("Network error. Please try again later.", "error");
      })
      .finally(() => {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      });
  });

  function showMessage(msg, type) {
    messageBoxEl.textContent = msg;
    messageBoxEl.className =
      type === "error" ? "error-message" : "success-message";
    messageBoxEl.style.display = "block";
  }
});
