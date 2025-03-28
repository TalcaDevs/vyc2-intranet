// user_list.js - JavaScript for user list page

document.addEventListener('DOMContentLoaded', function() {
    // Toggle between table and grid views
    const tableViewBtn = document.getElementById('table-view-btn');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const tableView = document.getElementById('table-view');
    const gridView = document.getElementById('grid-view');
    
    if (tableViewBtn && gridViewBtn && tableView && gridView) {
        // Check if there's a saved preference
        const viewPreference = localStorage.getItem('usersViewPreference');
        if (viewPreference === 'grid') {
            showGridView();
        }
        
        tableViewBtn.addEventListener('click', function() {
            showTableView();
        });
        
        gridViewBtn.addEventListener('click', function() {
            showGridView();
        });
        
        function showTableView() {
            tableView.style.display = 'block';
            gridView.style.display = 'none';
            tableViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            localStorage.setItem('usersViewPreference', 'table');
        }
        
        function showGridView() {
            tableView.style.display = 'none';
            gridView.style.display = 'block';
            gridViewBtn.classList.add('active');
            tableViewBtn.classList.remove('active');
            localStorage.setItem('usersViewPreference', 'grid');
        }
    }
    
    // User details modal functionality
    // This would be used to show user details in a modal
    const viewButtons = document.querySelectorAll('.btn-outline-secondary');
    const userDetailsModal = new bootstrap.Modal(document.getElementById('userDetailsModal'));
    const userDetailsModalBody = document.getElementById('userDetailsModalBody');
    const editUserBtn = document.getElementById('editUserBtn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real implementation, you would fetch user details from the server
            const userId = this.closest('tr')?.dataset.userId || 
                           this.closest('.user-card')?.dataset.userId || 
                           '1'; // Fallback
            
            userDetailsModalBody.innerHTML = `
                <div class="text-center mb-3">
                    <div class="rounded-circle bg-light d-inline-flex align-items-center justify-content-center" style="width: 100px; height: 100px;">
                        <i class="bi bi-person" style="font-size: 3rem;"></i>
                    </div>
                    <h4 class="mt-3">User Details</h4>
                    <p class="text-muted">This would show detailed user information</p>
                </div>
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    In a production system, this would display actual user details fetched from the server.
                </div>
            `;
            
            editUserBtn.href = `/users/edit/${userId}`;
            userDetailsModal.show();
        });
    });
});