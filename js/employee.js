
function saveCurrentSection() {
  const activeSection = document.querySelector(".section.active");
  if (activeSection) {
    const activeSectionId = activeSection.id;
    localStorage.setItem("activeSection", activeSectionId);
  } else {
    console.warn("No active section found.");
  }
}
export function fetch_employee(){
  
    fetch('../backend/fetch_employees.php')
    .then(response => response.json())
    .then(data => {
      const employees = data.employees;
      const employeeList = document.getElementById('employee-list');
      const staffIDInput = document.getElementById('staffID');
      employeeList.innerHTML = '';

      employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${employee.staff_ID}</td>
          <td>${employee.staff_Name}</td>
          <td>${employee.email}</td>
          <td>${employee.status}</td>
          <td>${employee.department}</td>
          <td class="action-cell">
          </td>
        `;
        const actionCell = row.querySelector('td:last-child');

        //Edit button
        const editButton = document.createElement('button');
        editButton.classList.add('action-btn', 'edit-btn');
        editButton.title = 'Edit';
        editButton.innerHTML = '<span class="material-symbols-rounded">edit</span>';
        editButton.addEventListener('click', () => {
          console.log(`Edit clicked for Staff ID: ${employee.staff_ID}`);
          
          const editModal = document.getElementById('editEmployeeModal');
          editModal.classList.remove('hidden');

          // Pre-fill form with the selected employee's data
          document.getElementById('editStaffID').value = employee.staff_ID;
          document.getElementById('editStaffName').value = employee.staff_Name;
          document.getElementById('editEmail').value = employee.email;
          // Set the selected value of the department dropdown
          const departmentDropdown = document.getElementById('editDepartment');
          departmentDropdown.value = employee.department;
          console.log("Employee department:",employee.staff_ID);
          // Debugging: Log to check if the correct value is being set
          console.log(`Setting department dropdown to: ${employee.department}`);
        });
          
        // Create the Inactivate button
        const inactivateButton = document.createElement('button');
        inactivateButton.classList.add('action-btn', 'inactivate-btn');
        inactivateButton.title = 'Inactivate';
        inactivateButton.innerHTML = '<span class="material-symbols-rounded">block</span>';
        inactivateButton.addEventListener('click', () => {
          console.log(`Inactivate clicked for Staff ID: ${employee.staff_ID}`);
          if (!confirm("Are you sure you want to inactivate this employee?")) return;



          // API call to update the status
          fetch('../backend/update_employee_status.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ staff_ID: employee.staff_ID, status: 'inactive' }),
          })
          .then(response => response.json())
          .then(result => {
            if (result.success) {
              alert('Employee has been inactivated.');
              // Optionally refresh the UI
              console.log(result.message);
            } else {
              alert('Failed to update status: ' + result.message);
            }
          })
          .catch(error => console.error('Error:', error));
        });
        // Append buttons to the Action cell
        actionCell.appendChild(editButton);
        actionCell.appendChild(inactivateButton);
        employeeList.appendChild(row);
      });

      if (staffIDInput) {
      staffIDInput.value = data.next_staff_ID;
      }
      
    })
    .catch(error => console.error('Error fetching employee data:', error));

}

export function add_employee(){
  
    const addToggler = document.querySelector(".add-toggler");
  const modal = document.getElementById("addEmployeeModal");
  const closeButton = document.querySelector(".close-button");
  const employeeForm = document.querySelector("#employeeForm");
  const employeeList = document.getElementById("employee-list");

  // Open modal
  addToggler.addEventListener("click", () => {
    modal.classList.remove("hidden");


  fetch("../backend/fetch_employees.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          staffIDField.value = data.next_staff_ID; // Set staff_ID value
        } else {
          alert("Error fetching staff ID: " + data.message);
        }
      })
      .catch((error) => console.error("Error:", error));

    });
  

  // Close modal
  closeButton.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Close modal when clicking outside the content
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // Handle form submission
  employeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
    const formData = new FormData(employeeForm);
    const employeeData = {
      staff_ID: formData.get("staffID"),
      staff_Name: formData.get("staffName"),
      email: formData.get("email"),
      department: formData.get("department"), // Make sure the key matches PHP expectation
    };
    
    console.log(employeeData); // Debug: Check in the browser console
    
    fetch("../backend/add_employee.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Ensure correct header
      },
      body: JSON.stringify(employeeData), // Convert data to JSON string
    })
      .then((response) => response.json())
      .then((newEmployee) => {
        if (newEmployee.success) {
          alert("Employee added successfully.");
          
          
        } else {
          alert("Error: " + newEmployee.message);
        }

      })
      .catch((error) => console.error("Fetch error:", error));
      
  });

}

export function edit_employee(){
 
   
    //edit employee
  const editModal = document.getElementById("editEmployeeModal");
  const editCloseButton = editModal.querySelector(".close-button");
  const editEmployeeForm = document.querySelector("#editEmployeeForm");

  // Open Edit Modal
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const row = e.target.closest("tr");
      const staffID = row.querySelector("td:nth-child(1)").textContent;
      const staffName = row.querySelector("td:nth-child(2)").textContent;
      const email = row.querySelector("td:nth-child(3)").textContent;
      const department = row.querySelector("td:nth-child(4)").textContent;
  
      // Pre-fill form fields
      document.getElementById("editStaffID").value = staffID;
      document.getElementById("editStaffName").value = staffName;
      document.getElementById("editEmail").value = email;
      document.getElementById("editDepartment").value = department;
  
      editModal.classList.remove("hidden");
    }
  });
  
  // Close Edit Modal
  editCloseButton.addEventListener("click", () => {
    editModal.classList.add("hidden");
  });
  
  window.addEventListener("click", (event) => {
    if (event.target === editModal) {
      editModal.classList.add("hidden");
    }
  });
  
  // Handle Edit Form Submission
  editEmployeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
    const formData = new FormData(editEmployeeForm);
    const updatedData = {
      staff_ID: formData.get("staffID"),
      staff_Name: formData.get("staffName"),
      email: formData.get("email"),
      department: formData.get("department"),
    };
  
    fetch("../backend/update_employee.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("Employee updated successfully.");
          editModal.classList.add("hidden");
          saveCurrentSection();
          //location.reload();
          
          
          
        } else {
          alert("Error: " + result.message);
        }
        document.addEventListener("DOMContentLoaded", () => {
          restoreSectionState();
        });
      })
      .catch((error) => console.error("Error:", error));

  });
  


}