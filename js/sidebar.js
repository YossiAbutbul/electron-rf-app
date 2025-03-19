// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggle-sidebar');
  const sidebar = document.querySelector('.sidebar');
  
  if (toggleButton && sidebar) {
    // Set up click handler for toggle button
    toggleButton.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      
      // Store the state in localStorage to remember user preference
      const isCollapsed = sidebar.classList.contains('collapsed');
      localStorage.setItem('sidebarCollapsed', isCollapsed);
    });
    
    const savedState = localStorage.getItem('sidebarCollapsed');
    
    // If there's no saved state or it's explicitly set to 'false', ensure sidebar is open
    if (savedState !== 'true') {
      sidebar.classList.remove('collapsed');
      localStorage.setItem('sidebarCollapsed', 'false');
    } else if (savedState === 'true') {
      sidebar.classList.add('collapsed');
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  const navItems = document.querySelectorAll('.nav-item');
  
  // Create the indicator element
  const indicator = document.createElement('div');
  indicator.className = 'nav-indicator';
  sidebar.appendChild(indicator);
  
  // Function to position the indicator
  function positionIndicator(item) {
    if (!item) return;
    
    const itemRect = item.getBoundingClientRect();
    const sidebarRect = sidebar.getBoundingClientRect();
    
    // Adjust the indicator height
    indicator.style.height = `20px`; 
    
    // Position the indicator vertically centered
    const top = item.offsetTop + (itemRect.height / 2) - (indicator.offsetHeight / 2);
    indicator.style.transform = `translateY(${top}px)`;
  }
  
  // Initialize the indicator position
  const activeItem = document.querySelector('.nav-item.active');
  if (activeItem) {
    // Small delay to ensure DOM is fully rendered
    setTimeout(() => positionIndicator(activeItem), 100);
  }
  
  // Handle click events on nav items
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Update active class
      navItems.forEach(navItem => {
        navItem.classList.remove('active', 'animate-click');
      });
      
      item.classList.add('active', 'animate-click');
      
      // Move the indicator
      positionIndicator(item);
      
      // Your existing navigation logic...
    });
    
    // Remove animation when it completes
    item.addEventListener('animationend', () => {
      item.classList.remove('animate-click');
    });
  });
  
  // Handle window resize to reposition indicator
  window.addEventListener('resize', () => {
    const activeItem = document.querySelector('.nav-item.active');
    positionIndicator(activeItem);
  });
});