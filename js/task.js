const taskIDInput = document.getElementById('taskID');

export function add_task() {
  const addTaskModal = document.getElementById("add-task-modal");
  const addTaskBtn = document.getElementById("add-task-toggler");
  const closeModal = document.getElementById("close-modal-task");
  const taskDateInput = document.getElementById("task_date");
  const staffDropdown = document.getElementById("staff_task");


  
  // Set default date to today
  const today = new Date().toISOString().split("T")[0];
  taskDateInput.value = today;
  staffDropdown.innerHTML = '<option value="staff_task">Select Staff</option>';
  console.log("Dropdown after reset:", staffDropdown);

  fetch("../backend/fetch_employees.php")
      .then((response) => response.json())
      .then((data) => {
          if (data.success) {
              // Populate staff dropdown
              data.employees.forEach((employee) => {
                  const option = document.createElement("option");
                  option.value = employee.staff_ID;
                  option.textContent = `${employee.staff_Name}`;
                  staffDropdown.appendChild(option);
              });
              console.log("Dropdown after adding options:", staffDropdown);

          } else {
              alert("Failed to fetch employees: " + data.message);
          }
      })
      .catch((error) => {
          console.error("Error fetching employees:", error);
      });
  // Open modal and fetch staff data
  addTaskBtn.addEventListener("click", () => {
      addTaskModal.classList.remove("hidden");
      closeModal.addEventListener("click", () => {
        addTaskModal.classList.add("hidden");
    });
      // Clear existing staff dropdown options
      
  });


  // Form submission
  document.getElementById("add-task-form").addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(this);
      const jsonData = Object.fromEntries(formData);
      console.log('JSON Sent:', jsonData);
      fetch("../backend/add_task.php", {
          method: "POST",
          body: formData,
      })
          .then((response) => response.json())
          .then((data) => {
              if (data.success) {
                  alert("Task added successfully!");
                  addTaskModal.classList.add("hidden"); // Close modal on success
                  fetch_task();
              } else {
                  alert("Error adding task: " + data.message);
              }
          })
          .catch((error) => {
              console.error("Error:", error);
              alert("An unexpected error occurred.");
          });
  });
}

export function fetch_task() {
  const taskList = document.getElementById("task-list");

  // Clear existing task rows
  taskList.innerHTML = "";

  fetch("../backend/fetch_task.php")
      .then((response) => response.json())
      .then((data) => {
          if (data.success) {
              // Populate the table with tasks
              data.tasks.forEach((task) => {
                  const row = document.createElement("tr");

                  // Create table cells
                  const taskIdCell = document.createElement("td");
                  taskIdCell.textContent = task.task_id;

                  const taskNameCell = document.createElement("td");
                  taskNameCell.textContent = task.task_name;

                  const staffNameCell = document.createElement("td");
                  staffNameCell.textContent = task.staff_name;

                  const locationCell = document.createElement("td");
                  locationCell.textContent = task.task_location;
                                    
                  const statusCell = document.createElement("td");
                  statusCell.innerHTML = `
                  <select class = "status-dropdown" id= "status-dropdown" data-task-id="${task.task_id}">
                    <option value="pending" id="pending">Pending</option>
                    <option value="in progress id="in-progress">In progress</option>
                    <option value="completed" id="completed">Completed</option>
                  </select>
                  `;
                  const dropdown = statusCell.querySelector('.status-dropdown');
                  dropdown.value = task.status || 'pending';

                  const descriptionCell = document.createElement("td");
                  descriptionCell.textContent = task.description;

                  // Append cells to the row
                  row.appendChild(taskIdCell);
                  row.appendChild(taskNameCell);
                  row.appendChild(staffNameCell);
                  row.appendChild(locationCell);
                  row.appendChild(statusCell);
                  row.appendChild(descriptionCell);

                  // Append row to the table body
                  taskList.appendChild(row);
                  if (taskIDInput) {
                    taskIDInput.value = data.next_task_ID;
                  }
              });
              update_task(data);
          } else {
              // Display a message if no tasks are found
              const row = document.createElement("tr");
              const noDataCell = document.createElement("td");
              noDataCell.colSpan = 6; // Span across all table columns
              noDataCell.textContent = "No tasks found.";
              noDataCell.style.textAlign = "center";
              row.appendChild(noDataCell);
              taskList.appendChild(row);
              if (taskIDInput) {
                taskIDInput.value = data.next_task_ID;
              }
          }
      })
      .catch((error) => {
          console.error("Error fetching tasks:", error);
      });
}

export function update_task(tasks) {
  console.log("Tasks received for update:", tasks)
  const updateButton = document.querySelector('.save-task-toggler');

  updateButton.addEventListener('click', () => {
    console.log('Update pressed');
    const dropdowns = document.querySelectorAll('.status-dropdown');
    const statusData = [];

    dropdowns.forEach((dropdown) => {
      const taskId = dropdown.dataset.taskId;
      const selectedStatus = dropdown.value;
      if (taskId && selectedStatus) {
        statusData.push({
          task_id: taskId,
          status: selectedStatus,
          date: new Date().toISOString().split("T")[0],
        });
      }
    });

    // Send updated data to backend
    fetch('../backend/update_task.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: statusData }),
    })
      .then((response) => {
        console.log('Backend response status:', response.status);
        return response.json();
      })
      .then((result) => {
        console.log('Backend result:', result);
        if (result.success) {
          alert('Status updated successfully!');
        } else {
          alert('Error updating status: ' + result.message);
        }
      })
      .catch((error) => console.error('Error sending data to backend:', error));
  });
}
