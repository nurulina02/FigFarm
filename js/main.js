
import { attendance, save_attendance } from "./Attendance.js";
import { logout, setupAuthUI } from "./auth.js";
import { add_employee, edit_employee, fetch_employee } from "./employee.js";
import { add_sales, fetch_products } from "./sales.js";
import { section } from "./section.js";
import { sidebar } from "./sidebar.js";


save_attendance();
setupAuthUI();
sidebar();
fetch_employee();
add_employee();
edit_employee();
section();
logout();
attendance();
fetch_products();
add_sales();
document.addEventListener("DOMContentLoaded", () => {
  

});



