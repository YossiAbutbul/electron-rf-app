/**
 * Custom Modal System for RF Testing Application
 * 
 * This module provides custom alert, confirm, and prompt dialogs
 * that match the application's design.
 */

// Create a Modal class to handle different types of modals
class CustomModal {
  constructor() {
    this.overlay = null;
    this.modalElement = null;
    this.closeButton = null;
    this.initialized = false;
    this.activePromiseResolve = null;
    this.activePromiseReject = null;
    
    // Initialize modal elements
    this.init();
  }
  
  init() {
    // Check if already initialized
    if (this.initialized) return;
    
    // Create modal overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'custom-modal-overlay';
    
    // Create modal container
    this.modalElement = document.createElement('div');
    this.modalElement.className = 'custom-modal';
    
    // Initial modal content
    this.modalElement.innerHTML = `
      <div class="custom-modal-header">
        <h3 class="custom-modal-title">Alert</h3>
        <button class="custom-modal-close">&times;</button>
      </div>
      <div class="custom-modal-body">
        <div class="custom-modal-content-wrapper">
          <div class="custom-modal-icon-wrapper">
            <i class="custom-modal-icon bx bx-info-circle"></i>
          </div>
          <div class="custom-modal-message">Message goes here</div>
        </div>
      </div>
      <div class="custom-modal-footer">
        <button class="custom-modal-button primary" data-action="ok">OK</button>
      </div>
    `;
    
    // Add modal to overlay
    this.overlay.appendChild(this.modalElement);
    
    // Add overlay to document body
    document.body.appendChild(this.overlay);
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Mark as initialized
    this.initialized = true;
  }
  
  setupEventListeners() {
    // Close button event
    this.closeButton = this.modalElement.querySelector('.custom-modal-close');
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => {
        this.close(false);
      });
    }
    
    // Close on overlay click (optional)
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close(false);
      }
    });
    
    // Handle button clicks
    this.modalElement.addEventListener('click', (e) => {
      if (e.target.classList.contains('custom-modal-button')) {
        const action = e.target.getAttribute('data-action');
        this.handleAction(action);
      }
    });
    
    // Handle keyboard events
    document.addEventListener('keydown', (e) => {
      if (!this.overlay.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        this.close(false);
      } else if (e.key === 'Enter') {
        // By default, trigger the primary action (usually "OK")
        const primaryButton = this.modalElement.querySelector('.custom-modal-button.primary');
        if (primaryButton) {
          primaryButton.click();
        }
      }
    });
  }
  
  handleAction(action) {
    switch (action) {
      case 'ok':
      case 'yes':
        this.close(true);
        break;
      case 'no':
      case 'cancel':
        this.close(false);
        break;
      case 'input':
        const inputElement = this.modalElement.querySelector('.custom-modal-input');
        const value = inputElement ? inputElement.value : '';
        this.close(value);
        break;
    }
  }
  
  /**
   * Open the modal with specific configuration
   * @param {Object} config - Configuration options
   * @returns {Promise} - Resolves when modal is closed
   */
  open(config = {}) {
    // Set modal title
    const titleElement = this.modalElement.querySelector('.custom-modal-title');
    if (titleElement) {
      titleElement.textContent = config.title || 'Alert';
    }
    
    // Set modal message
    const messageElement = this.modalElement.querySelector('.custom-modal-message');
    if (messageElement) {
      messageElement.textContent = config.message || '';
    }
    
    // Set modal type and icon
    this.modalElement.className = 'custom-modal';
    this.modalElement.classList.add(config.type || 'info');
    
    // Set icon based on type
    const iconElement = this.modalElement.querySelector('.custom-modal-icon');
    if (iconElement) {
      // Remove all existing classes except the base class
      iconElement.className = 'custom-modal-icon bx';
      
      // Add type-specific icon
      switch (config.type) {
        case 'success':
          iconElement.classList.add('bx-check-circle');
          break;
        case 'warning':
          iconElement.classList.add('bx-error');
          break;
        case 'error':
          iconElement.classList.add('bx-error-circle');
          break;
        case 'info':
        default:
          iconElement.classList.add('bx-info-circle');
          break;
      }
    }
    
    // Configure buttons
    const footerElement = this.modalElement.querySelector('.custom-modal-footer');
    if (footerElement) {
      footerElement.innerHTML = '';
      
      // Add buttons based on config
      if (config.buttons && Array.isArray(config.buttons)) {
        config.buttons.forEach(button => {
          const buttonElement = document.createElement('button');
          buttonElement.className = `custom-modal-button ${button.type || 'secondary'}`;
          buttonElement.textContent = button.text || 'Button';
          buttonElement.setAttribute('data-action', button.action || 'cancel');
          footerElement.appendChild(buttonElement);
        });
      } else {
        // Default OK button
        const okButton = document.createElement('button');
        okButton.className = 'custom-modal-button primary';
        okButton.textContent = 'OK';
        okButton.setAttribute('data-action', 'ok');
        footerElement.appendChild(okButton);
      }
    }
    
    // Add input field for prompt
    if (config.input) {
      const bodyElement = this.modalElement.querySelector('.custom-modal-body');
      const inputContainer = document.createElement('div');
      inputContainer.className = 'custom-modal-input-container';
      inputContainer.style.marginTop = '15px';
      
      // Create input element
      const inputElement = document.createElement('input');
      inputElement.className = 'custom-modal-input';
      inputElement.type = config.input.type || 'text';
      inputElement.value = config.input.value || '';
      inputElement.placeholder = config.input.placeholder || '';
      
      // Style the input
      inputElement.style.width = '100%';
      inputElement.style.padding = '8px';
      inputElement.style.borderRadius = '4px';
      inputElement.style.border = '1px solid var(--color-border-light)';
      
      // Add label if provided
      if (config.input.label) {
        const labelElement = document.createElement('label');
        labelElement.textContent = config.input.label;
        labelElement.style.display = 'block';
        labelElement.style.marginBottom = '5px';
        labelElement.style.fontSize = '14px';
        inputContainer.appendChild(labelElement);
      }
      
      // Add input to container
      inputContainer.appendChild(inputElement);
      
      // Add container to body
      bodyElement.appendChild(inputContainer);
      
      // Focus the input
      setTimeout(() => {
        inputElement.focus();
      }, 100);
    }
    
    // Show the modal
    this.overlay.classList.add('active');
    this.modalElement.classList.add('animate-in');
    
    // Create a promise that will be resolved when the modal is closed
    return new Promise((resolve, reject) => {
      this.activePromiseResolve = resolve;
      this.activePromiseReject = reject;
    });
  }
  
  close(result) {
    // Animate out
    this.modalElement.classList.remove('animate-in');
    this.modalElement.classList.add('animate-out');
    
    // Hide after animation completes
    setTimeout(() => {
      this.overlay.classList.remove('active');
      this.modalElement.classList.remove('animate-out');
      
      // Resolve the promise with the result
      if (this.activePromiseResolve) {
        this.activePromiseResolve(result);
        this.activePromiseResolve = null;
        this.activePromiseReject = null;
      }
    }, 300);
  }
  
  /**
   * Show an alert modal
   * @param {string} message - The message to display
   * @param {string} title - The title of the modal
   * @param {string} type - The type of alert (info, success, warning, error)
   * @returns {Promise} - Resolves when the modal is closed
   */
  alert(message, title = 'Alert', type = 'info') {
    return this.open({
      title,
      message,
      type,
      buttons: [
        { text: 'OK', action: 'ok', type: 'primary' }
      ]
    });
  }
  
  /**
   * Show a confirmation modal
   * @param {string} message - The message to display
   * @param {string} title - The title of the modal
   * @param {string} type - The type of alert (info, success, warning, error)
   * @returns {Promise<boolean>} - Resolves with true if confirmed, false if canceled
   */
  confirm(message, title = 'Confirm', type = 'warning') {
    return this.open({
      title,
      message,
      type,
      buttons: [
        { text: 'Cancel', action: 'cancel', type: 'secondary' },
        { text: 'OK', action: 'ok', type: 'primary' }
      ]
    });
  }
  
  /**
   * Show a prompt modal
   * @param {string} message - The message to display
   * @param {string} title - The title of the modal
   * @param {Object} inputConfig - Configuration for the input field
   * @returns {Promise<string|null>} - Resolves with the input value if confirmed, null if canceled
   */
  prompt(message, title = 'Prompt', inputConfig = {}) {
    return this.open({
      title,
      message,
      type: 'info',
      input: inputConfig,
      buttons: [
        { text: 'Cancel', action: 'cancel', type: 'secondary' },
        { text: 'OK', action: 'input', type: 'primary' }
      ]
    });
  }
  
  /**
   * Show a success message
   * @param {string} message - The message to display
   * @param {string} title - The title of the modal
   */
  success(message, title = 'Success') {
    return this.alert(message, title, 'success');
  }
  
  /**
   * Show an error message
   * @param {string} message - The message to display
   * @param {string} title - The title of the modal
   */
  error(message, title = 'Error') {
    return this.alert(message, title, 'error');
  }
  
  /**
   * Show a warning message
   * @param {string} message - The message to display
   * @param {string} title - The title of the modal
   */
  warning(message, title = 'Warning') {
    return this.alert(message, title, 'warning');
  }
}

// Create a singleton instance
const Modal = new CustomModal();

// Export the modal instance
window.customModal = Modal;