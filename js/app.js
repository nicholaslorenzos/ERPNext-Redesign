document.addEventListener('DOMContentLoaded', () => {
  // Set global variables using window object to make them explicitly global
  window.isMobile = window.innerWidth < 768;
  window.isSidebarShowing = false; // Ensure this is explicitly defined
  
  // Initialize main components
  try {
    renderSidebar();
    renderHeader();
    navigateToPage('home');
    
    // Safe event listener attachment with error handling
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    if (mobileNavToggle) {
      mobileNavToggle.addEventListener('click', toggleSidebar);
    }
    
    // Set up global event listeners
    window.addEventListener('resize', handleWindowResize);
  } catch (error) {
    console.error('Error initializing application:', error);
  }
});

/**
 * Handle window resize events efficiently with debouncing
 */
function handleWindowResize() {
  // Avoid expensive operations during resize by using debounce
  clearTimeout(window.resizeTimer);
  window.resizeTimer = setTimeout(() => {
    const wasMobile = window.isMobile;
    window.isMobile = window.innerWidth < 768;
    
    // Only re-render if mobile state changed
    if (wasMobile !== window.isMobile) {
      if (!window.isMobile) {
        const overlay = document.getElementById('mobile-overlay');
        if (overlay) overlay.classList.add('opacity-0', 'pointer-events-none');
        document.body.classList.remove('overflow-hidden');
        window.isSidebarShowing = false;
      } else {
        window.isSidebarShowing = false;
      }
      
      renderSidebar();
      if (typeof renderHeader === 'function') {
        renderHeader();
      }
    }
  }, 100); // Wait 100ms after resize ends
}