document.addEventListener('DOMContentLoaded', () => {

    // --- Mock Data ---
    const products = [
        {
            id: 1,
            name: "Modern Leather Sofa",
            category: "home",
            price: 499,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop",
            rating: 4.5,
            badge: "new"
        },
        {
            id: 2,
            name: "Wireless Noise Cancelling Headphones",
            category: "electronics",
            price: 249,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
            rating: 4.8,
            badge: "popular"
        },
        {
            id: 3,
            name: "Slim Fit Cotton Shirt",
            category: "fashion",
            price: 45,
            image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop",
            rating: 4.2,
            badge: "sale"
        },
        {
            id: 4,
            name: "Minimalist Gold Watch",
            category: "accessories",
            price: 129,
            image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop",
            rating: 4.9,
            badge: ""
        },
        {
            id: 5,
            name: "Smart Speaker Mini",
            category: "electronics",
            price: 79,
            image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=1000&auto=format&fit=crop",
            rating: 4.4,
            badge: "new"
        },
        {
            id: 6,
            name: "Ceramic Coffee Mug Set",
            category: "home",
            price: 35,
            image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1000&auto=format&fit=crop",
            rating: 4.6,
            badge: ""
        },
        {
            id: 7,
            name: "Leather Messenger Bag",
            category: "accessories",
            price: 180,
            image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop",
            rating: 4.7,
            badge: "popular"
        },
        {
            id: 8,
            name: "Summer Floral Dress",
            category: "fashion",
            price: 65,
            image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop",
            rating: 4.3,
            badge: "sale"
        }
    ];

    // --- State ---
    let cartCount = 0;
    let currentFilter = 'all';
    let currentSort = 'default';

    // --- Selectors ---
    const productGrid = document.getElementById('productGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortProducts');
    const cartCountEl = document.getElementById('cart-count');
    const toast = document.getElementById('toast');
    const loadMoreBtn = document.getElementById('loadMore');

    // --- Functions ---

    // 1. Render Products
    function renderProducts(productsToRender) {
        productGrid.innerHTML = '';

        if (productsToRender.length === 0) {
            productGrid.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No products found.</p>';
            return;
        }

        productsToRender.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image">
                    ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge}</span>` : ''}
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-actions">
                        <button class="action-btn" title="Add to Wishlist"><i class="ri-heart-line"></i></button>
                        <button class="action-btn" title="Quick View"><i class="ri-eye-line"></i></button>
                    </div>
                </div>
                <div class="product-details">
                    <div class="rating">
                        ${generateStars(product.rating)}
                        <span>(${product.rating})</span>
                    </div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="price-row">
                        <span class="price">$${product.price}</span>
                        <button class="add-cart-btn" onclick="addToCart()"><i class="ri-shopping-cart-2-line"></i> Add</button>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });
    }

    // Helper: Generate Star Rating HTML
    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars += '<i class="ri-star-fill"></i>';
            } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
                stars += '<i class="ri-star-half-line"></i>';
            } else {
                stars += '<i class="ri-star-line" style="color: #e2e8f0;"></i>';
            }
        }
        return stars;
    }

    // 2. Filter Logic
    function filterProducts() {
        let filtered = products;

        // Apply Filter (Badge/Category simulation based on buttons)
        if (currentFilter !== 'all') {
            filtered = products.filter(p => {
                if (currentFilter === 'new') return p.badge === 'new';
                if (currentFilter === 'sale') return p.badge === 'sale';
                if (currentFilter === 'popular') return p.badge === 'popular';
                return true;
            });
        }

        // Apply Sorting
        if (currentSort === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (currentSort === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (currentSort === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        renderProducts(filtered);
    }

    // 3. Event Listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI Update
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Logic Update
            currentFilter = btn.getAttribute('data-filter');
            filterProducts();
        });
    });

    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterProducts();
    });

    // 4. Add to Cart Functionality (Global Scope for inline onclick)
    window.addToCart = function () {
        cartCount++;
        cartCountEl.innerText = cartCount;

        // Button Animation Effect (Find the button that triggered it - simplified for demo)
        // Ideally pass 'this' context, but for simplicity:

        // Show Toast
        showToast();
    };

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Load More (Dummy functionality)
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerText = 'Loading...';
            setTimeout(() => {
                // Here we would fetch more data
                // For demo, just duplicate existing products to show "more"
                const moreProducts = products.map(p => ({ ...p, id: p.id + 10 })); // Clone with new IDs
                renderProducts([...products, ...moreProducts]); // Re-render with more items (ignoring current filter for simplicity of demo)
                loadMoreBtn.style.display = 'none'; // Hide button after loading
            }, 1000);
        });
    }

    // --- Init ---
    renderProducts(products); // Initial Render

    // Transparent to Solid Navbar on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

});
