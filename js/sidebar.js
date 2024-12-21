export function sidebar() {
  const sidebar = document.querySelector(".sidebar");
  const sidebarToggler = document.querySelector(".sidebar-toggler");
  const menuToggler = document.querySelector(".menu-toggler");
  const collapsedSidebarHeight = "56px";
  const fullSidebarHeight = "calc(100vh - 32px)";
  const sections = document.querySelectorAll('.content-section');

  if (sidebar && sidebarToggler && menuToggler) {
    sidebarToggler.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      const contentSections = document.querySelectorAll(".content-section");
      contentSections.forEach(section => {
        if (sidebar.classList.contains("collapsed")) {
          section.style.left = "100px";
          section.style.width = "calc(100% - 100px)";
          section.style.top = "0px";
        } else {
          section.style.left = "275px";
          section.style.width = "calc(100% - 275px)";
          section.style.top = "0px";
        }
      });
    });

    const toggleMenu = (isMenuActive) => {
      sidebar.style.height = isMenuActive ? `${sidebar.scrollHeight}px` : collapsedSidebarHeight;
      menuToggler.querySelector("span").innerText = isMenuActive ? "close" : "menu";
    };

    menuToggler.addEventListener("click", () => {
      toggleMenu(sidebar.classList.toggle("menu-active"));
    });

    window.addEventListener("resize", () => {
      const contentSections = document.querySelectorAll(".content-section");
      if (window.innerWidth >= 700) {
        sidebar.style.height = fullSidebarHeight;
        contentSections.forEach(section => {
          section.style.left = "275px";
          section.style.width = "calc(100% - 275px)";
          section.style.top = "0px";
        });
      } else {
        sidebar.classList.remove("collapsed");
        sidebar.style.height = "auto";
        toggleMenu(sidebar.classList.contains("menu-active"));
        contentSections.forEach(section => {
          section.style.left = "20px";
          section.style.width = "calc(100% - 20px)";
          section.style.top = "55px";
        });
      }
    });
  }
}
