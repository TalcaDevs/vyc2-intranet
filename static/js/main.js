// main.js - Core JavaScript functionality for the Workshop Inventory System

document.addEventListener('DOMContentLoaded', function() {
    /**
     * Initialize tooltips
     */
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    if (tooltips.length > 0) {
        Array.from(tooltips).map(tooltip => new bootstrap.Tooltip(tooltip));
    }
    
    /**
     * Initialize popovers
     */
    const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
    if (popovers.length > 0) {
        Array.from(popovers).map(popover => new bootstrap.Popover(popover));
    }
    
    /**
     * Custom file input
     * Change text displayed when a file is selected
     */
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const fileName = e.target.files[0]?.name || 'No file chosen';
            const nextSibling = e.target.nextElementSibling;
            
            if (nextSibling && nextSibling.classList.contains('custom-file-label')) {
                nextSibling.textContent = fileName;
            }
        });
    });
    
    /**
     * Toggle password visibility
     */
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = document.getElementById(this.dataset.target);
            const icon = this.querySelector('i');
            
            if (passwordInput) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('bi-eye-slash');
                    icon.classList.add('bi-eye');
                }
            }
        });
    });
    
    /**
     * Handle dismissible alerts auto-close
     */
    const autoDismissAlerts = document.querySelectorAll('.alert-dismissible[data-auto-dismiss]');
    autoDismissAlerts.forEach(alert => {
        const dismissTime = parseInt(alert.dataset.autoDismiss) || 5000;
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, dismissTime);
    });
    
    /**
     * Form validation enhancement
     */
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
    
    /**
     * Confirmation dialogs
     */
    const confirmationButtons = document.querySelectorAll('[data-confirm]');
    confirmationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const message = this.dataset.confirm || 'Are you sure you want to proceed?';
            if (!confirm(message)) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });
    
    /**
     * Back to top button
     */
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});