// Cellular page functionality
function initCellularPage() {
  console.log('Cellular page initialized');
  
  // DOM Elements
  const addBandButton = document.getElementById('add-band');
  const editBandButtons = document.querySelectorAll('.edit-band');
  const bandConfigModal = document.getElementById('band-config-modal');
  const closeModalButton = document.querySelector('.close-modal');
  const cancelButton = document.querySelector('.cancel-button');
  const saveButton = document.querySelector('.save-button');
  const addFrequencyButton = document.getElementById('add-frequency');
  const addPowerButton = document.getElementById('add-power');
  const startTestButton = document.getElementById('start-test');
  
  let currentEditingBand = null;
  
  // Open modal for adding a new band
  if (addBandButton) {
    addBandButton.addEventListener('click', () => {
      openBandModal('new');
    });
  }
  
  // Open modal for editing existing bands
  if (editBandButtons) {
    editBandButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        // Get the band ID from the parent section
        const bandSection = e.target.closest('.band-section');
        if (bandSection) {
          const bandId = bandSection.id;
          openBandModal('edit', bandId);
        }
      });
    });
  }
  
  // Close modal handlers
  if (closeModalButton) {
    closeModalButton.addEventListener('click', () => {
      closeBandModal();
    });
  }
  
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      closeBandModal();
    });
  }
  
  // Add new frequency input
  if (addFrequencyButton) {
    addFrequencyButton.addEventListener('click', () => {
      addFrequencyInput();
    });
  }
  
  // Add new power level input
  if (addPowerButton) {
    addPowerButton.addEventListener('click', () => {
      addPowerInput();
    });
  }
  
  // Save band configuration
  if (saveButton) {
    saveButton.addEventListener('click', () => {
      saveBandConfiguration();
    });
  }
  
  // Start test button
  if (startTestButton) {
    startTestButton.addEventListener('click', () => {
      startCellularTest();
    });
  }
  
  // Setup event delegation for dynamically added elements
  setupEventDelegation();
}

/**
 * Open the band configuration modal
 * @param {string} mode - 'new' or 'edit'
 * @param {string} bandId - ID of the band to edit (if mode is 'edit')
 */
function openBandModal(mode, bandId = null) {
  const modal = document.getElementById('band-config-modal');
  const modalTitle = modal.querySelector('.modal-header h2');
  const bandNameInput = document.getElementById('band-name');
  const frequencyInputs = document.getElementById('frequency-inputs');
  const powerInputs = document.getElementById('power-inputs');
  
  // Reset the form
  bandNameInput.value = '';
  frequencyInputs.innerHTML = '';
  powerInputs.innerHTML = '';
  
  if (mode === 'new') {
    modalTitle.textContent = 'Add New Band';
    currentEditingBand = null;
    
    // Add default inputs
    addFrequencyInput('850');
    addFrequencyInput('860');
    addFrequencyInput('870');
    
    addPowerInput('0');
    addPowerInput('14');
    addPowerInput('20');
    
  } else if (mode === 'edit' && bandId) {
    modalTitle.textContent = 'Edit Band';
    currentEditingBand = bandId;
    
    // Populate form with existing band data
    const bandSection = document.getElementById(bandId);
    if (bandSection) {
      // Extract band name from heading
      const bandName = bandSection.querySelector('h2').textContent.split(' ')[0] + ' ' + bandSection.querySelector('h2').textContent.split(' ')[1];
      bandNameInput.value = bandName;
      
      // Extract frequencies from tables
      const frequencies = [];
      const headerCells = bandSection.querySelectorAll('thead th:not(:first-child)');
      headerCells.forEach(cell => {
        const freq = cell.textContent.replace('MHz', '');
        frequencies.push(freq);
      });
      
      // Add frequency inputs
      frequencies.forEach(freq => {
        addFrequencyInput(freq);
      });
      
      // Extract power levels from tables
      const powers = [];
      const powerCells = bandSection.querySelectorAll('tbody tr td:first-child');
      powerCells.forEach(cell => {
        const power = cell.textContent.replace(' dBm', '');
        powers.push(power);
      });
      
      // Add power inputs
      powers.forEach(power => {
        addPowerInput(power);
      });
    }
  }
  
  // Show the modal
  modal.classList.add('active');
}

/**
 * Close the band configuration modal
 */
function closeBandModal() {
  const modal = document.getElementById('band-config-modal');
  modal.classList.remove('active');
}

/**
 * Add a new frequency input field
 * @param {string} value - Optional initial value
 */
function addFrequencyInput(value = '') {
  const frequencyInputs = document.getElementById('frequency-inputs');
  
  const inputDiv = document.createElement('div');
  inputDiv.className = 'frequency-input';
  
  inputDiv.innerHTML = `
    <input type="text" class="frequency" placeholder="e.g. 850" value="${value}">
    <button class="remove-freq"><i class='bx bx-trash'></i></button>
  `;
  
  frequencyInputs.appendChild(inputDiv);
}

/**
 * Add a new power input field
 * @param {string} value - Optional initial value
 */
function addPowerInput(value = '') {
  const powerInputs = document.getElementById('power-inputs');
  
  const inputDiv = document.createElement('div');
  inputDiv.className = 'power-input';
  
  inputDiv.innerHTML = `
    <input type="text" class="power" placeholder="e.g. 10" value="${value}">
    <button class="remove-power"><i class='bx bx-trash'></i></button>
  `;
  
  powerInputs.appendChild(inputDiv);
}

/**
 * Save the band configuration
 */
function saveBandConfiguration() {
  const bandNameInput = document.getElementById('band-name');
  const frequencyInputs = document.querySelectorAll('.frequency');
  const powerInputs = document.querySelectorAll('.power');
  const includeTxPower = document.querySelector('input[name="include-txpower"]').checked;
  const includeTxCurrent = document.querySelector('input[name="include-txcurrent"]').checked;
  
  // Validate inputs
  if (!bandNameInput.value.trim()) {
    alert('Please enter a band name');
    return;
  }
  
  const frequencies = [];
  let isValid = true;
  
  frequencyInputs.forEach(input => {
    const value = input.value.trim();
    if (!value) {
      alert('Please fill in all frequency fields');
      isValid = false;
      return;
    }
    if (isNaN(value)) {
      alert('Frequencies must be numbers');
      isValid = false;
      return;
    }
    frequencies.push(value);
  });
  
  if (!isValid) return;
  
  const powers = [];
  powerInputs.forEach(input => {
    const value = input.value.trim();
    if (!value) {
      alert('Please fill in all power fields');
      isValid = false;
      return;
    }
    if (isNaN(value)) {
      alert('Power levels must be numbers');
      isValid = false;
      return;
    }
    powers.push(value);
  });
  
  if (!isValid) return;
  
  // If we're editing an existing band, update it
  if (currentEditingBand) {
    updateExistingBand(currentEditingBand, bandNameInput.value, frequencies, powers, includeTxPower, includeTxCurrent);
  } else {
    // Otherwise, create a new band
    createNewBand(bandNameInput.value, frequencies, powers, includeTxPower, includeTxCurrent);
  }
  
  // Close the modal
  closeBandModal();
}

/**
 * Create a new band section
 */
function createNewBand(bandName, frequencies, powers, includeTxPower, includeTxCurrent) {
  // Generate a band ID from the name (lowercase, no spaces)
  const bandId = 'band-' + bandName.toLowerCase().replace(/\s+/g, '-');
  
  // Create the band section
  const bandSection = document.createElement('div');
  bandSection.className = 'band-section';
  bandSection.id = bandId;
  
  // Create the band header
  const bandHeader = document.createElement('div');
  bandHeader.className = 'band-header';
  bandHeader.innerHTML = `<h2>${bandName} <i class='bx bx-pencil edit-band'></i></h2>`;
  
  // Create the test panels container
  const testPanels = document.createElement('div');
  testPanels.className = 'test-panels';
  
  // Add TX Power panel if selected
  if (includeTxPower) {
    testPanels.appendChild(createTestPanel(bandId, 'txpower', 'Tx Power', frequencies, powers));
  }
  
  // Add TX Current Consumption panel if selected
  if (includeTxCurrent) {
    testPanels.appendChild(createTestPanel(bandId, 'txcurrent', 'Tx Current Consumption', frequencies, powers));
  }
  
  // Assemble the band section
  bandSection.appendChild(bandHeader);
  bandSection.appendChild(testPanels);
  
  // Find the "Add Band" button container and insert the new band before it
  const addBandContainer = document.querySelector('.add-band-container');
  addBandContainer.parentNode.insertBefore(bandSection, addBandContainer);
  
  // Add event listener to the new edit button
  const editButton = bandSection.querySelector('.edit-band');
  if (editButton) {
    editButton.addEventListener('click', () => {
      openBandModal('edit', bandId);
    });
  }
}

/**
 * Update an existing band
 */
function updateExistingBand(bandId, bandName, frequencies, powers, includeTxPower, includeTxCurrent) {
  const bandSection = document.getElementById(bandId);
  if (!bandSection) return;
  
  // Update band name
  const bandHeader = bandSection.querySelector('.band-header h2');
  bandHeader.innerHTML = `${bandName} <i class='bx bx-pencil edit-band'></i>`;
  
  // Clear existing panels
  const testPanels = bandSection.querySelector('.test-panels');
  testPanels.innerHTML = '';
  
  // Add TX Power panel if selected
  if (includeTxPower) {
    testPanels.appendChild(createTestPanel(bandId, 'txpower', 'Tx Power', frequencies, powers));
  }
  
  // Add TX Current Consumption panel if selected
  if (includeTxCurrent) {
    testPanels.appendChild(createTestPanel(bandId, 'txcurrent', 'Tx Current Consumption', frequencies, powers));
  }
  
  // Reattach event listener to the edit button
  const editButton = bandSection.querySelector('.edit-band');
  if (editButton) {
    editButton.addEventListener('click', () => {
      openBandModal('edit', bandId);
    });
  }
}

/**
 * Create a test panel (TX Power or TX Current Consumption)
 */
function createTestPanel(bandId, type, title, frequencies, powers) {
  const panel = document.createElement('div');
  panel.className = 'test-panel';
  
  // Panel header with checkbox
  const panelHeader = document.createElement('div');
  panelHeader.className = 'panel-header';
  panelHeader.innerHTML = `
    <label class="checkbox">
      <input type="checkbox" name="${type}-${bandId}" checked>
      <span>${title}</span>
    </label>
  `;
  
  // Panel content with table
  const panelContent = document.createElement('div');
  panelContent.className = 'panel-content';
  
  // Create table header
  let tableHTML = '<table class="test-table"><thead><tr><th></th>';
  frequencies.forEach(freq => {
    tableHTML += `<th>${freq}MHz</th>`;
  });
  tableHTML += '</tr></thead><tbody>';
  
  // Create table rows
  powers.forEach(power => {
    tableHTML += `<tr><td>${power} dBm</td>`;
    frequencies.forEach(() => {
      tableHTML += '<td>-</td>';
    });
    tableHTML += '</tr>';
  });
  
  tableHTML += '</tbody></table>';
  panelContent.innerHTML = tableHTML;
  
  // Assemble panel
  panel.appendChild(panelHeader);
  panel.appendChild(panelContent);
  
  return panel;
}

/**
 * Setup event delegation for dynamically added elements
 */
function setupEventDelegation() {
  // Handle remove buttons for frequency and power inputs
  document.addEventListener('click', (e) => {
    // Check if the clicked element is a remove frequency button
    if (e.target.closest('.remove-freq')) {
      const inputDiv = e.target.closest('.frequency-input');
      const frequencyInputs = document.getElementById('frequency-inputs');
      
      // Only remove if there's more than one input
      if (frequencyInputs.children.length > 1) {
        inputDiv.remove();
      } else {
        alert('At least one frequency is required');
      }
    }
    
    // Check if the clicked element is a remove power button
    if (e.target.closest('.remove-power')) {
      const inputDiv = e.target.closest('.power-input');
      const powerInputs = document.getElementById('power-inputs');
      
      // Only remove if there's more than one input
      if (powerInputs.children.length > 1) {
        inputDiv.remove();
      } else {
        alert('At least one power level is required');
      }
    }
  });
}

/**
 * Start the cellular test
 */
// function startCellularTest() {
  // Get all checked tests