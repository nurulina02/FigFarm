
import { setupAuthUI } from "./auth.js";
import { add_employee, edit_employee, fetch_employee } from "./employee.js";
import { sidebar } from "./sidebar.js";


setupAuthUI();
sidebar();
fetch_employee();
add_employee();
edit_employee();
document.addEventListener("DOMContentLoaded", () => {
  function saveCurrentSection() {
    const activeSection = document.querySelector(".section.active");
    if (activeSection) {
      const activeSectionId = activeSection.id;
      localStorage.setItem("activeSection", activeSectionId);
    } else {
      console.warn("No active section found.");
    }
  }
  
  
    const activeSectionId = localStorage.getItem("activeSection");
    if (activeSectionId) {
      const section = document.querySelector(`#${activeSectionId}`);
      if (section) {
        // Remove 'active' from all sections and activate the target section
        document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
        section.classList.add("active");
  
        // Scroll to the section if needed
        section.scrollIntoView({ behavior: "smooth" });
  
        // Clear the saved section state
        localStorage.removeItem("activeSection");
      }
    }
  
});



