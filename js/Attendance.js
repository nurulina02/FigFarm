let employees = []; // Declare employees globally to share between functions

export function attendance() {
  fetch('../backend/fetch_employees.php')
    .then((response) => response.json())
    .then((data) => {
      employees = data.employees; // Assign to global variable
      const employeeList = document.getElementById('attendance-list');
      employeeList.innerHTML = '';

      employees.forEach((employee) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${employee.staff_ID}</td>
          <td>${employee.staff_Name}</td>
          <td>
            <select class="attendance-dropdown">
              <option value="ND">ND - Normal Working Day, present</option>
              <option value="PN">PN - Public Holiday, Not Working</option>
              <option value="PW">PW - Public Holiday, Working</option>
              <option value="ON">ON - Off Day, Not Working</option>
              <option value="OW">OW - Off Day, Working</option>
              <option value="MC">MC - Medical Leave</option>
              <option value="AL">AL - Annual Leave</option>
              <option value="UL">UL - Unpaid Approved Leave</option>
              <option value="MA">MA - Mark As Absent</option>
            </select>
          </td>
        `;

        const dropdown = row.querySelector('.attendance-dropdown');
        dropdown.value = employee.attendance_Status || 'ND'; // Default to ND if null

        employeeList.appendChild(row);
      });
    })
    .catch((error) => console.error('Error fetching employee data:', error));
}


export function save_attendance() {
  

  const saveButton = document.querySelector('.save-toggler');

  if (!saveButton) {
    console.error('Save button not found.');
    return;
  }

  saveButton.addEventListener('click', () => {
    console.log('Save button clicked.');
    const dropdowns = document.querySelectorAll('.attendance-dropdown');
    const attendanceData = [];

    dropdowns.forEach((dropdown, index) => {
      const selectedStatus = dropdown.value;
      if (selectedStatus) {
        attendanceData.push({
          staff_ID: employees[index].staff_ID,
          attendance_Status: selectedStatus,
          date: new Date().toISOString().split('T')[0], // Today's date
        });
      }
    });

    console.log('Constructed attendance data:', attendanceData);

    if (attendanceData.length === 0) {
      alert('Please select attendance statuses before saving.');
      return;
    }

    // Send attendance data to backend
    fetch('../backend/attendance.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attendance: attendanceData }),
    })
      .then((response) => {
        console.log('Backend response status:', response.status);
        return response.json();
      })
      .then((result) => {
        console.log('Backend result:', result);
        if (result.success) {
          alert('Attendance saved successfully!');
        } else {
          alert('Error saving attendance: ' + result.message);
        }
      })
      .catch((error) => console.error('Error sending data to backend:', error));
  });
}
