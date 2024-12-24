export function fetch_products() {
  const productList = document.getElementById("product-list");

  // Fetch products from the backend
  fetch("../backend/fetch_products.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const products = data.products;
        productList.innerHTML = ''; // Clear the list before rendering
        
        products.forEach((product) => {
          // Create a container for each product
          const productDiv = document.createElement("div");
          productDiv.classList.add("product");

          // Add product details
          productDiv.innerHTML = `
          
            ${product.id}
            ${product.name}
            RM${parseFloat(product.price).toFixed(2)}/${product.unit}
          
          `;

          // Append the product container to the list
          productList.appendChild(productDiv);
        });
      } else {
        productList.innerHTML = "<p>No products found.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      productList.innerHTML = "<p>Error loading products.</p>";
    });
}
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

        fetch("../backend/add_sale.php", {
            method: "POST",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { "Content-Type": "application/json" },
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert("Sale added successfully!");
                    updateLists();
                } else {
                    alert("Error adding sale: " + result.message);
                }
                addSaleModal.classList.add("hidden");
            })
            .catch(error => console.error("Error adding sale:", error));
    });
}

