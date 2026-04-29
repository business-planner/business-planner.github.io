/**
 * header.js
 * Injects and manages the site header, navigation, and mobile menu.
 */

(function() {
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    const headerElement = document.getElementById('site-header');
    if (!headerElement) return;

    // Build header HTML
    headerElement.innerHTML = `
      <div class="header-inner">
        <div class="logo">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <span>Business Planner</span>
        </div>
        <nav class="nav">
          <a href="#features">Features</a>
          <a href="#app">Planner Tool</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#calculator">Calculator</a>
          <a href="#market">Market Analysis</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div class="header-cta">
          <a href="#app" class="btn btn-primary" style="padding:10px 20px;">Start Planning</a>
          <a href="#app" class="btn-outline" style="padding:10px 20px;">Sign In</a>
        </div>
        <div class="hamburger" id="hamburgerBtn" aria-label="Menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;

    // ---- Mobile Navigation Toggle ----
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', function() {
        const expanded = mobileNav.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', expanded);
      });

      // Close mobile menu when a link is clicked
      mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileNav.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // ---- Scroll effect: add 'scrolled' class to header ----
    function updateHeaderScroll() {
      if (window.scrollY > 10) {
        headerElement.classList.add('scrolled');
      } else {
        headerElement.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', updateHeaderScroll);
    updateHeaderScroll(); // initial check

    // ---- Smooth scroll for anchor links (optional enhancement) ----
    document.querySelectorAll('.nav a, .header-cta a, .logo a').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const hash = this.getAttribute('href');
        if (hash && hash.startsWith('#') && hash !== '#') {
          const target = document.querySelector(hash);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
            // Update URL without jumping
            history.pushState(null, null, hash);
          }
        }
      });
    });
  });
})();
