// stock_movement_form.js - JavaScript for stock movement form

document.addEventListener('DOMContentLoaded', function() {
    // Handle part selection change
    const partSelect = document.getElementById('id_part');
    const partInfoCard = document.getElementById('part-info-card');
    const partInfoContent = document.getElementById('part-info-content');
    
    if (partSelect) {
        partSelect.addEventListener('change', function() {
            if (this.value) {
                // Show loading state
                partInfoContent.innerHTML = `
                    <div class="text-center py-4">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2">Loading part details...</p>
                    </div>
                `;
                partInfoCard.style.display = 'block';
                
                // Fetch part details
                fetch(`/inventory/api/parts/${this.value}/`)
                .then(response => response.json())
                .then(data => {
                        // Update the part info content
                        const imageHtml = data.image ? 
                            `<img src="${data.image}" alt="${data.name}" class="part-image mb-3">` : 
                            `<div class="part-image-placeholder mb-3"><i class="bi bi-tools part-placeholder-icon"></i></div>`;
                            
                        partInfoContent.innerHTML = `
                            <div class="text-center mb-3">
                                ${imageHtml}
                                <h5>${data.name}</h5>
                                <p class="text-muted mb-0"><code>${data.part_number}</code></p>
                            </div>
                            
                            <div class="row">
                                <div class="col-6">
                                    <div class="mb-3">
                                        <div class="text-muted small">Current Stock</div>
                                        <div class="fs-5 ${data.is_low_stock ? 'text-danger' : 'text-success'} fw-bold">
                                            ${data.stock_quantity}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="mb-3">
                                        <div class="text-muted small">Minimum Stock</div>
                                        <div class="fs-5">${data.minimum_stock}</div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="mb-3">
                                        <div class="text-muted small">Unit Price</div>
                                        <div class="fs-5">$${data.unit_price.toFixed(2)}</div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="mb-3">
                                        <div class="text-muted small">Category</div>
                                        <div class="fs-5">${data.category}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <div class="text-muted small">Storage Location</div>
                                <div>${data.location || 'Not specified'}</div>
                            </div>
                        `;
                        
                        // Initialize the movement preview
                        initializeMovementPreview(data.stock_quantity, data.minimum_stock);
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
    
    // Initialize movement preview with values from server-side
    const partInitialStockQuantity = document.getElementById('current-stock');
    const partMinimumStock = document.getElementById('negative-stock-warning');
    
    if (partInitialStockQuantity) {
        initializeMovementPreview(
            parseInt(partInitialStockQuantity.textContent) || 0,
            document.querySelector('form').dataset.minimumStock || 0
        );
        updateMovementPreview();
    }
    
    // Function to initialize movement preview
    function initializeMovementPreview(currentStock, minimumStock) {
        const currentStockEl = document.getElementById('current-stock');
        const newStockEl = document.getElementById('new-stock');
        const negativeStockWarning = document.getElementById('negative-stock-warning');
        const lowStockWarning = document.getElementById('low-stock-warning');
        const stockWarnings = document.getElementById('stock-warnings');
        const quantityInput = document.getElementById('id_quantity');
        const movementTypeRadios = document.querySelectorAll('input[name="movement_type"]');
        
        if (currentStockEl && newStockEl && stockWarnings && quantityInput && movementTypeRadios.length) {
            // Set current stock value
            currentStockEl.textContent = currentStock;
            
            // Update preview when quantity changes
            quantityInput.addEventListener('input', updateMovementPreview);
            
            // Update preview when movement type changes
            movementTypeRadios.forEach(radio => {
                radio.addEventListener('change', updateMovementPreview);
            });
            
            // Initial update
            updateMovementPreview();
        }
    }
    
    // Function to update movement preview
    function updateMovementPreview() {
        const currentStockEl = document.getElementById('current-stock');
        const newStockEl = document.getElementById('new-stock');
        const negativeStockWarning = document.getElementById('negative-stock-warning');
        const lowStockWarning = document.getElementById('low-stock-warning');
        const stockWarnings = document.getElementById('stock-warnings');
        const quantityInput = document.getElementById('id_quantity');
        const movementTypeRadios = document.querySelectorAll('input[name="movement_type"]:checked');
        
        if (currentStockEl && newStockEl && stockWarnings && quantityInput && movementTypeRadios.length) {
            const currentStock = parseInt(currentStockEl.textContent) || 0;
            // Get minimum stock from form dataset or default to 0
            const minimumStock = parseInt(document.querySelector('form').dataset.minimumStock) || 0;
            const quantity = parseInt(quantityInput.value) || 0;
            const movementType = movementTypeRadios[0].value;
            let newStock = currentStock;
            
            // Calculate new stock based on movement type
            if (movementType === 'in') {
                newStock = currentStock + quantity;
            } else if (movementType === 'out') {
                newStock = currentStock - quantity;
            } else if (movementType === 'adjustment') {
                newStock = currentStock + quantity;
            }
            
            // Update new stock display
            newStockEl.textContent = newStock;
            
            // Apply color based on stock level
            if (newStock < 0) {
                newStockEl.className = 'fs-5 fw-bold text-danger';
            } else if (newStock < minimumStock) {
                newStockEl.className = 'fs-5 fw-bold text-warning';
            } else {
                newStockEl.className = 'fs-5 fw-bold text-success';
            }
            
            // Show warnings if applicable
            stockWarnings.classList.remove('d-none');
            
            if (newStock < 0) {
                negativeStockWarning.classList.remove('d-none');
            } else {
                negativeStockWarning.classList.add('d-none');
            }
            
            if (newStock < minimumStock && newStock >= 0) {
                lowStockWarning.classList.remove('d-none');
            } else {
                lowStockWarning.classList.add('d-none');
            }
            
            if (newStock >= 0 && newStock >= minimumStock) {
                stockWarnings.classList.add('d-none');
            }
        }
    }
});