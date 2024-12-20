function saveCurrentSection() {
  const activeSection = document.querySelector(".section.active");
  if (activeSection) {
    const activeSectionId = activeSection.id;
    localStorage.setItem("activeSection", activeSectionId);
  } else {
    console.warn("No active section found.");
  }
}

export function fetch_employee() {
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
          <td class="action-cell"></td>
        `;
        const actionCell = row.querySelector('td:last-child');

        const editButton = document.createElement('button');
        editButton.classList.add('action-btn', 'edit-btn');
        editButton.title = 'Edit';
        editButton.innerHTML = '<span class="material-symbols-rounded">edit</span>';
        editButton.addEventListener('click', () => {
          const editModal = document.getElementById('editEmployeeModal');
          editModal.classList.remove('hidden');
          document.getElementById('editStaffID').value = employee.staff_ID;
          document.getElementById('editStaffName').value = employee.staff_Name;
          document.getElementById('editEmail').value = employee.email;
          document.getElementById('editDepartment').value = employee.department;
        });

        const inactivateButton = document.createElement('button');
        inactivateButton.classList.add('action-btn', 'inactivate-btn');
        inactivateButton.title = 'Inactivate';
        inactivateButton.innerHTML = '<span class="material-symbols-rounded">block</span>';
        inactivateButton.addEventListener('click', () => {
          if (!confirm("Are you sure you want to inactivate this employee?")) return;
          fetch('../backend/update_employee_status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ staff_ID: employee.staff_ID, status: 'inactive' }),
          })
          .then(response => response.json())
          .then(result => {
            if (result.success) {
              alert('Employee has been inactivated.');
            } else {
              alert('Failed to update status: ' + result.message);
            }
          })
          .catch(error => console.error('Error:', error));
        });

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

export function add_employee() {
  const addToggler = document.querySelector(".add-toggler");
  const modal = document.getElementById("addEmployeeModal");
  const closeButton = document.querySelector(".close-button");
  const employeeForm = document.querySelector("#employeeForm");

  addToggler.addEventListener("click", () => {
    modal.classList.remove("hidden");
    fetch("../backend/fetch_employees.php")
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          staffIDField.value = data.next_staff_ID;
        } else {
          alert("Error fetching staff ID: " + data.message);
        }
      })
      .catch(error => console.error("Error:", error));
  });

  closeButton.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  window.addEventListener("click", event => {
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });

  employeeForm.addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(employeeForm);
    const employeeData = {
      staff_ID: formData.get("staffID"),
      staff_Name: formData.get("staffName"),
      email: formData.get("email"),
      department: formData.get("department"),
    };

    fetch("../backend/add_employee.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employeeData),
    })
    .then(response => response.json())
    .then(newEmployee => {
      if (newEmployee.success) {
        alert("Employee added successfully.");
      } else {
        alert("Error: " + newEmployee.message);
      }
    })
    .catch(error => console.error("Fetch error:", error));
  });
}

export function edit_employee() {
  const editModal = document.getElementById("editEmployeeModal");
  const editCloseButton = editModal.querySelector(".close-button");
  const editEmployeeForm = document.querySelector("#editEmployeeForm");

  document.addEventListener("click", e => {
    if (e.target.classList.contains("edit-btn")) {
      const row = e.target.closest("tr");
      const staffID = row.querySelector("td:nth-child(1)").textContent;
      const staffName = row.querySelector("td:nth-child(2)").textContent;
      const email = row.querySelector("td:nth-child(3)").textContent;
      const department = row.querySelector("td:nth-child(4)").textContent;

      document.getElementById("editStaffID").value = staffID;
      document.getElementById("editStaffName").value = staffName;
      document.getElementById("editEmail").value = email;
      document.getElementById("editDepartment").value = department;

      editModal.classList.remove("hidden");
    }
  });

  editCloseButton.addEventListener("click", () => {
    editModal.classList.add("hidden");
  });

  window.addEventListener("click", event => {
    if (event.target === editModal) {
      editModal.classList.add("hidden");
    }
  });

  editEmployeeForm.addEventListener("submit", e => {
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        alert("Employee updated successfully.");
        editModal.classList.add("hidden");
        location.reload();
      } else {
        alert("Error: " + result.message);
      }
    })
    .catch(error => console.error("Error:", error));
  });
}
