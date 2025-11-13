// Real Estate Website - Final Version
$(document).ready(function() {
    // ===== THEME TOGGLE =====
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }

    function updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
            themeToggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        }
    }

    initTheme();
    $('#themeToggle').on('click', toggleTheme);

    // ===== PROPERTIES DATA =====
    const properties = [
        {
            id: 1, title: "Modern Downtown Apartment", price: 350000, type: "apartment",
            bedrooms: 3, bathrooms: 2, img: "photo-750x470.png", location: "City Center", featured: true
        },
        {
            id: 2, title: "Luxury Family Villa", price: 750000, type: "villa",
            bedrooms: 5, bathrooms: 3, img: "photo-750x470.jpg", location: "Suburbs", featured: true
        },
        {
            id: 3, title: "Cozy Studio Apartment", price: 180000, type: "apartment",
            bedrooms: 1, bathrooms: 1, img: "UlZVT2Q3T2FaUHExR0xkQ0tZV003WFRJVXNvVmxJc2I4dTRSOFFPY2lFakl3cFlkcGlCMTlWMnZOL0JVU3VLZjR3czZCSHpSc0RHK0ZlcnJIL2dFY0NNNkdCYkhOZWtqZy9lSjdYSDJqa3c9.jpg",
            location: "Downtown", featured: false
        },
        {
            id: 4, title: "Spacious City Apartment", price: 450000, type: "apartment",
            bedrooms: 3, bathrooms: 2, img: "photo-750x470.png", location: "Financial District", featured: true
        },
        {
            id: 5, title: "Modern 3-Bedroom Apartment", price: 380000, type: "apartment",
            bedrooms: 3, bathrooms: 2, img: "photo-750x470.jpg", location: "Riverside", featured: false
        },
        {
            id: 6, title: "Penthouse with City View", price: 1200000, type: "apartment",
            bedrooms: 4, bathrooms: 3, img: "photo-750x470.png", location: "Downtown Heights", featured: true
        },
        {
            id: 7, title: "Suburban Family House", price: 520000, type: "house",
            bedrooms: 4, bathrooms: 2, img: "photo-750x470.jpg", location: "Green Valley", featured: false
        },
        {
            id: 8, title: "Luxury Beach Villa", price: 950000, type: "villa",
            bedrooms: 6, bathrooms: 4, img: "UlZVT2Q3T2FaUHExR0xkQ0tZV003WFRJVXNvVmxJc2I4dTRSOFFPY2lFakl3cFlkcGlCMTlWMnZOL0JVU3VLZjR3czZCSHpSc0RHK0ZlcnJIL2dFY0NNNkdCYkhOZWtqZy9lSjdYSDJqa3c9.jpg",
            location: "Coastline", featured: true
        }
    ];

    // ===== AUTO-FILTER SYSTEM =====
    function applyFilters() {
        const typeFilter = $('#typeFilter').val();
        const priceFilter = $('#priceFilter').val();
        const bedroomFilter = $('#bedroomFilter').val();

        const filtered = properties.filter(property => {
            if (typeFilter !== 'all' && property.type !== typeFilter) return false;
            if (priceFilter !== 'all') {
                if (priceFilter.includes('-')) {
                    const [min, max] = priceFilter.split('-').map(Number);
                    if (property.price < min || property.price > max) return false;
                } else {
                    if (property.price < parseInt(priceFilter)) return false;
                }
            }
            if (bedroomFilter !== 'all') {
                const beds = parseInt(bedroomFilter);
                if (beds === 4 && property.bedrooms < 4) return false;
                if (beds !== 4 && property.bedrooms !== beds) return false;
            }
            return true;
        });

        displayProperties(filtered);
    }

    function displayProperties(propertiesToShow) {
        const grid = $('#propertiesGrid');
        grid.empty();

        $('#resultsCount').text(`Showing ${propertiesToShow.length} of ${properties.length} properties`);

        if (propertiesToShow.length === 0) {
            grid.html(`
                <div class="col-12 text-center py-5">
                    <h4>No properties found</h4>
                    <p class="text-muted">Try adjusting your filters</p>
                </div>
            `);
            return;
        }

        let html = '';
        propertiesToShow.forEach(property => {
            html += `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card property-card h-100">
                        <img src="${property.img}" class="card-img-top" alt="${property.title}">
                        <div class="card-body">
                            <h5 class="card-title">${property.title}</h5>
                            <p class="card-text text-primary fw-bold">$${property.price.toLocaleString()}</p>
                            <p class="card-text">
                                <small class="text-muted">
                                    ${property.bedrooms} Bed • ${property.bathrooms} Bath • ${property.type}
                                </small>
                            </p>
                            <p class="card-text"><small>Location: ${property.location}</small></p>
                            <div class="d-flex justify-content-between align-items-center">
                                <a href="property-details.html?id=${property.id}" class="btn btn-outline-primary btn-sm">View Details</a>
                                ${property.featured ? '<span class="badge bg-warning text-dark">Featured</span>' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        grid.html(html);
    }

    // Initialize listings page
    if ($('#propertiesGrid').length) {
        displayProperties(properties);
        $('#typeFilter, #priceFilter, #bedroomFilter').on('change', applyFilters);
    }

    // ===== FORM VALIDATION =====
    if ($('#contactForm').length) {
        $('#contactForm').on('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                const btn = $(this).find('button[type="submit"]');
                const originalText = btn.html();
                
                btn.html('<span class="spinner-border spinner-border-sm"></span> Sending...').prop('disabled', true);
                
                setTimeout(() => {
                    showMessage('Message sent successfully!', 'success');
                    this.reset();
                    btn.html(originalText).prop('disabled', false);
                }, 1500);
            }
        });
    }

    if ($('.needs-validation').length) {
        $('.needs-validation').on('submit', function(e) {
            if (!this.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            $(this).addClass('was-validated');
        });
    }

    function validateForm(form) {
        let isValid = true;
        $(form).find('[required]').each(function() {
            if (!this.value.trim()) {
                $(this).addClass('is-invalid');
                isValid = false;
            } else {
                $(this).removeClass('is-invalid');
            }
        });
        return isValid;
    }

    function showMessage(text, type) {
        $('.custom-notification').remove();
        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const notification = $(`
            <div class="alert ${alertClass} custom-notification alert-dismissible fade show position-fixed" 
                 style="top: 100px; right: 20px; z-index: 1060; min-width: 300px;">
                ${text}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `).hide().appendTo('body').slideDown(300);
        
        setTimeout(() => notification.alert('close'), 4000);
    }

    // ===== BACK TO TOP BUTTON =====
    $(window).scroll(function() {
        $('#backToTop').toggle($(this).scrollTop() > 300);
    });

    if (!$('#backToTop').length) {
        $('body').append(`
            <button id="backToTop" class="btn btn-primary position-fixed" 
                    style="bottom: 20px; right: 20px; display: none; z-index: 1000; border-radius: 50%; width: 50px; height: 50px;">
                ↑
            </button>
        `);
        
        $('#backToTop').on('click', function() {
            $('html, body').animate({ scrollTop: 0 }, 800);
        });
    }

    console.log('Website initialized successfully!');
});