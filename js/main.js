
import { attendance } from "./Attendance.js";
import { logout, setupAuthUI } from "./auth.js";
import { add_employee, edit_employee, fetch_employee } from "./employee.js";
import { section } from "./section.js";
import { sidebar } from "./sidebar.js";

setupAuthUI();
sidebar();
fetch_employee();
add_employee();
edit_employee();
section();
logout();
attendance();
document.addEventListener("DOMContentLoaded", () => {
  
});



