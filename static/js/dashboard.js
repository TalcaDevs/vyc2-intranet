/**
 * Dashboard JavaScript functionality
 * Workshop Inventory Management System
 */

document.addEventListener('DOMContentLoaded', function() {
    // Handle restock buttons
    initializeRestockButtons();
    
    // Quick add category
    initializeQuickCategory();
    
    // Quick add supplier
    initializeQuickSupplier();
});

/**
 * Initialize restock buttons functionality
 */
function initializeRestockButtons() {
    const addStockButtons = document.querySelectorAll('.add-stock-btn');
    addStockButtons.forEach(button => {
        button.addEventListener('click', function() {
            const partId = this.getAttribute('data-part-id');
            const partName = this.getAttribute('data-part-name');
            
            // Pre-select the part in the form
            const partSelect = document.getElementById('id_part');
            if (partSelect) {
                partSelect.value = partId;
                // Set movement type to "in" by default for restocking
                document.getElementById('id_movement_type').value = 'in';
                // Add a helpful reference 
                document.getElementById('id_reference').value = 'Restock - Low Inventory';
            }
        });
    });
}

/**
 * Initialize quick category add functionality
 */
function initializeQuickCategory() {
    const saveQuickCategoryBtn = document.getElementById('saveQuickCategory');
    if (saveQuickCategoryBtn) {
        saveQuickCategoryBtn.addEventListener('click', function() {
            const categoryName = document.getElementById('quick_category_name').value;
            const categoryDescription = document.getElementById('quick_category_description').value;
            
            if (!categoryName) {
                alert('Please enter a category name');
                return;
            }
            
            // Show loading state
            saveQuickCategoryBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
            saveQuickCategoryBtn.disabled = true;
            
            // Get CSRF token
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            
            // Send request to server
            fetch('/inventory/categories/add/ajax/', {
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
                // Reset button state
                saveQuickCategoryBtn.innerHTML = '<i class="bi bi-save me-1"></i>Save Category';
                saveQuickCategoryBtn.disabled = false;
                
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
                    
                    // Show toast notification
                    showToast('Category created successfully!', data.category_name, 'success');
                } else {
                    alert('Error: ' + data.error);
                }
            })
            .catch(error => {
                // Reset button state
                saveQuickCategoryBtn.innerHTML = '<i class="bi bi-save me-1"></i>Save Category';
                saveQuickCategoryBtn.disabled = false;
                
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    }
}

/**
 * Initialize quick supplier add functionality
 */
function initializeQuickSupplier() {
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
            
            // Show loading state
            saveQuickSupplierBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
            saveQuickSupplierBtn.disabled = true;
            
            // Get CSRF token
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            
            // Send request to server
            fetch('/inventory/api/suppliers/add/', {
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
                // Reset button state
                saveQuickSupplierBtn.innerHTML = '<i class="bi bi-save me-1"></i>Save Supplier';
                saveQuickSupplierBtn.disabled = false;
                
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
                    
                    // Show success toast
                    showToast('Supplier created successfully!', data.supplier_name, 'info');
                } else {
                    alert('Error: ' + data.error);
                }
            })
            .catch(error => {
                // Reset button state
                saveQuickSupplierBtn.innerHTML = '<i class="bi bi-save me-1"></i>Save Supplier';
                saveQuickSupplierBtn.disabled = false;
                
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
        });
    }
}

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} title - The title of the toast
 * @param {string} type - The type of toast (success, info, warning, danger)
 */
function showToast(message, title, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '11';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const bgColor = type === 'success' ? 'bg-success' : 
                   type === 'info' ? 'bg-info' :
                   type === 'warning' ? 'bg-warning' : 
                   'bg-danger';
    
    const iconClass = type === 'success' ? 'bi-check-circle' : 
                     type === 'info' ? 'bi-info-circle' :
                     type === 'warning' ? 'bi-exclamation-triangle' : 
                     'bi-x-circle';
    
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = 'toast show';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="toast-header ${bgColor} text-white">
            <i class="bi ${iconClass} me-2"></i>
            <strong class="me-auto">${title}</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        const toastElement = document.getElementById(toastId);
        if (toastElement) {
            toastElement.remove();
        }
        
        // Remove container if empty
        if (toastContainer.children.length === 0) {
            toastContainer.remove();
        }
    }, 3000);
}