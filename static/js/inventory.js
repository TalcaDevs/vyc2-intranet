// static/js/inventory.js

document.addEventListener('DOMContentLoaded', function() {
    // Quick Category Add
    setupQuickCategoryAdd();
    
    // Quick Supplier Add
    setupQuickSupplierAdd();
    
    // Stock Movement Form
    setupStockMovementForm();
    
    // Restock Buttons
    setupRestockButtons();
});

function setupQuickCategoryAdd() {
    const saveQuickCategoryBtn = document.getElementById('saveQuickCategory');
    if (saveQuickCategoryBtn) {
        saveQuickCategoryBtn.addEventListener('click', function() {
            const categoryName = document.getElementById('quick_category_name').value;
            const categoryDescription = document.getElementById('quick_category_description').value;
            
            if (!categoryName) {
                alert('Please enter a category name');
                return;
            }
            
            // Get CSRF token
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            
            // Send request to server
            fetch('/categories/add/ajax/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    name: categoryName,
                    description: categoryDescription
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Add new category to select dropdown
                    const categorySelect = document.getElementById('id_category');
                    const option = document.createElement('option');
                    option.value = data.category_id;
                    option.text = data.category_name;
                    categorySelect.add(option);
                    
                    // Select the new category
                    categorySelect.value = data.category_id;
                    
                    // Close the modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addCategoryModal'));
                    modal.hide();
                    
                    // Clear form
                    document.getElementById('quick_category_name').value = '';
                    document.getElementById('quick_category_description').value = '';
                    
                    // Show success message
                    alert('Category created successfully!');
                } else {
                    alert('Error: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    }
}

function setupQuickSupplierAdd() {
    const saveQuickSupplierBtn = document.getElementById('saveQuickSupplier');
    if (saveQuickSupplierBtn) {
        saveQuickSupplierBtn.addEventListener('click', function() {
            const supplierName = document.getElementById('quick_supplier_name').value;
            const contactPerson = document.getElementById('quick_supplier_contact').value;
            const email = document.getElementById('quick_supplier_email').value;
            const phone = document.getElementById('quick_supplier_phone').value;
            
            if (!supplierName) {
                alert('Please enter a supplier name');
                return;
            }
            
            // Get CSRF token
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            
            // Send request to server
            fetch('/api/suppliers/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    name: supplierName,
                    contact_person: contactPerson,
                    email: email,
                    phone: phone
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Add new supplier to select dropdown
                    const supplierSelect = document.getElementById('id_supplier');
                    const option = document.createElement('option');
                    option.value = data.supplier_id;
                    option.text = data.supplier_name;
                    supplierSelect.add(option);
                    
                    // Select the new supplier
                    supplierSelect.value = data.supplier_id;
                    
                    // Close the modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addSupplierModal'));
                    modal.hide();
                    
                    // Clear form
                    document.getElementById('quick_supplier_name').value = '';
                    document.getElementById('quick_supplier_contact').value = '';
                    document.getElementById('quick_supplier_email').value = '';
                    document.getElementById('quick_supplier_phone').value = '';
                    
                    // Show success message
                    alert('Supplier created successfully!');
                } else {
                    alert('Error: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    }
}

function setupStockMovementForm() {
    const partSelect = document.getElementById('id_part');
    const partInfoCard = document.getElementById('part-info-card');
    const partInfoContent = document.getElementById('part-info-content');
    
    if (partSelect) {
        partSelect.addEventListener('change', function() {
            if (this.value) {
                // Show loading state
                partInfoContent.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"></div><p>Loading part details...</p></div>';
                partInfoCard.style.display = 'block';
                
                // Fetch part details
                fetch(`/api/parts/${this.value}/`)
                    .then(response => response.json())
                    .then(data => {
                        partInfoContent.innerHTML = `
                            <h5>${data.name}</h5>
                            <p><strong>Part Number:</strong> ${data.part_number}</p>
                            <p><strong>Current Stock:</strong> <span class="${data.is_low_stock ? 'text-danger' : 'text-success'} fw-bold">${data.stock_quantity}</span></p>
                            <p><strong>Unit Price:</strong> $${data.unit_price.toFixed(2)}</p>
                            <p><strong>Category:</strong> ${data.category}</p>
                            <p><strong>Supplier:</strong> ${data.supplier || 'Not specified'}</p>
                            <p><strong>Storage Location:</strong> ${data.location || 'Not specified'}</p>
                        `;
                    })
                    .catch(error => {
                        console.error('Error fetching part details:', error);
                        partInfoContent.innerHTML = '<div class="alert alert-danger">Error loading part details. Please try again.</div>';
                    });
            } else {
                partInfoCard.style.display = 'none';
            }
        });
        
        // Trigger change event if a part is pre-selected
        if (partSelect.value) {
            partSelect.dispatchEvent(new Event('change'));
        }
    }
}

function setupRestockButtons() {
    // Script to pre-select the part when "Restock" is clicked
    const addStockButtons = document.querySelectorAll('.add-stock-btn');
    addStockButtons.forEach(button => {
        button.addEventListener('click', function() {
            const partId = this.getAttribute('data-part-id');
            const partName = this.getAttribute('data-part-name');
            
            // Set the part in the form
            const partSelect = document.getElementById('id_part');
            if (partSelect) {
                partSelect.value = partId;
                // Set movement type to "in" by default for restocking
                document.getElementById('id_movement_type').value = 'in';
                // Trigger change event to update part info
                partSelect.dispatchEvent(new Event('change'));
            }
        });
    });
}