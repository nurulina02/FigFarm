  const productList = document.getElementById("product-list");
  const transactionHistory = document.getElementById("transaction-history");

export function add_sales(){
  const addSaleModal = document.getElementById("add-sale-modal");
    const addSaleForm = document.getElementById("add-sale-form");
    const addSaleBtn = document.getElementById("add-sale-btn");
    const closeModal = document.getElementById("close-modal");

    addSaleBtn.addEventListener("click", () => {
        addSaleModal.classList.remove("hidden");
    
        // Fetch and populate product dropdown
        fetch("../backend/fetch_products.php")
            .then(response => response.json())
            .then(data => populateProductDropdown("product", data.products))
            .catch(error => console.error("Error fetching products:", error));
    
        // Fetch and populate staff dropdown
        fetch("../backend/fetch_employees.php")
            .then(response => response.json())
            .then(data => populateStaffDropdown("staff", data.employees))
            .catch(error => console.error("Error fetching employees:", error));
    });
    
    // Function to populate the product dropdown
    function populateProductDropdown(productDropdownId, products) {
        const productDropdown = document.getElementById(productDropdownId);
        const priceInput = document.getElementById("price-input"); // Ensure this matches your input element's ID
    
        // Clear existing options
        productDropdown.innerHTML = "<option value=''>Please Select Product</option>";
    
        // Populate dropdown
        products.forEach(product => {
            const option = document.createElement("option");
            option.value = product.id;
            option.textContent = product.name;
            option.dataset.price = product.price || ""; // Store the price as a data attribute
            option.dataset.unit = product.unit || "";
            productDropdown.appendChild(option);
        });
    
        // Update price when a product is selected
        productDropdown.addEventListener("change", () => {
            const selectedOption = productDropdown.options[productDropdown.selectedIndex];
            const selectedPrice = selectedOption.dataset.price || ""; // Retrieve the price from the selected option
            priceInput.value = selectedPrice ? `RM ${selectedPrice} / ${selectedOption.dataset.unit}` : ""; // Update the price input
        });
    }
    
    // Function to populate the staff dropdown
    function populateStaffDropdown(staffDropdownId, employees) {
        const staffDropdown = document.getElementById(staffDropdownId);
    
        // Clear existing options
        staffDropdown.innerHTML = "<option value=''>Please Select Staff</option>";
    
        // Populate dropdown
        employees.forEach(employee => {
            const option = document.createElement("option");
            option.value = employee.staff_ID;
            option.textContent = employee.staff_Name;
            staffDropdown.appendChild(option);
        });
    
    
    
    
    
    };
    closeModal.addEventListener("click", () => addSaleModal.classList.add("hidden"));
  
    
    // Submit new sale
    addSaleForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(addSaleForm);
        const jsonData = Object.fromEntries(formData);
        console.log('JSON Sent:', jsonData);

        fetch("../backend/add_sale.php", {
          method: "POST",
          body: JSON.stringify(Object.fromEntries(formData)),
          headers: { "Content-Type": "application/json" },
      })
      .then(response => response.json())
      .then(result => {
          console.log('Response from PHP:', result); // Debug the response
          if (result.success) {
            addSaleModal.classList.add("hidden");
              alert("Sale added successfully!");
               // Close the modal
              update_list();
          } else {
              alert("Error adding sale: " + result.message);
          }
      })
      .catch(error => console.error("Error adding sale:", error));
    });
}
export function update_list() {
  const productList = document.getElementById("product-list");
  const transactionHistory = document.getElementById("transaction-history");

  function updateLists() {
      fetch("../backend/fetch_sales_summary.php")
          .then(response => response.json())
          .then(data => {
              console.log("Fetched Data:", data); // Debugging
              if (data.success) {
                  productList.innerHTML = generateProductList(data.products);
                  transactionHistory.innerHTML = generateTransactionHistory(data.transactions);
              } else {
                  
                  productList.innerHTML = "<tr><td>No products found.</td/</tr>";
                  //transactionHistory.innerHTML = "<tr><td>No transactions found.</td></tr>";
              }
          })
          .catch(error => {
              console.error("Error fetching sales summary:", error);
              productList.innerHTML = "<p>Error loading products.</p>";
              transactionHistory.innerHTML = "<p>Error loading transactions.</p>";
          });
  }

  function generateProductList(products) {
      if (!products || products.length === 0) {
          return "<p>No products available.</p>";
      }

      return products.map(product => `
          <div class="product">
              <p><strong>${product.name}</strong></p> <span>RM${product.price ? parseFloat(product.price).toFixed(2) : "N/A"}/${product.unit} x ${product.quantity_sold} : RM${product.total_sales ? parseFloat(product.total_sales).toFixed(2) : "0.00"}</span>
          </div>
      `).join("");
  }

  function generateTransactionHistory(transactions) {
      if (!transactions || transactions.length === 0) {
        return `
        <tr>
        <td colspan="6" style="text-align: center;">No transactions found.</td>
        </tr>
        `;
      }

      return transactions.map(transaction =>
        `
        <tr>
            <td>${transaction.product || "N/A"}</td>
            <td>${transaction.staff || "N/A"}</td>
            <td>${transaction.quantity || "N/A"}</td>
            <td>${transaction.payment_method || "N/A"}</td>
            <td>${new Date(transaction.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || "N/A"}</td>
        </tr>
      `).join('');
  }

  // Call the updateLists function to load data initially
  updateLists();
}
