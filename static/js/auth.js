function togglePassword() {
    const passwordInput = document.getElementById('id_password');
    const toggleBtn = document.querySelector('.password-toggle i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('bi-eye');
        toggleBtn.classList.add('bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('bi-eye-slash');
        toggleBtn.classList.add('bi-eye');
    }
}