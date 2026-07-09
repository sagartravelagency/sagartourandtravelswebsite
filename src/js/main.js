/* ============================================
   SAGAR TOUR AND TRAVELS — MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initScrollReveal();
  initFAQ();
  initFareCalculator();
  initGA4Events();
});

/* ════════════ HEADER SCROLL ════════════ */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ════════════ MOBILE MENU ════════════ */
function initMobileMenu() {
  const toggle = document.querySelector('.header__toggle');
  const menu = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ════════════ SCROLL REVEAL ════════════ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ════════════ FAQ ACCORDION ════════════ */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(i => i.classList.remove('active'));

      // Toggle current
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ════════════ FARE CALCULATOR ════════════ */
function initFareCalculator() {
  const form = document.getElementById('fare-calculator');
  if (!form) return;

  const vehicleSelect = document.getElementById('calc-vehicle');
  const tripTypeSelect = document.getElementById('calc-trip-type');
  const distanceInput = document.getElementById('calc-distance');
  const calcBtn = document.getElementById('calc-btn');
  const resultDiv = document.getElementById('calc-result');
  const leadDiv = document.getElementById('calc-lead');

  if (!vehicleSelect || !tripTypeSelect || !distanceInput || !calcBtn) return;

  // Rate data (from Section 8 of the spec)
  const rates = {
    standard: {
      sedan: { perKm: 12, local: 2400, nightCharge: 300, minKm: 250, localMinKm: 120 },
      suv: { perKm: 15, local: 3000, nightCharge: 300, minKm: 250, localMinKm: 120 },
      'innova-crysta': { perKm: 18, local: 3600, nightCharge: 300, minKm: 250, localMinKm: 120 },
      'innova-hycross': { perKm: 22, local: 4400, nightCharge: 300, minKm: 250, localMinKm: 120 },
      fortuner: { perKm: 50, local: 9000, nightCharge: 300, minKm: 250, localMinKm: 120 },
      'premium-sedan': { perKm: 27, local: 5400, nightCharge: 500, minKm: 250, localMinKm: 120 },
    },
    wedding: {
      sedan: { perKm: 12, local: 7500, nightCharge: 500, minKm: 250 },
      suv: { perKm: 15, local: 9500, nightCharge: 500, minKm: 250 },
      'innova-crysta': { perKm: 18, local: 11000, nightCharge: 500, minKm: 250 },
      'innova-hycross': { perKm: 22, local: 14000, nightCharge: 500, minKm: 250 },
      fortuner: { perKm: 50, local: 25000, nightCharge: 500, minKm: 250 },
      'premium-sedan': { perKm: 28, local: 13000, nightCharge: 500, minKm: 250 },
    }
  };

  tripTypeSelect.addEventListener('change', () => {
    const daysContainer = document.getElementById('calc-days-container');
    if (daysContainer) {
      if (tripTypeSelect.value === 'outstation') {
        daysContainer.style.display = 'block';
      } else {
        daysContainer.style.display = 'none';
      }
    }
  });

  calcBtn.addEventListener('click', () => {
    const vehicle = vehicleSelect.value;
    const tripType = tripTypeSelect.value;
    const distance = parseInt(distanceInput.value);
    const daysContainer = document.getElementById('calc-days-container');
    const daysInput = document.getElementById('calc-days');
    const days = daysInput && daysContainer.style.display !== 'none' ? parseInt(daysInput.value) || 1 : 1;

    if (!vehicle || !tripType || !distance || distance <= 0) {
      alert('Please fill in all fields to calculate fare.');
      return;
    }

    const category = tripType === 'wedding' ? 'wedding' : 'standard';
    const vehicleRates = rates[category][vehicle];

    if (!vehicleRates) {
      alert('Selected vehicle is not available for this trip type.');
      return;
    }

    let fare = 0;
    let label = '';

    if (tripType === 'local') {
      fare = vehicleRates.local;
      label = `Local (${vehicleRates.localMinKm || 120} km / 12 hrs included)`;
    } else {
      const minKmForTrip = vehicleRates.minKm * days;
      const actualKm = Math.max(distance, minKmForTrip);
      fare = actualKm * vehicleRates.perKm;
      label = tripType === 'wedding' ? 'Wedding Outstation' : 'Outstation';

      if (days > 1) {
        label += ` (${days} Days)`;
      }

      if (distance < minKmForTrip) {
        label += ` (min ${minKmForTrip} km applied)`;
      }
    }

    // Show result
    if (resultDiv) {
      resultDiv.classList.add('visible');
      resultDiv.querySelector('.calc-result__amount').textContent = `₹${fare.toLocaleString('en-IN')}`;
      resultDiv.querySelector('.calc-result__note').textContent =
        `${label} • Toll, parking & border tax extra • Night charge: ₹${vehicleRates.nightCharge}`;
    }

    // Show lead capture
    if (leadDiv) {
      leadDiv.classList.add('visible');
    }

    // GA4 event
    if (typeof gtag === 'function') {
      gtag('event', 'fare_calculated', {
        vehicle: vehicle,
        trip_type: tripType,
        distance: distance,
        estimated_fare: fare
      });
    }
  });

  // Lead form submit
  const leadForm = document.getElementById('lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = document.getElementById('lead-phone').value;
      if (!phone) return;

      // Construct WhatsApp message with fare details
      const vehicle = vehicleSelect.options[vehicleSelect.selectedIndex].text;
      const tripType = tripTypeSelect.options[tripTypeSelect.selectedIndex].text;
      const distance = distanceInput.value;
      const fare = resultDiv.querySelector('.calc-result__amount').textContent;

      const msg = encodeURIComponent(
        `Hi Sagar Travels! I'd like to book:\n🚗 Vehicle: ${vehicle}\n📍 Trip: ${tripType}\n📅 Days: ${days}\n📏 Distance: ${distance} km\n💰 Estimated: ${fare}\n📞 My number: ${phone}`
      );

      window.open(`https://wa.me/916387301763?text=${msg}`, '_blank');

      if (typeof gtag === 'function') {
        gtag('event', 'lead_submitted', {
          vehicle: vehicleSelect.value,
          phone_captured: true,
          source: 'fare_calculator'
        });
      }
    });
  }
}

/* ════════════ GA4 EVENT TRACKING ════════════ */
function initGA4Events() {
  // Track all call clicks
  document.querySelectorAll('[data-track="call"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'click_call', {
          page: window.location.pathname,
          source: btn.dataset.source || 'unknown'
        });
      }
    });
  });

  // Track all WhatsApp clicks
  document.querySelectorAll('[data-track="whatsapp"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'click_whatsapp', {
          page: window.location.pathname,
          source: btn.dataset.source || 'unknown'
        });
      }
    });
  });
}
