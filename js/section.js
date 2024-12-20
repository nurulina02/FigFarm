function saveCurrentSection() {
  const activeSection = document.querySelector(".content-section.active");
  if (activeSection) {
    const activeSectionId = activeSection.id;
    localStorage.setItem("activeSection", activeSectionId);
  } else {
    console.warn("No active section found. Ensure an active section exists.");
  }
}

function restoreSectionState() {
  const activeSectionId = localStorage.getItem("activeSection");
  if (activeSectionId) {
    const allSections = document.querySelectorAll(".content-section");
    allSections.forEach(section => section.classList.remove("active"));

    const targetSection = document.getElementById(activeSectionId);
    if (targetSection) {
      targetSection.classList.add("active");
    } else {
      console.warn(`Section with ID "${activeSectionId}" not found.`);
    }
  }
}

