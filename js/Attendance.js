export function attendance() {
  fetch('../backend/fetch_employees.php')
    .then(response => response.json())
    .then(data => {
      const employees = data.employees;
      const employeeList = document.getElementById('attendance-list');
      employeeList.innerHTML = '';

      employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${employee.staff_ID}</td>
          <td>${employee.staff_Name}</td>
          <td class="action-cell"></td>
        `;
        const actionCell = row.querySelector('td:last-child');

        // Create dropdown
        const dropdown = document.createElement('select');
        dropdown.classList.add('attendance-dropdown');

        const statuses = [
          { value: 'ND', text: 'ND - Normal Working Day, Present' },
          { value: 'PN', text: 'PN - Public Holiday, Not Working' },
          { value: 'PW', text: 'PW - Public Holiday, Working' },
          { value: 'ON', text: 'ON - Off Day, Not Working' },
          { value: 'OW', text: 'OW - Off Day, Working' },
          { value: 'MC', text: 'MC - Medical Leave' },
          { value: 'AL', text: 'AL - Annual Leave' },
          { value: 'UL', text: 'UL - Unpaid Approved Leave' },
          { value: 'MA', text: 'MA - Mark As Absent' }
        ];

        statuses.forEach(status => {
          const option = document.createElement('option');
          option.value = status.value;
          option.textContent = status.text;
          dropdown.appendChild(option);
        });

        actionCell.appendChild(dropdown);
        employeeList.appendChild(row);

        const saveButton = document.querySelector('.save-toggler');
        saveButton.addEventListener('click', () => {
          const dropdowns = document.querySelectorAll('.attendance-dropdown');
          const attendanceData = [];
        
          dropdowns.forEach((dropdown, index) => {
            const selectedStatus = dropdown.value;
            if (selectedStatus) {
              attendanceData.push({
                staff_ID: employees[index].staff_ID,
                attendance_Status: selectedStatus,
                date: new Date().toISOString().split('T')[0]
              });
            }
          });
        
          if (attendanceData.length === 0) {
            alert('Please select attendance statuses before saving.');
            return;
          }
        
          // Send the complete attendance data once
          fetch('../backend/attendance.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ attendance: attendanceData })
          })
            .then((response) => response.json())
            .then((result) => {
              if (result.success) {
                alert('Attendance saved successfully!');
              } else {
                alert('Error saving attendance: ' + result.message);
              }
            })
            .catch((error) => console.error('Error:', error));
        });
        
        

        
      });
    })
    .catch(error => console.error('Error fetching employee data:', error));
}
