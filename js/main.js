// Main JavaScript file for GYMGYM application

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    loadNavbar();
    loadFooter();
    setupEventListeners();
    checkAuthStatus();
    initializeImageSlider();
}

// Load navbar
function loadNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        navbarContainer.innerHTML = `
            <nav class="navbar">
                <a href="index.html" class="logo">
                    <img src="images/logo.svg" alt="UNITY FITNESS" class="logo-img" />
                </a>
                <ul class="nav-links">
                    <li><a href="index.html">Trang chủ</a></li>
                    ${window.db.isLoggedIn() ? `
                        <li><a href="dashboard.html">Dashboard</a></li>
                        <li><a href="#" onclick="logout()">Đăng xuất</a></li>
                    ` : `
                        <li><a href="login.html">Đăng nhập</a></li>
                        <li><a href="register.html">Đăng ký</a></li>
                    `}
                </ul>
            </nav>
        `;
    }
}

// Load footer
function loadFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = `
            <div class="footer">
                <p>&copy; 2025 UNITY FITNESS</p>
            </div>
        `;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showAlert('Vui lòng nhập đầy đủ thông tin!', 'danger');
        return;
    }
    
    const result = window.db.login(email, password);
    
    if (result.success) {
        showAlert(result.message, 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showAlert(result.message, 'danger');
    }
}

// Handle register form submission
function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData);
    
    // Validate form
    if (!userData.fullName || !userData.email || !userData.phone || !userData.cccd || !userData.password || !userData.confirmPassword) {
        showAlert('Vui lòng nhập đầy đủ thông tin!', 'danger');
        return;
    }
    
    if (userData.password !== userData.confirmPassword) {
        showAlert('Mật khẩu xác nhận không khớp!', 'danger');
        return;
    }
    
    if (userData.password.length < 6) {
        showAlert('Mật khẩu phải có ít nhất 6 ký tự!', 'danger');
        return;
    }
    
    // Remove confirmPassword from userData
    delete userData.confirmPassword;
    
    const result = window.db.register(userData);
    
    if (result.success) {
        showAlert(result.message, 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    } else {
        showAlert(result.message, 'danger');
    }
}

// Show alert message
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Insert alert at the top of main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(alertDiv, mainContent.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Logout function
function logout() {
    const result = window.db.logout();
    showAlert(result.message, 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Check authentication status
function checkAuthStatus() {
    if (window.db.isLoggedIn()) {
        const currentUser = window.db.getCurrentUser();
        console.log('User logged in:', currentUser);
    }
}


// Show forgot password modal (placeholder)
function showForgotPassword() {
    showAlert('Tính năng quên mật khẩu đang được phát triển!', 'info');
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Image Slider Functions
let currentSlideIndex = 0;
let slideInterval;

function initializeImageSlider() {
    const images = document.querySelectorAll('.slider-image');
    const dots = document.querySelectorAll('.dot');
    
    if (images.length === 0) return;
    
    // Auto slide every 4 seconds
    slideInterval = setInterval(nextSlide, 4000);
    
    // Pause on hover
    const slider = document.querySelector('.image-slider');
    if (slider) {
        slider.addEventListener('mouseenter', pauseSlider);
        slider.addEventListener('mouseleave', resumeSlider);
    }
}

function nextSlide() {
    const images = document.querySelectorAll('.slider-image');
    const dots = document.querySelectorAll('.dot');
    
    if (images.length === 0) return;
    
    // Remove active class from current slide
    images[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');
    
    // Move to next slide
    currentSlideIndex = (currentSlideIndex + 1) % images.length;
    
    // Add active class to new slide
    images[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}

function currentSlide(n) {
    const images = document.querySelectorAll('.slider-image');
    const dots = document.querySelectorAll('.dot');
    
    if (images.length === 0) return;
    
    // Remove active class from current slide
    images[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');
    
    // Set new slide index
    currentSlideIndex = n - 1;
    
    // Add active class to new slide
    images[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
    
    // Reset auto slide timer
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 4000);
}

function pauseSlider() {
    clearInterval(slideInterval);
}

function resumeSlider() {
    slideInterval = setInterval(nextSlide, 4000);
}

// Export functions for global use
window.logout = logout;
window.showForgotPassword = showForgotPassword;
window.showAlert = showAlert;
window.currentSlide = currentSlide;
