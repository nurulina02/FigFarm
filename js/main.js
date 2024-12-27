
import { attendance, save_attendance } from "./Attendance.js";
import { logout, setupAuthUI } from "./auth.js";
import { add_employee, edit_employee, fetch_employee } from "./employee.js";
import { add_sales, update_list } from "./sales.js";
import { section } from "./section.js";
import { sidebar } from "./sidebar.js";
import { add_task, fetch_task } from "./task.js";


save_attendance();
setupAuthUI();
sidebar();
fetch_employee();
add_employee();
edit_employee();
section();
logout();
attendance();
update_list();
add_sales();
add_task();
fetch_task();
document.addEventListener("DOMContentLoaded", () => {
  

});



