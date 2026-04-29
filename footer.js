/**
 * footer.js
 * Injects the site footer with branding, navigation links, and legal info.
 */

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const footerElement = document.getElementById('site-footer');
    if (!footerElement) return;

    footerElement.innerHTML = `
      <div class="footer-inner">
        <div class="footer-top">
          <div class="footer-brand">
            <div class="logo" style="color:#fff; margin-bottom:16px;">
              <div class="logo-icon" style="background:var(--gold);">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="20" height="20">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <span>Business Planner</span>
            </div>
            <p>The ultimate web application for business planning, financial projections, and strategic growth.</p>
          </div>
          <div class="footer-col">
            <h5>Product</h5>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#app">Planner Tool</a></li>
              <li><a href="#calculator">Calculator</a></li>
              <li><a href="#roadmap">Roadmap</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h5>Resources</h5>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Templates</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Community</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="footer-copy">© 2025 Business Planner — Plan, Launch, Grow.</div>
          <div class="footer-links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    `;
  });
})();
