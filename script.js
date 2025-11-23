
function initGravityParticles() {
    const canvas = document.getElementById('gravity-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particlesArray;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.baseX = x;
            this.baseY = y;
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }
            
            this.x += this.directionX;
            this.y += this.directionY;

            if (this.x < 0 || this.x > canvas.width) this.directionX = -this.directionX;
            if (this.y < 0 || this.y > canvas.height) this.directionY = -this.directionY;

            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;

        const isCartPage = document.body.id === 'page-cart';
        const isPinkTheme = document.body.classList.contains('vibrant-mode') || document.body.classList.contains('pink-theme');
        const isBlackTheme = document.body.classList.contains('black-theme');

        let pColor;

        if (isCartPage) {
            pColor = 'rgba(255, 87, 34, 0.6)'; 
        } 
        else if (isPinkTheme) {
            pColor = 'rgba(255, 255, 255, 0.6)'; 
        } 
        else if (isBlackTheme) {
            pColor = 'rgba(255, 87, 34, 0.6)'; 
        } 
        else {
            pColor = 'rgba(255, 87, 34, 0.4)'; 
        }

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 3) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, pColor));
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    window.addEventListener('resize', function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = 150;
        initParticles();
    });

    initParticles();
    animateParticles();
}

(function() {
    if (document.getElementById('gravity-canvas')) {
        initGravityParticles();
    } else {
        document.addEventListener('DOMContentLoaded', initGravityParticles);
        window.addEventListener('load', initGravityParticles);
    }
})();
function toggleMenu() {
    const links = document.querySelector('.pill-links');
    links.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.pill-links a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('.pill-links').classList.remove('open');
        });
    });
    
    if (document.getElementById('cart-body')) {
        displayCart();
    }
});
class TrailingDot {
    constructor() {
        this.dot = document.createElement('div');
        this.dot.classList.add('trailing-dot');
        document.body.appendChild(this.dot);
        
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        document.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        });
        
        this.animate();
    }
    
    animate() {
        this.x += (this.targetX - this.x) * 0.15;
        this.y += (this.targetY - this.y) * 0.15;
        
        this.dot.style.left = this.x + 'px';
        this.dot.style.top = this.y + 'px';
        
        requestAnimationFrame(() => this.animate());
    }
}

const productsDB = {
    'pkg-landing': { name: "Landing Page Package", price: 2000 },
    'pkg-product': { name: "Product Design Package", price: 5000 },
    'plan-sub': { name: "Monthly Subscription", price: 1900 },
    'plan-essentials': { name: "Essentials Plan", price: 1900 },
    'plan-pro': { name: "Pro Growth Plan", price: 3500 },
    'plan-enterprise': { name: "Enterprise Plan", price: 5900 }
};
function addToCart(productId, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const productInfo = productsDB[productId] || { name: productId, price: price };
    
    const item = {
        id: productId,
        name: productInfo.name,
        price: price,
        qty: 1
    };
    
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    alert(`Added ${productId} to cart!`);
}
function setBilling(planType) {
    const container = document.getElementById('toggle-container');
    const monthlyBtn = document.getElementById('btn-monthly');
    const yearlyBtn = document.getElementById('btn-yearly');
    
    const amounts = document.querySelectorAll('.amount');
    const periods = document.querySelectorAll('.period');
    const subscribeBtn = document.getElementById('subscribe-btn');
    
    const removeCommas = (str) => parseInt(str.replace(/,/g, ''), 10);
    
    if (planType === 'yearly') {
        container.classList.add('show-yearly');
        monthlyBtn.classList.remove('active');
        yearlyBtn.classList.add('active');
        
        amounts.forEach(amount => {
            const priceText = amount.getAttribute('data-yearly');
            amount.innerText = priceText;
            
            if (amount.id === 'current-price-display' && subscribeBtn) {
                subscribeBtn.setAttribute('data-price', removeCommas(priceText));
                subscribeBtn.setAttribute('data-billing', 'yearly');
            }
        });
        periods.forEach(period => { period.innerText = '/yr'; });

    } else {
        container.classList.remove('show-yearly');
        yearlyBtn.classList.remove('active');
        monthlyBtn.classList.add('active');
        
        amounts.forEach(amount => {
            const priceText = amount.getAttribute('data-monthly');
            amount.innerText = priceText;
            
            if (amount.id === 'current-price-display' && subscribeBtn) {
                subscribeBtn.setAttribute('data-price', removeCommas(priceText));
                subscribeBtn.setAttribute('data-billing', 'monthly');
            }
        });
        periods.forEach(period => { period.innerText = '/mo'; });
    }
}
function sendInquiry() {
    alert('Thank you for your interest! We will get back to you soon.');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartBody = document.getElementById('cart-body');
    const emptyMsg = document.getElementById('empty-msg');
    
    if (!cartBody) return;
    
    cartBody.innerHTML = '';
    
    if (cart.length === 0) {
        emptyMsg.style.display = 'block';
        cartBody.innerHTML = '';
    } else {
        emptyMsg.style.display = 'none';
        
        cart.forEach((item, index) => {
            const row = document.createElement('tr');
            const total = item.price;
            row.innerHTML = `
                <td>${item.id}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>1</td>
                <td>$${total.toFixed(2)}</td>
                <td><button class="btn-text" onclick="removeFromCart(${index})">Remove</button></td>
            `;
            cartBody.appendChild(row);
        });
    }
    
    updateCartSummary(cart);
}
function updateCartSummary(cart) {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.15;
    const discount = 0;
    const total = subtotal + tax - discount;
    
    const subTotalEl = document.getElementById('sub-total');
    const taxEl = document.getElementById('tax-amt');
    const discountEl = document.getElementById('discount-amt');
    const totalEl = document.getElementById('final-total');
    
    if (subTotalEl) subTotalEl.textContent = '$' + subtotal.toFixed(2);
    if (taxEl) taxEl.textContent = '$' + tax.toFixed(2);
    if (discountEl) discountEl.textContent = '-$' + discount.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        localStorage.removeItem('cart');
        updateCartCount();
        displayCart();
    }
}

function goToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty. Please add services first.');
        window.location.href = 'services.html';
    } else {
        window.location.href = 'checkout.html';
    }
}
function initiateCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty. Please add services first.');
        return;
    }

    const payInput = document.getElementById('pay-amount');
    const totalEl = document.getElementById('final-total');
    if (payInput && totalEl) {
        const totalValue = parseFloat(totalEl.textContent.replace(/[^0-9.-]+/g, '')) || 0;
        payInput.value = totalValue.toFixed(2);
        const form = document.getElementById('shipping-form');
        if (form) form.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.location.href = 'checkout.html';
    }
}

function confirmOrder() {
    const name = document.getElementById('ship-name');
    const email = document.getElementById('ship-email');
    const address = document.getElementById('ship-address');
    const city = document.getElementById('ship-city');
    const postal = document.getElementById('ship-postal');
    const payInput = document.getElementById('pay-amount');
    const totalEl = document.getElementById('final-total');

    if (!name || !email || !address || !city || !postal || !payInput || !totalEl) {
        alert('Checkout form or totals not available.');
        return;
    }

    if (!name.value.trim() || !email.value.trim() || !address.value.trim()) {
        alert('Please complete your shipping details.');
        return;
    }

    const entered = parseFloat(payInput.value) || 0;
    const expected = parseFloat(totalEl.textContent.replace(/[^0-9.-]+/g, '')) || 0;
    if (Math.abs(entered - expected) > 0.01) {
        const ok = confirm('The amount entered does not match the order total. Proceed anyway?');
        if (!ok) return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const order = {
        id: 'order_' + Date.now(),
        items: cart,
        shipping: {
            name: name.value.trim(),
            email: email.value.trim(),
            address: address.value.trim(),
            city: city.value.trim(),
            postal: postal.value.trim()
        },
        total: expected,
        date: new Date().toISOString()
    };
    localStorage.setItem('lastOrder', JSON.stringify(order));

    localStorage.removeItem('cart');
    updateCartCount();
    displayCart();

    alert('Order confirmed — thank you!');
    window.location.href = 'index.html';
}

function cancelCheckout() {
    const form = document.getElementById('shipping-form');
    if (form) form.reset();
}

function closeCheckout() {
    window.location.href = 'cart.html';
}
function addSubscriptionToCart() {
    const btn = document.getElementById('subscribe-btn');
    const planId = btn.getAttribute('data-plan-id');
    const price = parseInt(btn.getAttribute('data-price'), 10);
    const billingCycle = btn.getAttribute('data-billing');
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const customId = planId + '-' + billingCycle; 
    
    const existingItem = cart.find(item => item.id === customId);
    
    if (!existingItem) {
        const productName = 'PixelFlow Pro (' + billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1) + ')';
        
        cart.push({
            id: customId,
            name: productName,
            price: price,
            qty: 1
        });
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(productName + " added to your cart!");
    } else {
        alert("This subscription is already in your cart.");
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new TrailingDot();
    updateCartCount();
    initializePricingToggle();
    
    const themeKnob = document.getElementById('theme-knob');
    const themeText = document.getElementById('theme-text');
    const body = document.body;

    function updateLabel() {
        if (body.classList.contains('light-theme')) {
            themeText.textContent = "Light Mode";
        } else {
            themeText.textContent = "Dark Mode";
        }
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
        updateLabel();
    } else {
        body.classList.add('dark-theme');
    }

    if (themeKnob) {
        themeKnob.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            body.classList.toggle('dark-theme');
            
            updateLabel();
            
            if (body.classList.contains('light-theme')) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    window.addEventListener('mousemove', function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        if (cursorDot) {
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
        }

        if (cursorOutline) {
            try {
                cursorOutline.animate({
                    left: `${posX}px`,
                    top: `${posY}px`
                }, { duration: 500, fill: "forwards" });
            } catch (err) {
                cursorOutline.style.left = `${posX}px`;
                cursorOutline.style.top = `${posY}px`;
            }
        }
    });

    const interactiveElements = document.querySelectorAll('a, button, .toggle-option, .knob-switch');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });
});

function initializePricingToggle() {
    const billingToggle = document.getElementById('billing-toggle');
    if (!billingToggle) return;

    billingToggle.addEventListener('change', () => {
        const amounts = document.querySelectorAll('.amount');
        amounts.forEach(amount => {
            if (billingToggle.checked) {
                amount.textContent = amount.dataset.yearly;
            } else {
                amount.textContent = amount.dataset.monthly;
            }
        });
    });
}

function setBilling(planType) {
    const container = document.getElementById('toggle-container');
    const monthlyBtn = document.getElementById('btn-monthly');
    const yearlyBtn = document.getElementById('btn-yearly');
    
    const amounts = document.querySelectorAll('.amount');
    const periods = document.querySelectorAll('.period');

    if (planType === 'yearly') {
        container.classList.add('show-yearly');
        
        monthlyBtn.classList.remove('active');
        yearlyBtn.classList.add('active');
        
        amounts.forEach(amount => {
            amount.innerText = amount.getAttribute('data-yearly');
        });
        periods.forEach(period => {
            period.innerText = '/yr';
        });

    } else {
        container.classList.remove('show-yearly');
        
        yearlyBtn.classList.remove('active');
        monthlyBtn.classList.add('active');
        
        amounts.forEach(amount => {
            amount.innerText = amount.getAttribute('data-monthly');
        });
        periods.forEach(period => {
            period.innerText = '/mo';
        });
    }
}

const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.step-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transition = 'all 0.6s ease-out';
        card.style.transform = (card.style.transform || '') + ' translateY(50px)';
        observer.observe(card);
    });
});

document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');

    if (loginForm && registerForm) {

        tabLogin.addEventListener('click', () => {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
        });

        tabRegister.addEventListener('click', () => {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            tabLogin.classList.remove('active');
            tabRegister.classList.add('active');
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const user = document.getElementById('login-user').value;
            const pass = document.getElementById('login-pass').value;

            if (user === '') {
                showError('error-login-user', 'Username is required');
                isValid = false;
            } else {
                showError('error-login-user', '');
            }

            if (pass === '') {
                showError('error-login-pass', 'Password is required');
                isValid = false;
            } else {
                showError('error-login-pass', '');
            }

            if (isValid) {
                alert('Login Successful! (Simulation)');
            }
        });

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const name = document.getElementById('reg-name').value;
            const dob = document.getElementById('reg-dob').value;
            const email = document.getElementById('reg-email').value;
            const user = document.getElementById('reg-user').value;
            const pass = document.getElementById('reg-pass').value;
            const conf = document.getElementById('reg-pass-conf').value;

            if (name.length < 2) {
                showError('error-reg-name', 'Name must be at least 2 characters');
                isValid = false;
            } else {
                showError('error-reg-name', '');
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showError('error-reg-email', 'Please enter a valid email');
                isValid = false;
            } else {
                showError('error-reg-email', '');
            }

            if (pass !== conf || pass === '') {
                showError('error-reg-pass', 'Passwords do not match or are empty');
                isValid = false;
            } else {
                showError('error-reg-pass', '');
            }

            if (dob) {
                const birthDate = new Date(dob);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--; 
                }

                if (age < 18) {
                    showError('error-reg-dob', 'You must be 18+ to register');
                    isValid = false;
                } else {
                    showError('error-reg-dob', '');
                }
            } else {
                showError('error-reg-dob', 'Date of birth required');
                isValid = false;
            }

            if (isValid) {
                alert('Registration Successful! Welcome, ' + name);
            }
        });
    }

    function showError(elementId, message) {
        const el = document.getElementById(elementId);
        if (el) {
            el.textContent = message;
            el.style.display = message ? 'block' : 'none'; 
        }
    }
});

function filterWorks(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(category)) {
            btn.classList.add('active');
        }
    });

    const items = document.querySelectorAll('.work-card');
    
    items.forEach(item => {
        item.style.animation = 'none';
        item.offsetHeight;
        item.style.animation = 'fadeInUp 0.5s forwards';

        if (category === 'all') {
            item.style.display = 'block';
        } else {
            if (item.classList.contains('category-' + category)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        }
    });
}

function viewCaseStudy(title) {
    alert('Opening case study: ' + title);
}

document.addEventListener('DOMContentLoaded', () => {
    
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const visitorName = document.getElementById('visitor-name');
            const visitorEmail = document.getElementById('visitor-email');
            const visitorMessage = document.getElementById('visitor-message');
            
            let isValid = true;
            
            document.getElementById('error-name').style.display = 'none';
            document.getElementById('error-email').style.display = 'none';
            document.getElementById('error-message').style.display = 'none';
            
            if (visitorName.value.trim() === '') {
                showContactError('error-name', 'Name is required');
                isValid = false;
            } else if (visitorName.value.trim().length < 2) {
                showContactError('error-name', 'Name must be at least 2 characters');
                isValid = false;
            }
            
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (visitorEmail.value.trim() === '') {
                showContactError('error-email', 'Email is required');
                isValid = false;
            } else if (!emailPattern.test(visitorEmail.value.trim())) {
                showContactError('error-email', 'Please enter a valid email address');
                isValid = false;
            }
            
            if (visitorMessage.value.trim() === '') {
                showContactError('error-message', 'Message is required');
                isValid = false;
            } else if (visitorMessage.value.trim().length < 10) {
                showContactError('error-message', 'Message must be at least 10 characters');
                isValid = false;
            }
            
            if (isValid) {
                alert(`Thank you, ${visitorName.value}! Your message has been sent. We will contact you soon at ${visitorEmail.value}`);
                contactForm.reset();
            }
        });
    }
});

function showContactError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}