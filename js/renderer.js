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

// Initialize functionality for specific pages
function initPageFunctions(pageName) {
  // Common elements that might exist on multiple pages
  const connectDutButton = document.getElementById('connect-dut');
  const bleDevicesModal = document.getElementById('ble-devices-modal');
  const closeModal = document.querySelector('.close-modal');
  const cancelButton = document.querySelector('.cancel-button');
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
  
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      bleDevicesModal.classList.remove('active');
    });
  }
  
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      bleDevicesModal.classList.remove('active');
    });
  }
  
  if (connectButton && bleDeviceList) {
    connectButton.addEventListener('click', () => {
      const selectedDevice = document.querySelector('.device-list li.selected');
      if (selectedDevice) {
        const deviceId = selectedDevice.dataset.id;
        const deviceName = selectedDevice.dataset.name;
        
        // Update UI to show connected device
        document.querySelector('.device-name').textContent = deviceName;
        document.querySelector('.device-id').textContent = deviceId;
        
        bleDevicesModal.classList.remove('active');
        alert(`Connected to ${deviceName}`);
      } else {
        alert('Please select a device');
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
        alert('Please enter a valid IP address');
        return;
      }
      
      // Simulate connection check
      setTimeout(() => {
        alert('Connection successful!');
      }, 500);
    });
  }
  
  if (checkPowerButton) {
    checkPowerButton.addEventListener('click', () => {
      const address = document.getElementById('power-analyzer').value;
      if (!address) {
        alert('Please enter a valid IP address');
        return;
      }
      
      // Simulate connection check
      setTimeout(() => {
        alert('Connection successful!');
      }, 500);
    });
  }
  
  if (browseDirectoryButton) {
    browseDirectoryButton.addEventListener('click', () => {
      // For now, just set a sample directory
      document.getElementById('report-directory').value = 'C:/Users/Selected/Path';
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
      alert('LoRa test started');
      document.querySelector('.results-container').innerHTML = 'Test in progress...';
    });
  }
  
  if (stopButton) {
    stopButton.addEventListener('click', () => {
      alert('LoRa test stopped');
      document.querySelector('.results-container').innerHTML = 'Test stopped by user.';
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
      if (confirm('Are you sure you want to log out?')) {
        // In a real app, this would handle actual logout
        alert('Logged out successfully');
      }
      return;
    }
    
    // Load the requested page
    loadPage(pageName);
  });
});

// Initialize the application by loading the default page
document.addEventListener('DOMContentLoaded', () => {
  loadPage('configuration');
});

//##############################

