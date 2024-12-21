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

        const editButton = document.createElement('button');
        editButton.classList.add('action-btn', 'edit-btn');
        editButton.title = 'Edit';
        editButton.innerHTML = '<span class="material-symbols-rounded">edit</span>';
        editButton.addEventListener('click', () => {
          
        });


        actionCell.appendChild(editButton);
        employeeList.appendChild(row);
      });


    })
    .catch(error => console.error('Error fetching employee data:', error));
}