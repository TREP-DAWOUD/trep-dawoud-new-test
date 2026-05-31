/* =====================================================
   BOOKING PAGE - JavaScript
   Independent booking system with filtering and form handling
   ===================================================== */

(function() {
    'use strict';

    // ======================== TRIPS DATA ========================
    const tripsData = [
        {
            id: 1,
            name: 'جبل سلامة',
            description: 'رحلة ممتعة للمبتدئين مع مناظر طبيعية خلابة',
            difficulty: 'سهل',
            price: 350,
            duration: 'يوم',
            guides: 2,
            groupSize: '8-12'
        },
        {
            id: 2,
            name: 'جبل تهامة',
            description: 'تحدٍ مثير مع مناظر جبلية رائعة',
            difficulty: 'متوسط',
            price: 650,
            duration: 'يومين',
            guides: 2,
            groupSize: '6-10'
        },
        {
            id: 3,
            name: 'جبل فيفاء',
            description: 'مغامرة متقدمة للمتسلقين الخبراء',
            difficulty: 'صعب',
            price: 950,
            duration: 'ثلاثة',
            guides: 3,
            groupSize: '4-8'
        },
        {
            id: 4,
            name: 'جبل الشعراء',
            description: 'رحلة رومانسية مع مناظر غروب الشمس الخاصة',
            difficulty: 'سهل',
            price: 400,
            duration: 'يوم',
            guides: 1,
            groupSize: '6-10'
        },
        {
            id: 5,
            name: 'جبل طويق',
            description: 'رحلة استكشافية عبر جبال الحجر',
            difficulty: 'متوسط',
            price: 750,
            duration: 'يومين',
            guides: 3,
            groupSize: '8-12'
        },
        {
            id: 6,
            name: 'جبل المنجزة',
            description: 'تسلق متقدم مع تدريبات متخصصة',
            difficulty: 'صعب',
            price: 1200,
            duration: 'ثلاثة',
            guides: 4,
            groupSize: '4-6'
        },
        {
            id: 7,
            name: 'جبل أبيض',
            description: 'رحلة تصوير ودراسة للنباتات الجبلية',
            difficulty: 'متوسط',
            price: 550,
            duration: 'يومين',
            guides: 2,
            groupSize: '10-15'
        },
        {
            id: 8,
            name: 'جبل القعقاع',
            description: 'رحلة خيمة وتخييم تحت النجوم',
            difficulty: 'سهل',
            price: 600,
            duration: 'يومين',
            guides: 2,
            groupSize: '8-12'
        }
    ];

    // ======================== STATE MANAGEMENT ========================
    let currentFilters = {
        difficulty: '',
        duration: '',
        maxPrice: 5000
    };

    let selectedTrip = null;

    // ======================== DOM ELEMENTS ========================
    const bookingTripsContainer = document.getElementById('bookingTripsContainer');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const difficultyFilter = document.getElementById('difficulty');
    const durationFilter = document.getElementById('duration');
    const priceFilter = document.getElementById('price');
    const priceValue = document.getElementById('priceValue');
    const resetFiltersBtn = document.getElementById('resetFilters');
    
    const bookingModal = document.getElementById('bookingModal');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBookingBtn = document.getElementById('cancelBooking');
    const bookingForm = document.getElementById('bookingForm');
    
    const successMessage = document.getElementById('successMessage');
    const closeSuccessBtn = document.getElementById('closeSuccess');

    // ======================== FILTER EVENTS ========================
    difficultyFilter.addEventListener('change', (e) => {
        currentFilters.difficulty = e.target.value;
        renderTrips();
    });

    durationFilter.addEventListener('change', (e) => {
        currentFilters.duration = e.target.value;
        renderTrips();
    });

    priceFilter.addEventListener('input', (e) => {
        currentFilters.maxPrice = parseInt(e.target.value);
        priceValue.textContent = currentFilters.maxPrice === 5000 ? 'الكل' : `${currentFilters.maxPrice} د.م.`;
        renderTrips();
    });

    resetFiltersBtn.addEventListener('click', () => {
        currentFilters = {
            difficulty: '',
            duration: '',
            maxPrice: 5000
        };
        difficultyFilter.value = '';
        durationFilter.value = '';
        priceFilter.value = '5000';
        priceValue.textContent = 'الكل';
        renderTrips();
    });

    // ======================== MODAL EVENTS ========================
    closeModalBtn.addEventListener('click', closeModal);
    cancelBookingBtn.addEventListener('click', closeModal);
    closeSuccessBtn.addEventListener('click', closeSuccessModal);

    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            closeModal();
        }
    });

    // ======================== FORM SUBMISSION ========================
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleBookingSubmit();
    });

    // ======================== PARTICIPANT COUNT CHANGE ========================
    const participantsInput = document.getElementById('participants');
    participantsInput.addEventListener('change', updateBookingSummary);

    // ======================== FILTERING LOGIC ========================
    function getFilteredTrips() {
        return tripsData.filter(trip => {
            const difficultyMatch = !currentFilters.difficulty || trip.difficulty === currentFilters.difficulty;
            const durationMatch = !currentFilters.duration || trip.duration === currentFilters.duration;
            const priceMatch = trip.price <= currentFilters.maxPrice;
            
            return difficultyMatch && durationMatch && priceMatch;
        });
    }

    // ======================== RENDER TRIPS ========================
    function renderTrips() {
        const filteredTrips = getFilteredTrips();
        bookingTripsContainer.innerHTML = '';

        if (filteredTrips.length === 0) {
            noResultsMessage.style.display = 'block';
            return;
        }

        noResultsMessage.style.display = 'none';

        filteredTrips.forEach(trip => {
            const tripCard = createTripCard(trip);
            bookingTripsContainer.appendChild(tripCard);
        });
    }

    // ======================== CREATE TRIP CARD ========================
    function createTripCard(trip) {
        const card = document.createElement('div');
        card.className = 'booking-trip-card reveal';
        
        const difficultyClass = getDifficultyClass(trip.difficulty);
        const icon = getTripIcon(trip.name);
        
        card.innerHTML = `
            <div class="trip-image">${icon}</div>
            <div class="trip-content">
                <div class="trip-header">
                    <h3 class="trip-name">${trip.name}</h3>
                    <span class="trip-difficulty difficulty-${difficultyClass}">${trip.difficulty}</span>
                </div>
                <p class="trip-description">${trip.description}</p>
                <div class="trip-details">
                    <div class="detail-item">
                        <div class="detail-label">المدة</div>
                        <div class="detail-value">${formatDuration(trip.duration)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">حجم المجموعة</div>
                        <div class="detail-value">${trip.groupSize}</div>
                    </div>
                </div>
                <div class="trip-price">${trip.price} د.م.</div>
                <div class="trip-actions">
                    <button class="btn btn-accent glow-btn" data-book-trip="${trip.id}">احجز الآن</button>
                    <button class="btn btn-secondary" data-view-details="${trip.id}">التفاصيل</button>
                </div>
            </div>
        `;

        // Book button event
        card.querySelector(`[data-book-trip]`).addEventListener('click', () => {
            openBookingModal(trip);
        });

        // Details button event
        card.querySelector(`[data-view-details]`).addEventListener('click', () => {
            openBookingModal(trip);
        });

        return card;
    }

    // ======================== HELPER FUNCTIONS ========================
    function getDifficultyClass(difficulty) {
        const map = {
            'سهل': 'easy',
            'متوسط': 'medium',
            'صعب': 'hard'
        };
        return map[difficulty] || 'easy';
    }

    function getTripIcon(tripName) {
        const icons = {
            'جبل سلامة': '🏔️',
            'جبل تهامة': '⛰️',
            'جبل فيفاء': '🗻',
            'جبل الشعراء': '🌄',
            'جبل طويق': '🏕️',
            'جبل المنجزة': '🧗',
            'جبل أبيض': '🦅',
            'جبل القعقاع': '⛺'
        };
        return icons[tripName] || '🏔️';
    }

    function formatDuration(duration) {
        const map = {
            'يوم': 'يوم واحد',
            'يومين': 'يومين',
            'ثلاثة': '3 أيام'
        };
        return map[duration] || duration;
    }

    // ======================== MODAL FUNCTIONS ========================
    function openBookingModal(trip) {
        selectedTrip = trip;
        
        // Set modal header
        document.getElementById('modalTripName').textContent = trip.name;
        document.getElementById('modalTripSubtitle').textContent = `${formatDuration(trip.duration)} - مجموعة ${trip.groupSize}`;
        
        // Set form fields
        document.getElementById('tripName').value = trip.name;
        document.getElementById('tripPrice').value = `${trip.price} د.م.`;
        document.getElementById('participants').value = 1;
        
        // Reset form
        bookingForm.reset();
        document.querySelector('input[name="experience"]:first-of-type').checked = true;
        
        updateBookingSummary();
        bookingModal.classList.add('active');
    }

    function closeModal() {
        bookingModal.classList.remove('active');
        selectedTrip = null;
    }

    function closeSuccessModal() {
        successMessage.classList.remove('active');
    }

    // ======================== UPDATE BOOKING SUMMARY ========================
    function updateBookingSummary() {
        if (!selectedTrip) return;

        const price = selectedTrip.price;
        const participants = parseInt(document.getElementById('participants').value) || 1;
        const total = price * participants;

        document.getElementById('summaryBasePrice').textContent = `${price} د.م.`;
        document.getElementById('summaryParticipants').textContent = participants;
        document.getElementById('summaryTotal').textContent = `${total} د.م.`;
    }

    // ======================== HANDLE FORM SUBMISSION ========================
    function handleBookingSubmit() {
        // Validation
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const age = document.getElementById('age').value;
        const terms = document.getElementById('terms').checked;

        if (!fullName || !email || !phone || !age || !terms) {
            alert('يرجى ملء جميع الحقول المطلوبة والموافقة على الشروط');
            return;
        }

        // Prepare booking data
        const bookingData = {
            trip: selectedTrip.name,
            price: selectedTrip.price,
            participants: document.getElementById('participants').value,
            departureDate: document.getElementById('departureDate').value,
            fullName: fullName,
            email: email,
            phone: phone,
            age: age,
            experience: document.querySelector('input[name="experience"]:checked').value,
            notes: document.getElementById('notes').value,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage (for demo purposes)
        saveBooking(bookingData);

        // Show success message
        closeModal();
        showSuccessMessage();

        // Log booking data
        console.log('Booking submitted:', bookingData);
    }

    // ======================== SAVE BOOKING ========================
    function saveBooking(bookingData) {
        const bookings = JSON.parse(localStorage.getItem('trep-dawoud-bookings') || '[]');
        bookings.push(bookingData);
        localStorage.setItem('trep-dawoud-bookings', JSON.stringify(bookings));
    }

    // ======================== SHOW SUCCESS MESSAGE ========================
    function showSuccessMessage() {
        successMessage.classList.add('active');
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            closeSuccessModal();
        }, 5000);
    }

    // ======================== INITIALIZATION ========================
    function init() {
        renderTrips();
        updateBookingSummary();
        
        // Log available trips
        console.log('Available trips loaded:', tripsData.length);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
