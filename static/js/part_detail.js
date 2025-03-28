document.addEventListener('DOMContentLoaded', function() {
    // Show all movements functionality
    const showAllMovementsBtn = document.getElementById('show-all-movements');
    if (showAllMovementsBtn) {
        showAllMovementsBtn.addEventListener('click', function() {
            // Here you could load more movements with AJAX or expand the view
            alert('This functionality will be implemented in the next update.');
        });
    }
    
    // Movement details modal (for future implementation)
    const movementRows = document.querySelectorAll('.movement-transition');
    movementRows.forEach(row => {
        row.addEventListener('click', function() {
            // For future: Show movement details in a modal
            // Currently this could just be a visual feedback
            this.style.backgroundColor = 'rgba(0, 123, 255, 0.05)';
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 300);
        });
    });
});