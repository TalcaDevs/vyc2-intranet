// part_form.js - JavaScript for part form page

document.addEventListener('DOMContentLoaded', function() {
    // Quick category add
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
            fetch('/inventory/categories/add-ajax/', {
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

    // Quick supplier add
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
            fetch('/inventory/suppliers/add-ajax/', {
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
});