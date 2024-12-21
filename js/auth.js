export function setupAuthUI() {
  
    const formContainer = document.querySelector(".form_container");
    const signupBtn = document.querySelector("#signup");
    const loginBtn = document.querySelector("#login");
    const pwShowHide = document.querySelectorAll(".pw_hide");
  
    if (formContainer && signupBtn && loginBtn && pwShowHide) {
      signupBtn.addEventListener("click", (e) => {
        e.preventDefault();
        formContainer.classList.add("active");
      });
      loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        formContainer.classList.remove("active");
      });
      pwShowHide.forEach((icon) => {
        icon.addEventListener("click", () => {
        let getPwInput = icon.parentElement.querySelector("input");
          if (getPwInput.type === "password") {
            getPwInput.type = "text";
            icon.classList.replace("uil-eye-slash", "uil-eye");
          } else {
            getPwInput.type = "password";
            icon.classList.replace("uil-eye", "uil-eye-slash");
          }
        });
      });
    }
}

export function logout() {
  // Select the logout button
const logoutButton = document.querySelector('#logout'); // Adjust selector if necessary

// Add click event listener to the logout button
logoutButton.addEventListener('click', (event) => {
  event.preventDefault(); // Prevent default link behavior
  if (confirm('Are you sure you want to logout?')) {
    fetch('../backend/logout.php', {
      method: 'POST', // Ensure logout.php handles POST requests
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Successfully logged out!');
        window.location.href = 'index.html'; // Redirect to the login page
      } else {
        alert('Failed to logout: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error during logout:', error);
      alert('An error occurred while logging out.');
    });
  }
});
}