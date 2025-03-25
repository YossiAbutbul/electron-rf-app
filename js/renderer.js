// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const mainContent = document.getElementById('main-content');


// Current page tracking
let currentPage = 'configuration';

// Function to load page content
async function loadPage(pageName) {
  try {
    // Fetch the HTML content for the selected page
    const response = await fetch(`pages/${pageName}.html`);
    
    if (!response.ok) {
      throw new Error(`Failed to load page: ${pageName}`);
    }
    
    const html = await response.text();
    mainContent.innerHTML = html;
    
    // Initialize page-specific functionality
    initPageFunctions(pageName);
    
    // Update current page
    currentPage = pageName;
    
    // Update active nav item
    updateActiveNavItem();
  } catch (error) {
    console.error('Error loading page:', error);
    mainContent.innerHTML = `<div class="error-message">Error loading page: ${error.message}</div>`;
    window.customModal.error(`Failed to load page: ${error.message}`, 'Page Loading Error');
  }
}

// Update active navigation item
function updateActiveNavItem() {
  navItems.forEach(item => {
    const pageName = item.getAttribute('data-page');
    if (pageName === currentPage) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Safe way to close any modal
function safeCloseModal(modalElement) {
  if (modalElement && modalElement.classList) {
    modalElement.classList.remove('active');
  }
}

// Initialize functionality for specific pages
function initPageFunctions(pageName) {
  // Common elements that might exist on multiple pages
  const connectDutButton = document.getElementById('connect-dut');
  const bleDevicesModal = document.getElementById('ble-devices-modal');
  const closeModals = document.querySelectorAll('.close-modal');
  const cancelButtons = document.querySelectorAll('.cancel-button');
  const connectButton = document.querySelector('.connect-button');
  const bleDeviceList = document.getElementById('ble-device-list');
  
  // Page-specific initialization
  switch(pageName) {
    case 'configuration':
      initConfigurationPage();
      break;
    case 'lora':
      initLoraPage();
      break;
    case 'cellular':
      initCellularPage();
      break;
    case 'ble':
      initBlePage();
      break;
    case 'test-report':
      initTestReportPage();
      break;
    case 'settings':
      initSettingsPage();
      break;
  }
  
  // Handle modal functionality if it exists on the current page
  if (connectDutButton && bleDevicesModal) {
    connectDutButton.addEventListener('click', () => {
      // For now, just show the modal with dummy data
      renderBleDeviceList([
        { id: '00:1A:7D:DA:71:13', name: 'Sonata 2 IL' },
        { id: '66:77:88:99:AA:BB', name: 'Test Device 2' }
      ]);
      bleDevicesModal.classList.add('active');
    });
  }
  
  // Handle all close modal buttons
  if (closeModals && closeModals.length > 0) {
    closeModals.forEach(closeBtn => {
      closeBtn.addEventListener('click', () => {
        const modal = closeBtn.closest('.modal');
        safeCloseModal(modal);
      });
    });
  }
  
  // Handle all cancel buttons
  if (cancelButtons && cancelButtons.length > 0) {
    cancelButtons.forEach(cancelBtn => {
      cancelBtn.addEventListener('click', () => {
        const modal = cancelBtn.closest('.modal');
        safeCloseModal(modal);
      });
    });
  }
  
  if (connectButton && bleDeviceList) {
    connectButton.addEventListener('click', () => {
      const selectedDevice = document.querySelector('.device-list li.selected');
      if (selectedDevice) {
        const deviceId = selectedDevice.dataset.id;
        const deviceName = selectedDevice.dataset.name;
        
        // Update UI to show connected device
        const deviceNameElement = document.querySelector('.device-name');
        const deviceIdElement = document.querySelector('.device-id');
        
        if (deviceNameElement) deviceNameElement.textContent = deviceName;
        if (deviceIdElement) deviceIdElement.textContent = deviceId;
        
        safeCloseModal(bleDevicesModal);
        // Replace alert with custom modal
        window.customModal.success(`Connected to ${deviceName}`, 'Connection Successful');
      } else {
        // Replace alert with custom modal
        window.customModal.warning('Please select a device', 'Selection Required');
      }
    });
  }
}

// Page-specific initialization functions
function initConfigurationPage() {
  const checkSpectrumButton = document.getElementById('check-spectrum');
  const checkPowerButton = document.getElementById('check-power');
  const browseDirectoryButton = document.getElementById('browse-directory');
  
  if (checkSpectrumButton) {
    checkSpectrumButton.addEventListener('click', () => {
      const address = document.getElementById('spectrum-analyzer').value;
      if (!address) {
        // Replace alert with custom modal
        window.customModal.error('Please enter a valid IP address', 'Input Error');
        return;
      }
      
      // Simulate connection check
      setTimeout(() => {
        // Replace alert with custom modal
        window.customModal.success('Connection successful!', 'Spectrum Analyzer');
      }, 500);
    });
  }
  
  if (checkPowerButton) {
    checkPowerButton.addEventListener('click', () => {
      const address = document.getElementById('power-analyzer').value;
      if (!address) {
        // Replace alert with custom modal
        window.customModal.error('Please enter a valid IP address', 'Input Error');
        return;
      }
      
      // Simulate connection check
      setTimeout(() => {
        // Replace alert with custom modal
        window.customModal.success('Connection successful!', 'Power Analyzer');
      }, 500);
    });
  }
  
  if (browseDirectoryButton) {
    browseDirectoryButton.addEventListener('click', () => {
      // For now, just set a sample directory
      document.getElementById('report-directory').value = 'C:/Users/Selected/Path';
      // Add notification with custom modal
      window.customModal.info('Directory path updated', 'File System');
    });
  }
}

function initLoraPage() {
  // LoRa specific functionality
  console.log('LoRa page initialized');
  
  // Example: Add event listeners for LoRa test buttons
  const startButton = document.querySelector('.primary-button');
  const stopButton = document.querySelector('.secondary-button');
  
  if (startButton) {
    startButton.addEventListener('click', () => {
      // Replace alert with confirm modal
      window.customModal.confirm('Are you sure you want to start the LoRa test?', 'Start Test')
        .then(confirmed => {
          if (confirmed) {
            const resultsContainer = document.querySelector('.results-container');
            if (resultsContainer) {
              resultsContainer.innerHTML = 'Test in progress...';
            }
            window.customModal.info('LoRa test started. Monitoring in progress...', 'LoRa Test');
          }
        });
    });
  }
  
  if (stopButton) {
    stopButton.addEventListener('click', () => {
      // Replace alert with warning modal
      window.customModal.warning('Stopping the test will terminate data collection. Continue?', 'Stop Test')
        .then(confirmed => {
          if (confirmed) {
            const resultsContainer = document.querySelector('.results-container');
            if (resultsContainer) {
              resultsContainer.innerHTML = 'Test stopped by user.';
            }
            window.customModal.info('Test stopped by user', 'LoRa Test');
          }
        });
    });
  }
}

function initCellularPage() {
  // Cellular specific functionality
  console.log('Cellular page initialized');
}

function initBlePage() {
  // BLE specific functionality
  console.log('BLE page initialized');
}

function initTestReportPage() {
  // Test Report specific functionality
  console.log('Test Report page initialized');
}

function initSettingsPage() {
  // Settings specific functionality
  console.log('Settings page initialized');
}

// Render BLE device list
function renderBleDeviceList(devices) {
  const bleDeviceList = document.getElementById('ble-device-list');
  if (!bleDeviceList) return;
  
  bleDeviceList.innerHTML = '';
  devices.forEach(device => {
    const li = document.createElement('li');
    li.textContent = `${device.name} (${device.id})`;
    li.dataset.id = device.id;
    li.dataset.name = device.name;
    
    li.addEventListener('click', () => {
      // Toggle selection
      document.querySelectorAll('.device-list li').forEach(item => {
        item.classList.remove('selected');
      });
      li.classList.add('selected');
    });
    
    bleDeviceList.appendChild(li);
  });
}

// Navigation click event
navItems.forEach(item => {
  item.addEventListener('click', () => {
    const pageName = item.getAttribute('data-page');
    if (!pageName) return;
    
    if (pageName === 'logout') {
      // Replace confirm with custom modal
      window.customModal.confirm('Are you sure you want to log out?', 'Logout Confirmation')
        .then(confirmed => {
          if (confirmed) {
            // In a real app, this would handle actual logout
            window.customModal.success('Logged out successfully', 'Logout');
          }
        });
      return;
    }
    
    // Load the requested page
    loadPage(pageName);
  });
});

// Initialize the application by loading the default page
document.addEventListener('DOMContentLoaded', () => {
  loadPage('configuration');
  
  // Clear focus from any button elements
  setTimeout(() => {
    // Remove focus from any window control button
    document.querySelectorAll('.window-control').forEach(btn => {
      btn.blur();
    });
  }, 100);
  
  // Add global handler for all modal close buttons and cancel buttons
  document.addEventListener('click', function(e) {
    // Handle modal close buttons
    if (e.target.closest('.close-modal')) {
      const modal = e.target.closest('.modal');
      safeCloseModal(modal);
    }
    
    // Handle cancel buttons
    if (e.target.closest('.cancel-button')) {
      const modal = e.target.closest('.modal');
      safeCloseModal(modal);
    }
  });
});