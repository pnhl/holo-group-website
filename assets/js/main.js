// ===== MAIN JAVASCRIPT FILE =====

// ===== CONSTANTS AND CONFIGURATIONS =====
const CONFIG = {
    apiBaseUrl: 'https://api.holo-group.com',
    trackingApiUrl: 'https://tracking.holo-group.com',
    animationDuration: 300,
    scrollOffset: 80
};

// Demo data for route finder
const DEMO_ROUTES = {
    'hcm-danang': {
        price: '350.000đ',
        duration: '12-14 giờ',
        frequency: '6 chuyến/ngày',
        departure: ['06:00', '08:30', '14:00', '16:30', '20:00', '22:30'],
        busType: 'Giường nằm cao cấp'
    },
    'hanoi-hcm': {
        price: '450.000đ',
        duration: '18-20 giờ',
        frequency: '4 chuyến/ngày',
        departure: ['07:00', '14:00', '20:00', '22:00'],
        busType: 'Giường nằm VIP'
    },
    'hcm-cantho': {
        price: '120.000đ',
        duration: '3-4 giờ',
        frequency: '10 chuyến/ngày',
        departure: ['05:30', '07:00', '09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00', '23:00'],
        busType: 'Ghế ngồi thường'
    }
};

// Demo tracking data
const DEMO_TRACKING = {
    'HE001234': {
        status: 'Đang giao hàng',
        location: 'Trung tâm phân phối Quận 7, TP.HCM',
        estimatedDelivery: '15:30 hôm nay',
        timeline: [
            { time: '08:00', status: 'Đã nhận hàng', location: 'Kho Tân Bình' },
            { time: '10:30', status: 'Đang vận chuyển', location: 'Trung tâm phân loại' },
            { time: '13:45', status: 'Đang giao hàng', location: 'Trung tâm phân phối Quận 7' },
            { time: '', status: 'Giao thành công', location: 'Đến người nhận', pending: true }
        ]
    },
    'HE005678': {
        status: 'Đã giao thành công',
        location: 'Đã giao đến người nhận',
        estimatedDelivery: 'Đã hoàn thành',
        timeline: [
            { time: '14:00', status: 'Đã nhận hàng', location: 'Kho Hà Nội' },
            { time: '16:20', status: 'Đang vận chuyển', location: 'Trung tâm phân loại Hà Nội' },
            { time: '09:15', status: 'Đã đến điểm giao', location: 'Bưu cục Cầu Giấy' },
            { time: '11:30', status: 'Đã giao thành công', location: 'Đến người nhận' }
        ]
    }
};

// Language content
const LANGUAGE_CONTENT = {
    vi: {
        'nav-home': 'Trang chủ',
        'nav-about': 'Về chúng tôi',
        'nav-services': 'Dịch vụ',
        'nav-news': 'Tin tức',
        'nav-careers': 'Tuyển dụng',
        'nav-contact': 'Liên hệ',
        'hero-title': 'Kết nối hành trình<br><span class="highlight">Tăng tốc tương lai</span>',
        'hero-subtitle': 'Tập đoàn HOLO Group - Dẫn đầu trong lĩnh vực vận tải hành khách và logistics tại Việt Nam với cam kết an toàn, đúng giờ và chăm sóc khách hàng tận tâm.'
    },
    en: {
        'nav-home': 'Home',
        'nav-about': 'About Us',
        'nav-services': 'Services',
        'nav-news': 'News',
        'nav-careers': 'Careers',
        'nav-contact': 'Contact',
        'hero-title': 'Connecting journeys<br><span class="highlight">Accelerating the future</span>',
        'hero-subtitle': 'HOLO Group - Leading transportation and logistics company in Vietnam with commitment to safety, punctuality and dedicated customer care.'
    }
};

let currentLanguage = 'vi';

// ===== DOM ELEMENTS =====
let elements = {};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    initializeAnimations();
    setMinDate();
    initializeScrollEffects();
});

function initializeElements() {
    elements = {
        navToggle: document.getElementById('nav-toggle'),
        navMenu: document.getElementById('nav-menu'),
        header: document.getElementById('header'),
        routeForm: document.getElementById('routeForm'),
        routeResults: document.getElementById('route-results'),
        trackingForm: document.getElementById('trackingForm'),
        trackingResult: document.getElementById('tracking-result'),
        quickContactForm: document.getElementById('quickContactForm'),
        statNumbers: document.querySelectorAll('.stat-number'),
        langSwitch: document.querySelector('.lang-switch a')
    };
}

function initializeEventListeners() {
    // Mobile menu toggle
    if (elements.navToggle && elements.navMenu) {
        elements.navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Route finder form
    if (elements.routeForm) {
        elements.routeForm.addEventListener('submit', handleRouteSearch);
    }

    // Tracking form
    if (elements.trackingForm) {
        elements.trackingForm.addEventListener('submit', handleTrackingSearch);
    }

    // Quick contact form
    if (elements.quickContactForm) {
        elements.quickContactForm.addEventListener('submit', handleQuickContact);
    }

    // Language switcher
    if (elements.langSwitch) {
        elements.langSwitch.addEventListener('click', function(e) {
            e.preventDefault();
            toggleLanguage();
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - CONFIG.scrollOffset;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Window scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Dropdown menu hover effects
    initializeDropdowns();
}

function initializeAnimations() {
    // Initialize Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                
                // Animate stat numbers
                if (entry.target.classList.contains('stats')) {
                    animateStatNumbers();
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .route-card, .news-card, .stats').forEach(el => {
        observer.observe(el);
    });
}

function initializeScrollEffects() {
    // Parallax effect for hero section (optional)
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = hero.querySelector('.hero-background');
            if (parallax) {
                const speed = scrolled * 0.5;
                parallax.style.transform = `translateY(${speed}px)`;
            }
        });
    }
}

function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
            
            // Toggle dropdown on click (for mobile)
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    elements.navMenu.classList.toggle('active');
    elements.navToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (elements.navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// ===== HEADER SCROLL EFFECT =====
function handleScroll() {
    const scrollTop = window.pageYOffset;
    
    // Header background on scroll
    if (elements.header) {
        if (scrollTop > 100) {
            elements.header.style.background = 'rgba(255, 255, 255, 0.95)';
            elements.header.style.backdropFilter = 'blur(10px)';
        } else {
            elements.header.style.background = '#ffffff';
            elements.header.style.backdropFilter = 'none';
        }
    }
    
    // Show/hide scroll to top button (if exists)
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        if (scrollTop > 500) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    }
}

// ===== STATISTICS ANIMATION =====
function animateStatNumbers() {
    elements.statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with commas
            stat.textContent = Math.floor(current).toLocaleString('vi-VN');
        }, 20);
    });
}

// ===== ROUTE FINDER =====
function handleRouteSearch(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const departure = formData.get('departure');
    const destination = formData.get('destination');
    const date = formData.get('departure-date');
    const passengers = formData.get('passengers');
    
    // Validate form
    if (!departure || !destination || !date) {
        showNotification('Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }
    
    if (departure === destination) {
        showNotification('Điểm đi và điểm đến không thể giống nhau', 'error');
        return;
    }
    
    // Show loading
    elements.routeResults.innerHTML = '<div class="loading">Đang tìm kiếm...</div>';
    
    // Simulate API call
    setTimeout(() => {
        displayRouteResults(departure, destination, date, passengers);
    }, 1000);
}

function displayRouteResults(departure, destination, date, passengers) {
    const routeKey = `${departure}-${destination}`;
    const route = DEMO_ROUTES[routeKey];
    
    if (!route) {
        elements.routeResults.innerHTML = `
            <div class="no-results">
                <h4>Không tìm thấy tuyến đường</h4>
                <p>Hiện tại chúng tôi chưa có tuyến từ ${getLocationName(departure)} đến ${getLocationName(destination)}.</p>
                <p>Vui lòng liên hệ hotline 1900 1234 để được hỗ trợ.</p>
            </div>
        `;
        return;
    }
    
    const resultsHTML = `
        <div class="route-results-header">
            <h4>Tuyến: ${getLocationName(departure)} → ${getLocationName(destination)}</h4>
            <p>Ngày đi: ${formatDate(date)} | Số khách: ${passengers}</p>
        </div>
        <div class="route-results-list">
            ${route.departure.map(time => `
                <div class="route-result-item">
                    <div class="departure-time">
                        <strong>${time}</strong>
                        <span>Khởi hành</span>
                    </div>
                    <div class="route-details">
                        <div class="bus-type">${route.busType}</div>
                        <div class="duration">${route.duration}</div>
                    </div>
                    <div class="price-booking">
                        <div class="price">${route.price}</div>
                        <button class="btn btn-primary btn-small" onclick="selectRoute('${routeKey}', '${time}')">
                            Chọn chuyến
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    elements.routeResults.innerHTML = resultsHTML;
}

function selectRoute(routeKey, time) {
    showNotification(`Đã chọn chuyến ${time}. Đang chuyển đến trang đặt vé...`, 'success');
    
    // Simulate redirect to booking page
    setTimeout(() => {
        window.location.href = `booking.html?route=${routeKey}&time=${time}`;
    }, 1500);
}

function getLocationName(code) {
    const locations = {
        'hcm': 'TP. Hồ Chí Minh',
        'hanoi': 'Hà Nội',
        'danang': 'Đà Nẵng',
        'cantho': 'Cần Thơ',
        'haiphong': 'Hải Phòng'
    };
    return locations[code] || code;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function setMinDate() {
    const dateInput = document.getElementById('departure-date');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
}

// ===== TRACKING SYSTEM =====
function handleTrackingSearch(e) {
    e.preventDefault();
    
    const trackingCode = document.getElementById('tracking-code').value.trim().toUpperCase();
    
    if (!trackingCode) {
        showNotification('Vui lòng nhập mã vận đơn', 'error');
        return;
    }
    
    // Show loading
    elements.trackingResult.innerHTML = '<div class="loading">Đang tra cứu...</div>';
    
    // Simulate API call
    setTimeout(() => {
        displayTrackingResult(trackingCode);
    }, 1000);
}

function displayTrackingResult(trackingCode) {
    const trackingData = DEMO_TRACKING[trackingCode];
    
    if (!trackingData) {
        elements.trackingResult.innerHTML = `
            <div class="tracking-not-found">
                <h4>Không tìm thấy thông tin</h4>
                <p>Mã vận đơn <strong>${trackingCode}</strong> không tồn tại hoặc chưa được cập nhật vào hệ thống.</p>
                <p>Vui lòng kiểm tra lại mã hoặc liên hệ hotline 1900 1234.</p>
            </div>
        `;
        return;
    }
    
    const timelineHTML = trackingData.timeline.map((item, index) => `
        <div class="timeline-item ${item.pending ? 'pending' : 'completed'}">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-time">${item.time || 'Dự kiến'}</div>
                <div class="timeline-status">${item.status}</div>
                <div class="timeline-location">${item.location}</div>
            </div>
        </div>
    `).join('');
    
    const resultHTML = `
        <div class="tracking-header">
            <h4>Mã vận đơn: ${trackingCode}</h4>
            <div class="tracking-status ${trackingData.status === 'Đã giao thành công' ? 'delivered' : 'in-transit'}">
                ${trackingData.status}
            </div>
        </div>
        <div class="tracking-info">
            <div class="current-location">
                <strong>Vị trí hiện tại:</strong> ${trackingData.location}
            </div>
            <div class="estimated-delivery">
                <strong>Thời gian giao hàng:</strong> ${trackingData.estimatedDelivery}
            </div>
        </div>
        <div class="tracking-timeline">
            <h5>Lịch trình vận chuyển</h5>
            <div class="timeline">
                ${timelineHTML}
            </div>
        </div>
    `;
    
    elements.trackingResult.innerHTML = resultHTML;
}

// ===== CONTACT FORM =====
function handleQuickContact(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message')
    };
    
    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
        return;
    }
    
    // Validate email
    if (!isValidEmail(data.email)) {
        showNotification('Email không hợp lệ', 'error');
        return;
    }
    
    // Validate phone
    if (!isValidPhone(data.phone)) {
        showNotification('Số điện thoại không hợp lệ', 'error');
        return;
    }
    
    // Show loading
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang gửi...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        showNotification('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.', 'success');
        e.target.reset();
    }, 2000);
}

// ===== LANGUAGE SWITCHER =====
function toggleLanguage() {
    currentLanguage = currentLanguage === 'vi' ? 'en' : 'vi';
    
    // Update language switcher text
    elements.langSwitch.textContent = currentLanguage === 'vi' ? 'EN' : 'VI';
    
    // Update content based on current language
    updateLanguageContent();
    
    // Store language preference
    localStorage.setItem('preferred-language', currentLanguage);
    
    showNotification(
        currentLanguage === 'vi' 
            ? 'Đã chuyển sang tiếng Việt' 
            : 'Switched to English',
        'info'
    );
}

function updateLanguageContent() {
    const content = LANGUAGE_CONTENT[currentLanguage];
    
    // Update navigation
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (content[key]) {
            element.innerHTML = content[key];
        }
    });
    
    // Update document title
    document.title = currentLanguage === 'vi' 
        ? 'HOLO Group - Kết nối hành trình, Tăng tốc tương lai'
        : 'HOLO Group - Connecting journeys, Accelerating the future';
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^(\+84|84|0)?[1-9][0-9]{8,9}$/;
    return phoneRegex.test(phone.replace(/[\s\-\.]/g, ''));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== LOAD SAVED PREFERENCES =====
window.addEventListener('load', () => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage !== currentLanguage) {
        toggleLanguage();
    }
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Optimize scroll event with throttling
window.addEventListener('scroll', throttle(handleScroll, 16));

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'assets/images/hero-bg.jpg',
        'assets/images/logo.png',
        'assets/images/hero-bus.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Call preload on page load
window.addEventListener('load', preloadImages);

// ===== SERVICE WORKER REGISTRATION (PWA SUPPORT) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===== ANALYTICS AND TRACKING =====
function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Custom analytics
    console.log('Event tracked:', eventName, eventData);
}

// Track form submissions
document.addEventListener('submit', (e) => {
    const formId = e.target.id;
    if (formId) {
        trackEvent('form_submit', {
            form_id: formId,
            page_location: window.location.href
        });
    }
});

// Track button clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
        trackEvent('button_click', {
            button_text: e.target.textContent.trim(),
            button_class: e.target.className,
            page_location: window.location.href
        });
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    
    // Send error to monitoring service (if available)
    if (typeof errorReporting !== 'undefined') {
        errorReporting.captureException(e.error);
    }
});

// ===== ACCESSIBILITY IMPROVEMENTS =====
// Skip to main content functionality
function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Bỏ qua đến nội dung chính';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', addSkipLink);

// Keyboard navigation for dropdowns
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close all dropdowns
        document.querySelectorAll('.dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        
        // Close mobile menu
        if (elements.navMenu && elements.navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
});

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        isValidPhone,
        formatDate,
        getLocationName,
        DEMO_ROUTES,
        DEMO_TRACKING
    };
}
