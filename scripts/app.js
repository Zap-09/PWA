
let deferredPrompt; // This will hold the beforeinstallprompt event

// Listen for the beforeinstallprompt event
window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent the default installation prompt
  e.preventDefault();
  // Save the event for later use
  deferredPrompt = e;

  // Show the custom "Install" button
  const installBtn = document.getElementById("installBtn");
  installBtn.style.display = "block";

  // Add click listener to show the install prompt when the button is clicked
  installBtn.addEventListener("click", () => {
    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      // Reset the deferredPrompt variable
      deferredPrompt = null;
    });
  });
});

// Optionally, you can handle the event if the user already has the app installed
window.addEventListener("appinstalled", (event) => {
  console.log("PWA was installed");
  // Hide the install button after installation
  document.getElementById("installBtn").style.display = "none";
});

/// Adds style to footer
const currentPage = window.location.pathname.split("/").pop(); // get current filename
console.log(currentPage)
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});
