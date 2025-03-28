document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('id_profile_image');
    const fileButton = fileInput.previousElementSibling;
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileButton.innerHTML = '<i class="bi bi-check-circle me-2"></i>' + this.files[0].name;
            fileButton.classList.remove('btn-outline-primary');
            fileButton.classList.add('btn-success');
        } else {
            fileButton.innerHTML = '<i class="bi bi-cloud-arrow-up me-2"></i>Choose Image';
            fileButton.classList.remove('btn-success');
            fileButton.classList.add('btn-outline-primary');
        }
    });
});