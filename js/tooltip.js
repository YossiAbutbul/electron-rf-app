document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  let hoverTimer = null;
  
  navItems.forEach(item => {
    const tooltip = item.querySelector('.tooltip');
    if (!tooltip) return;
    
    // Move tooltip to body to avoid stacking context issues
    document.body.appendChild(tooltip);
    
    // Setup hover timer for showing tooltip
    item.addEventListener('mouseenter', () => {
      // Clear any existing timer
      if (hoverTimer) clearTimeout(hoverTimer);
      
      // Set new timer for 1 second
      hoverTimer = setTimeout(() => {
        const rect = item.getBoundingClientRect();
        tooltip.style.top = `${rect.top + rect.height/2}px`;
        tooltip.style.left = `${rect.right + 10}px`;
        tooltip.classList.add('active');
      }, 500); // 1000ms = 1 second
    });
    
    // Clear timer and hide tooltip on mouse leave
    item.addEventListener('mouseleave', () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
      tooltip.classList.remove('active');
    });
  });
});