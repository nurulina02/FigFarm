  const productList = document.getElementById("product-list");
  const transactionHistory = document.getElementById("transaction-history");

export function add_sales(){
  const addSaleModal = document.getElementById("add-sale-modal");
    const addSaleForm = document.getElementById("add-sale-form");
    const addSaleBtn = document.getElementById("add-sale-btn");
    const closeModal = document.getElementById("close-modal");
    addSaleBtn.addEventListener("click", () => {
      addSaleModal.classList.remove("hidden")
      fetch("../backend/fetch_products.php")
        .then(response => response.json())
        .then(data => populateDropdown("product", data.products))
        .catch(error => console.error("Error fetching products:", error));

    fetch("../backend/fetch_employees.php")
        .then(response => response.json())
        .then(data => populateDropdown("staff", data.employees))
        .catch(error => console.error("Error fetching employees:", error));

    // Populate dropdown with data
    function populateDropdown(id, items) {
        const dropdown = document.getElementById(id);
        items.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id || item.staff_ID;
            option.textContent = item.name || item.staff_Name;
            dropdown.appendChild(option);
        });
    }
    
    });
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
            <td>${transaction.time || "N/A"}</td>
        </tr>
      `).join('');
  }

  // Call the updateLists function to load data initially
  updateLists();
}
