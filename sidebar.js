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
      
      // No need to manually update the icon class as we're using CSS transforms
    });
    
    // Check localStorage on load to restore previous state
    // Only collapse if explicitly set to 'true'
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