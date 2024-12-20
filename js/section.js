export function section() {
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section');

// Navigation link functionality
navLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    
    // Get target section ID
    const targetId = link.getAttribute('data-target');
    
    // Hide all sections
    sections.forEach(section => section.style.display = 'none');
    
    // Show the target section
    const targetSection = document.getElementById(targetId);
    if (targetSection) targetSection.style.display = 'block';
    
    // Save the active section to localStorage
    localStorage.setItem('activeSection', targetId);
  });
});

// Restore the active section from localStorage after page reload
document.addEventListener('DOMContentLoaded', () => {
  const activeSectionId = localStorage.getItem('activeSection');
  
  if (activeSectionId) {
    // Hide all sections first
    sections.forEach(section => section.style.display = 'none');
    
    // Show the saved active section
    const activeSection = document.getElementById(activeSectionId);
    if (activeSection) {
      activeSection.style.display = 'block';
    }
  } else {
    // If no active section is saved, show the default section (e.g., dashboard)
    const defaultSection = document.getElementById('dashboard-section');
    if (defaultSection) {
      defaultSection.style.display = 'block';
    }
  }
});
}