// Cellular page functionality - Proper order of function definitions
// Note: Function declarations must come BEFORE they are used

// Set up all event listeners
function setupEventListeners() {
  // Test matrix checkbox functionality - UPDATED
  const testCheckboxes = document.querySelectorAll('.matrix-header input[type="checkbox"]');
  testCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const testMatrix = this.closest('.test-matrix');
      if (testMatrix) {
        // Find the table container
        const tableContainer = testMatrix.querySelector('.table-container');
        if (!tableContainer) return;
        
        if (this.checked) {
          // When re-checked, make sure to remove the disabled class from the table container
          tableContainer.classList.remove('disabled');
        } else {
          // When unchecked, add the disabled class to the table container only
          tableContainer.classList.add('disabled');
        }
      }
    });
  });

  // Start test button
  const startTestButton = document.getElementById('start-test');
  if (startTestButton) {
    startTestButton.addEventListener('click', function() {
      // Placeholder for test functionality
      console.log('Test button clicked - functionality removed for simplicity');
    });
  }

  // Add band button
  const addBandButton = document.getElementById('add-band-button');
  if (addBandButton) {
    addBandButton.addEventListener('click', openAddBandModal);
  }

  // Modal close button
  const closeModalButton = document.querySelector('#band-modal .close-modal');
  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeAddBandModal);
  }

  // Modal cancel button
  const cancelButton = document.querySelector('#band-modal .cancel-button');
  if (cancelButton) {
    cancelButton.addEventListener('click', closeAddBandModal);
  }

  // Add frequency button
  const addFrequencyButton = document.getElementById('add-frequency-button');
  if (addFrequencyButton) {
    console.log('Add frequency button found, attaching event listener');
    addFrequencyButton.addEventListener('click', addFrequencyInput);
  } else {
    console.error('Add frequency button not found in DOM');
  }

  // Add power level button
  const addPowerButton = document.getElementById('add-power-button');
  if (addPowerButton) {
    addPowerButton.addEventListener('click', addPowerLevelInput);
  }

  // Save band button
  const saveBandButton = document.getElementById('save-band-button');
  if (saveBandButton) {
    saveBandButton.addEventListener('click', saveBand);
  }
}

// Setup event delegation for dynamically created elements
function setupEventDelegation() {
  // Handle clicks using event delegation
  document.addEventListener('click', function(e) {
    // Handle remove frequency or power input button clicks
    if (e.target.closest('.remove-input')) {
      const inputRow = e.target.closest('.input-row');
      if (!inputRow) return; // Exit if no input row found
      
      const container = inputRow.parentElement;
      if (!container) return; // Exit if no container found
      
      // Only remove if there's more than one input
      const inputRows = container.querySelectorAll('.input-row');
      if (!inputRows || inputRows.length <= 1) {
        if (window.customModal) {
          window.customModal.warning('At least one input is required', 'Validation');
        } else {
          alert('At least one input is required');
        }
        return;
      }
      
      // Remove the row
      inputRow.remove();
    }
    
    // Handle edit band button clicks using event delegation
    if (e.target.closest('.edit-band')) {
      const editButton = e.target.closest('.edit-band');
      const bandSection = editButton.closest('.band-section');
      if (bandSection) {
        openEditBandModal(bandSection);
      }
    }
    
    // Handle delete band button clicks using event delegation
    if (e.target.closest('.delete-band')) {
      const deleteButton = e.target.closest('.delete-band');
      const bandSection = deleteButton.closest('.band-section');
      if (bandSection) {
        const bandName = bandSection.querySelector('.band-header h2').textContent.trim();
        confirmDeleteBand(bandSection, bandName);
      }
    }
  });
}

// Initialize all table cells with input fields
function initializeTableCells() {
  const tableCells = document.querySelectorAll('.matrix-table td:not(:first-child)');
  tableCells.forEach(cell => {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'cell-input';
    input.placeholder = '-';
    cell.appendChild(input);
  });
}

// Update existing band headers to include edit and delete buttons
function updateExistingBandHeaders() {
  // This function can be called during page initialization
  const existingBandHeaders = document.querySelectorAll('.band-header');
  
  existingBandHeaders.forEach(header => {
    // Check if the header already has the title container structure
    if (header.querySelector('.band-title-container')) {
      return; // Skip to the next header - already has the right structure
    }
    
    // Get the band name
    const bandName = header.querySelector('h2').textContent.trim();
    const bandSection = header.closest('.band-section');
    
    // Create the new structure
    const titleContainer = document.createElement('div');
    titleContainer.className = 'band-title-container';
    
    // Move the h2 inside the container
    const h2 = header.querySelector('h2');
    header.removeChild(h2);
    titleContainer.appendChild(h2);
    
    // Add action buttons
    const actions = document.createElement('div');
    actions.className = 'band-actions';
    actions.innerHTML = `
      <button class="icon-button edit-band" title="Edit Band">
        <i class='bx bx-edit'></i>
      </button>
      <button class="icon-button delete-band" title="Delete Band">
        <i class='bx bx-trash'></i>
      </button>
    `;
    
    titleContainer.appendChild(actions);
    header.appendChild(titleContainer);
  });
}

// Cellular page initialization - AFTER all other functions are defined
function initCellularPage() {
  console.log('Cellular page initialized');
  
  // Initialize all cells with input fields
  initializeTableCells();
  
  // Setup event listeners
  setupEventListeners();
  
  // Update existing band headers to add edit/delete buttons
  updateExistingBandHeaders();
  
  // Setup event delegation for dynamically created elements
  setupEventDelegation();
}

// Open the Add Band Modal
function openAddBandModal() {
  const modal = document.getElementById('band-modal');
  
  // Reset the form to ensure it's clean
  resetBandModal();
  
  // Update modal title to indicate adding
  modal.querySelector('.modal-header h2').textContent = 'Add New Band';
  
  modal.classList.add('active');
}

// Close the Add Band Modal
function closeAddBandModal() {
  const modal = document.getElementById('band-modal');
  if (modal) { // Check if modal exists before trying to remove class
    modal.classList.remove('active');
    
    // Reset form for next use
    resetBandModal();
  }
}

// Reset the band modal form to default state
function resetBandModal() {
  console.log('Resetting band modal');
  
  // Reset band name
  const bandNameInput = document.getElementById('band-name');
  if (bandNameInput) {
    bandNameInput.value = '';
  } else {
    console.error('Could not find band name input');
  }
  
  // Reset frequencies
  const frequencyContainer = document.getElementById('frequency-inputs');
  if (!frequencyContainer) {
    console.error('Could not find frequency inputs container');
    return;
  }
  
  // Clear existing inputs but preserve the container
  frequencyContainer.innerHTML = '';
  console.log('Cleared frequency inputs');
  
  // Add a default frequency input
  const defaultFreqRow = document.createElement('div');
  defaultFreqRow.className = 'input-row';
  defaultFreqRow.innerHTML = `
    <input type="text" class="frequency-input" placeholder="e.g. 700">
    <button class="remove-input"><i class='bx bx-trash'></i></button>
  `;
  frequencyContainer.appendChild(defaultFreqRow);
  console.log('Added default frequency input');
  
  // Reset power levels
  const powerContainer = document.getElementById('power-inputs');
  if (!powerContainer) {
    console.error('Could not find power inputs container');
    return;
  }
  
  // Clear existing inputs but preserve the container
  powerContainer.innerHTML = '';
  console.log('Cleared power inputs');
  
  // Add a default power input
  const defaultPowerRow = document.createElement('div');
  defaultPowerRow.className = 'input-row';
  defaultPowerRow.innerHTML = `
    <input type="text" class="power-input" placeholder="e.g. 10">
    <button class="remove-input"><i class='bx bx-trash'></i></button>
  `;
  powerContainer.appendChild(defaultPowerRow);
  console.log('Added default power input');
  
  // Reset checkboxes
  const txPowerCheckbox = document.querySelector('input[name="test-txpower"]');
  if (txPowerCheckbox) txPowerCheckbox.checked = true;
  
  const txCurrentCheckbox = document.querySelector('input[name="test-txcurrent"]');
  if (txCurrentCheckbox) txCurrentCheckbox.checked = true;
  
  const obwCheckbox = document.querySelector('input[name="test-obw"]');
  if (obwCheckbox) obwCheckbox.checked = true;
  
  const freqAccuracyCheckbox = document.querySelector('input[name="test-freqaccuracy"]');
  if (freqAccuracyCheckbox) freqAccuracyCheckbox.checked = true;
  
  console.log('Reset checkboxes');
  
  // Reset modal title
  const modalTitle = document.querySelector('#band-modal .modal-header h2');
  if (modalTitle) {
    modalTitle.textContent = 'Add New Band';
  } else {
    console.error('Could not find modal title element');
  }
  
  // Clear edit band id if present
  const saveButton = document.getElementById('save-band-button');
  if (saveButton) {
    saveButton.removeAttribute('data-edit-band-id');
    console.log('Cleared edit band ID from save button');
  } else {
    console.error('Could not find save button');
  }
}

// Add a frequency input field
function addFrequencyInput() {
  console.log('addFrequencyInput function called');
  
  const container = document.getElementById('frequency-inputs');
  
  // Verify the container exists before proceeding
  if (!container) {
    console.error('Could not find frequency inputs container');
    return;
  }
  
  // Count existing inputs for debugging
  const existingInputs = container.querySelectorAll('.frequency-input').length;
  console.log(`Current number of frequency inputs: ${existingInputs}`);
  
  // Create the new input row
  const inputRow = document.createElement('div');
  inputRow.className = 'input-row';
  
  // Set the HTML content including the input field and remove button
  inputRow.innerHTML = `
    <input type="text" class="frequency-input" placeholder="e.g. 700">
    <button class="remove-input"><i class='bx bx-trash'></i></button>
  `;
  
  // Append the new row to the container
  container.appendChild(inputRow);
  
  // Verify addition
  const newInputs = container.querySelectorAll('.frequency-input').length;
  console.log(`Number of frequency inputs after adding: ${newInputs}`);
  
  if (newInputs <= existingInputs) {
    console.error('Failed to add new frequency input!');
  } else {
    console.log('Successfully added new frequency input');
  }
}

// Add a power level input field
function addPowerLevelInput() {
  const container = document.getElementById('power-inputs');
  
  if (!container) {
    console.error('Power inputs container not found');
    return;
  }
  
  const inputRow = document.createElement('div');
  inputRow.className = 'input-row';
  
  inputRow.innerHTML = `
    <input type="text" class="power-input" placeholder="e.g. 10">
    <button class="remove-input"><i class='bx bx-trash'></i></button>
  `;
  
  container.appendChild(inputRow);
  console.log('Added new power level input');
}

// Open the edit band modal
function openEditBandModal(bandSection) {
  // Get current band data
  const bandName = bandSection.querySelector('.band-header h2').textContent.trim();
  
  // Extract frequencies from ONLY the first table - this prevents duplicates
  const firstTable = bandSection.querySelector('.matrix-table');
  const frequencies = [];
  
  if (firstTable) {
    const frequencyHeaders = firstTable.querySelectorAll('thead th:not(:first-child)');
    frequencyHeaders.forEach(header => {
      let freq = header.textContent.trim();
      // Remove 'MHz' if present
      freq = freq.replace('MHz', '');
      // Only add if not already in the array
      if (!frequencies.includes(freq)) {
        frequencies.push(freq);
      }
    });
  }
  
  // Get power levels from the first table if it exists
  const powerLevels = [];
  if (firstTable) {
    const powerRows = firstTable.querySelectorAll('tbody tr');
    powerRows.forEach(row => {
      let power = row.querySelector('td:first-child').textContent.trim();
      // Remove 'dBm' if present
      power = power.replace('dBm', '').trim();
      // Only add if it has a number (to filter out rows like "Measured" or "Diff.")
      if (!isNaN(parseFloat(power)) && !powerLevels.includes(power)) {
        powerLevels.push(power);
      }
    });
  }
  
  // Get selected tests - using standard DOM methods
  const matrixHeaders = bandSection.querySelectorAll('.matrix-header');
  const selectedTests = {
    txPower: false,
    txCurrent: false,
    obw: false,
    freqAccuracy: false
  };
  
  matrixHeaders.forEach(header => {
    const spanElement = header.querySelector('span');
    if (spanElement) {
      const testText = spanElement.textContent.trim();
      if (testText.includes('Tx Power')) {
        selectedTests.txPower = true;
      } else if (testText.includes('Tx Current')) {
        selectedTests.txCurrent = true;
      } else if (testText.includes('OBW')) {
        selectedTests.obw = true;
      } else if (testText.includes('Frequency Accuracy')) {
        selectedTests.freqAccuracy = true;
      }
    }
  });
  
  // Populate the edit modal with the current values
  populateEditBandModal(bandName, frequencies, powerLevels, selectedTests);
  
  // Open the modal
  const modal = document.getElementById('band-modal');
  
  // Update modal title to indicate editing
  modal.querySelector('.modal-header h2').textContent = 'Edit Band';
  
  // Update save button
  const saveButton = modal.querySelector('#save-band-button');
  // Store reference to the band section being edited
  saveButton.dataset.editBandId = bandSection.id;
  
  modal.classList.add('active');
}

// Function to populate the edit band modal with current values
function populateEditBandModal(bandName, frequencies, powerLevels, selectedTests) {
  console.log('Populating edit band modal with:');
  console.log('- Band name:', bandName);
  console.log('- Frequencies:', frequencies);
  console.log('- Power levels:', powerLevels);
  
  // Set band name
  document.getElementById('band-name').value = bandName;
  
  // COMPLETELY clear existing frequency inputs (remove all inputs first)
  const frequencyContainer = document.getElementById('frequency-inputs');
  if (!frequencyContainer) {
    console.error('Frequency container not found!');
    return;
  }
  
  frequencyContainer.innerHTML = '';
  
  // Add new frequency inputs for each frequency
  if (frequencies.length > 0) {
    console.log(`Adding ${frequencies.length} frequency inputs`);
    frequencies.forEach((freq, index) => {
      // Create a new input row
      const inputRow = document.createElement('div');
      inputRow.className = 'input-row';
      
      inputRow.innerHTML = `
        <input type="text" class="frequency-input" placeholder="e.g. 700" value="${freq}">
        <button class="remove-input"><i class='bx bx-trash'></i></button>
      `;
      
      frequencyContainer.appendChild(inputRow);
      console.log(`Added frequency input ${index + 1}: ${freq}`);
    });
  } else {
    // Add at least one empty frequency input if none exist
    console.log('No frequencies found, adding default empty input');
    const inputRow = document.createElement('div');
    inputRow.className = 'input-row';
    
    inputRow.innerHTML = `
      <input type="text" class="frequency-input" placeholder="e.g. 700">
      <button class="remove-input"><i class='bx bx-trash'></i></button>
    `;
    
    frequencyContainer.appendChild(inputRow);
  }
  
  // Check that inputs were added correctly
  const addedInputs = frequencyContainer.querySelectorAll('.frequency-input');
  console.log(`Frequency inputs added: ${addedInputs.length}`);
  
  // COMPLETELY clear existing power inputs (remove all inputs first)
  const powerContainer = document.getElementById('power-inputs');
  powerContainer.innerHTML = '';
  
  // Add new power level inputs for each power level
  if (powerLevels.length > 0) {
    powerLevels.forEach(power => {
      // Create a new input row
      const inputRow = document.createElement('div');
      inputRow.className = 'input-row';
      
      inputRow.innerHTML = `
        <input type="text" class="power-input" placeholder="e.g. 10" value="${power}">
        <button class="remove-input"><i class='bx bx-trash'></i></button>
      `;
      
      powerContainer.appendChild(inputRow);
    });
  } else {
    // Add at least one empty power input if none exist
    const inputRow = document.createElement('div');
    inputRow.className = 'input-row';
    
    inputRow.innerHTML = `
      <input type="text" class="power-input" placeholder="e.g. 10">
      <button class="remove-input"><i class='bx bx-trash'></i></button>
    `;
    
    powerContainer.appendChild(inputRow);
  }
  // Set checkboxes for selected tests
  document.querySelector('input[name="test-txpower"]').checked = selectedTests.txPower;
  document.querySelector('input[name="test-txcurrent"]').checked = selectedTests.txCurrent;
  document.querySelector('input[name="test-obw"]').checked = selectedTests.obw;
  document.querySelector('input[name="test-freqaccuracy"]').checked = selectedTests.freqAccuracy;
}

// Function to confirm band deletion
function confirmDeleteBand(bandSection, bandName) {
  // If custom modal is available, use it
  if (window.customModal) {
    window.customModal.confirm(
      `Are you sure you want to delete ${bandName}? This action cannot be undone.`,
      'Delete Band',
      'warning'
    ).then(confirmed => {
      if (confirmed) {
        deleteBand(bandSection);
      }
    });
  } else {
    // Fallback to standard confirm
    const confirmed = confirm(`Are you sure you want to delete ${bandName}? This action cannot be undone.`);
    if (confirmed) {
      deleteBand(bandSection);
    }
  }
}

// Function to delete the band
function deleteBand(bandSection) {
  // Animate the removal
  bandSection.style.transition = 'opacity 0.3s, max-height 0.5s';
  bandSection.style.opacity = '0';
  bandSection.style.maxHeight = '0';
  bandSection.style.overflow = 'hidden';
  
  // Remove from DOM after animation completes
  setTimeout(() => {
    bandSection.remove();
    
    // Show confirmation if no bands left - use safer method call
    const remainingBands = document.querySelectorAll('.band-section');
    if (remainingBands.length === 0 && window.customModal) {
      // Check which method is available and use it
      if (typeof window.customModal.info === 'function') {
        window.customModal.info('All bands have been removed. You can add new bands using the "Add Band" button.', 'Band Management');
      } else if (typeof window.customModal.success === 'function') {
        window.customModal.success('All bands have been removed. You can add new bands using the "Add Band" button.', 'Band Management');
      } else if (typeof window.customModal.alert === 'function') {
        window.customModal.alert('All bands have been removed. You can add new bands using the "Add Band" button.', 'Band Management');
      }
      // If none of the above methods exist, just don't show any notification
    }
  }, 500);
  
  // Show confirmation
  if (window.customModal) {
    if (typeof window.customModal.success === 'function') {
      window.customModal.success('Band deleted successfully', 'Band Management');
    } else if (typeof window.customModal.alert === 'function') {
      window.customModal.alert('Band deleted successfully', 'Band Management');
    }
    // If neither method exists, don't show any notification
  }
}

// Save the band configuration
function saveBand() {
  console.log('saveBand function called');
  
  // Get band name
  const bandName = document.getElementById('band-name').value.trim();
  console.log('Band name:', bandName);
  
  // Validate band name
  if (!bandName) {
    console.error('Band name validation failed');
    if (window.customModal) {
      window.customModal.error('Please enter a band name', 'Validation Error');
    } else {
      alert('Please enter a band name');
    }
    return;
  }
  
  // Get frequencies - explicitly log the DOM elements found
  const frequencyInputs = document.querySelectorAll('#frequency-inputs .frequency-input');
  console.log('Found frequency inputs:', frequencyInputs.length);
  
  const frequencies = [];
  
  for (let i = 0; i < frequencyInputs.length; i++) {
    const input = frequencyInputs[i];
    const value = input.value.trim();
    console.log(`Frequency input ${i+1} value: "${value}"`);
    
    if (!value) {
      console.error('Frequency validation failed - empty input');
      if (window.customModal) {
        window.customModal.error('Please fill in all frequency fields', 'Validation Error');
      } else {
        alert('Please fill in all frequency fields');
      }
      return;
    }
    frequencies.push(value);
  }
  
  console.log('Collected frequencies:', frequencies);
  
  // Get power levels
  const powerInputs = document.querySelectorAll('#power-inputs .power-input');
  console.log('Found power inputs:', powerInputs.length);
  
  const powerLevels = [];
  
  for (let i = 0; i < powerInputs.length; i++) {
    const input = powerInputs[i];
    const value = input.value.trim();
    console.log(`Power input ${i+1} value:`, value);
    
    if (!value) {
      console.error('Power level validation failed - empty input');
      if (window.customModal) {
        window.customModal.error('Please fill in all power level fields', 'Validation Error');
      } else {
        alert('Please fill in all power level fields');
      }
      return;
    }
    powerLevels.push(value);
  }
  
  console.log('Collected power levels:', powerLevels);
  
  // Get selected tests
  const selectedTests = {
    txPower: document.querySelector('input[name="test-txpower"]').checked,
    txCurrent: document.querySelector('input[name="test-txcurrent"]').checked,
    obw: document.querySelector('input[name="test-obw"]').checked,
    freqAccuracy: document.querySelector('input[name="test-freqaccuracy"]').checked
  };
  
  console.log('Selected tests:', selectedTests);
  
  // Check if at least one test is selected
  if (!selectedTests.txPower && !selectedTests.txCurrent && 
      !selectedTests.obw && !selectedTests.freqAccuracy) {
    console.error('Test selection validation failed - no tests selected');
    if (window.customModal) {
      window.customModal.error('Please select at least one test', 'Validation Error');
    } else {
      alert('Please select at least one test');
    }
    return;
  }
  
  const saveButton = document.getElementById('save-band-button');
  const editBandId = saveButton ? saveButton.dataset.editBandId : null;
  console.log('Edit band ID:', editBandId);
  
  if (editBandId) {
    // We're editing an existing band
    console.log('Editing existing band with ID:', editBandId);
    const bandSection = document.getElementById(editBandId);
    
    if (bandSection) {
      // Remove the existing band section
      bandSection.remove();
      
      // Create a new one with the updated data
      createBandSection(bandName, frequencies, powerLevels, selectedTests);
      
      // Show confirmation message
      if (window.customModal) {
        window.customModal.success(`Band ${bandName} has been updated successfully`, 'Success');
      } else {
        alert(`Band ${bandName} has been updated successfully`);
      }
    } else {
      console.error('Could not find band section with ID:', editBandId);
    }
    
    // Clear the edit data attribute
    saveButton.removeAttribute('data-edit-band-id');
    
    // Reset modal title
    const modalTitle = document.querySelector('#band-modal .modal-header h2');
    if (modalTitle) {
      modalTitle.textContent = 'Add New Band';
    }
  } else {
    // We're adding a new band
    console.log('Adding new band:', bandName);
    createBandSection(bandName, frequencies, powerLevels, selectedTests);
    
    // Show confirmation message
    if (window.customModal) {
      window.customModal.success(`Band ${bandName} has been added successfully`, 'Success');
    } else {
      alert(`Band ${bandName} has been added successfully`);
    }
  }
  
  // Close the modal
  closeAddBandModal();
}

// Create a new band section
function createBandSection(bandName, frequencies, powerLevels, selectedTests) {
  console.log('Creating band section with name:', bandName);
  console.log('Frequencies:', frequencies);
  console.log('Power levels:', powerLevels);
  console.log('Selected tests:', selectedTests);
  
  // Create band ID (for DOM)
  const bandId = 'band-' + bandName.toLowerCase().replace(/\s+/g, '-');
  
  // Create the band section container
  const bandSection = document.createElement('div');
  bandSection.className = 'band-section';
  bandSection.id = bandId;
  
  // Create the band header with edit and delete buttons
  const bandHeader = document.createElement('div');
  bandHeader.className = 'band-header';
  bandHeader.innerHTML = `
    <div class="band-title-container">
      <h2>${bandName}</h2>
      <div class="band-actions">
        <button class="icon-button edit-band" title="Edit Band">
          <i class='bx bx-edit'></i>
        </button>
        <button class="icon-button delete-band" title="Delete Band">
          <i class='bx bx-trash'></i>
        </button>
      </div>
    </div>
  `;
  
  // Create the test matrices container
  const testMatrices = document.createElement('div');
  testMatrices.className = 'test-matrices';
  
  // Create first row of tests (TX Power and TX Current)
  if (selectedTests.txPower || selectedTests.txCurrent) {
    const row1 = document.createElement('div');
    row1.className = 'test-row';
    
    // Add TX Power matrix if selected
    if (selectedTests.txPower) {
      row1.appendChild(createTestMatrix('Tx Power', frequencies, powerLevels, true));
    }
    
    // Add TX Current Consumption matrix if selected
    if (selectedTests.txCurrent) {
      row1.appendChild(createTestMatrix('Tx Current Consumption', frequencies, powerLevels, true));
    }
    
    testMatrices.appendChild(row1);
  }
  
  // Create second row of tests (OBW and Frequency Accuracy)
  if (selectedTests.obw || selectedTests.freqAccuracy) {
    const row2 = document.createElement('div');
    row2.className = 'test-row';
    
    // Add OBW matrix if selected
    if (selectedTests.obw) {
      row2.appendChild(createTestMatrix('OBW', frequencies, ['DR 7', 'DR 12'], false));
    }
    
    // Add Frequency Accuracy matrix if selected
    if (selectedTests.freqAccuracy) {
      row2.appendChild(createTestMatrix('Frequency Accuracy', frequencies, ['Measured', 'Diff.'], false));
    }
    
    testMatrices.appendChild(row2);
  }
  
  // Assemble the band section
  bandSection.appendChild(bandHeader);
  bandSection.appendChild(testMatrices);
  
  // Add to the page container
  const pageContainer = document.querySelector('.page-container');
  
  if (pageContainer) {
    const testControls = pageContainer.querySelector('.test-controls');
    
    if (testControls) {
      // Insert the band section after the test controls
      if (testControls.nextSibling) {
        pageContainer.insertBefore(bandSection, testControls.nextSibling);
      } else {
        pageContainer.appendChild(bandSection);
      }
    } else {
      // If test controls not found, just append to the page container
      pageContainer.appendChild(bandSection);
    }
    
    console.log('Band section added to page');
    } else {
    console.error('Could not find page container');
  }
  
  // Initialize the inputs in the new tables
  initializeNewTableCells(bandSection);
}

// Create a test matrix
function createTestMatrix(testName, frequencies, rowLabels, showPowerUnits) {
  console.log(`Creating test matrix for ${testName}`);
  console.log('Frequencies to use:', frequencies);
  console.log('Row labels to use:', rowLabels);
  
  // Create matrix container
  const matrix = document.createElement('div');
  matrix.className = 'test-matrix';
  
  // Create matrix header
  const header = document.createElement('div');
  header.className = 'matrix-header';
  header.innerHTML = `
    <label class="checkbox">
      <input type="checkbox" checked>
      <span>${testName}</span>
    </label>
  `;
  
  // Create table container
  const tableContainer = document.createElement('div');
  tableContainer.className = 'table-container';
  
  // Create table
  const table = document.createElement('table');
  table.className = 'matrix-table';
  
  // Create table header with frequencies
  const thead = document.createElement('thead');
  let headerRow = '<tr><th></th>';
  
  frequencies.forEach(freq => {
    headerRow += `<th>${freq}MHz</th>`;
    console.log(`Added column for ${freq}MHz`);
  });
  
  headerRow += '</tr>';
  thead.innerHTML = headerRow;
  
  // Create table body with rows for each power level or parameter
  const tbody = document.createElement('tbody');
  
  rowLabels.forEach(label => {
    const row = document.createElement('tr');
    
    // Create the first cell with the label
    const firstCell = document.createElement('td');
    firstCell.textContent = showPowerUnits ? `${label} dBm` : label;
    row.appendChild(firstCell);
    console.log(`Added row for ${firstCell.textContent}`);
    
    // Create cells for each frequency
    frequencies.forEach(freq => {
      const cell = document.createElement('td');
      row.appendChild(cell);
      console.log(`Added cell for ${label} at ${freq}MHz`);
    });
    
    tbody.appendChild(row);
  });
  
  // Assemble the table
  table.appendChild(thead);
  table.appendChild(tbody);
  tableContainer.appendChild(table);
  
  // Assemble the matrix
  matrix.appendChild(header);
  matrix.appendChild(tableContainer);
  
  // Debug check - verify the completed matrix
  setTimeout(() => {
    const headerCells = matrix.querySelectorAll('thead th').length;
    const rows = matrix.querySelectorAll('tbody tr').length;
    const cells = matrix.querySelectorAll('tbody td').length;
    
    console.log(`Matrix structure check - header cells: ${headerCells}, rows: ${rows}, body cells: ${cells}`);
  }, 0);
  
  console.log(`Test matrix for ${testName} created successfully`);
  return matrix;
}

// Initialize input fields for newly created tables
function initializeNewTableCells(container) {
  console.log('Initializing input fields for newly created tables');
  
  // Find all table cells that need inputs
  const tableCells = container.querySelectorAll('.matrix-table td:not(:first-child)');
  console.log(`Found ${tableCells.length} cells that need input fields`);
  
  // Initialize each cell with an input field
  tableCells.forEach((cell, index) => {
    // Check if cell already has an input to avoid duplicates
    if (cell.querySelector('input')) {
      console.log(`Cell ${index + 1} already has an input, skipping`);
      return;
    }
    
    // Create input element
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'cell-input';
    input.placeholder = '-';
    
    // Append input to cell
    cell.appendChild(input);
    console.log(`Input field initialized in cell ${index + 1}`);
  });
  
  // Add event listener for newly created checkboxes
  const testCheckboxes = container.querySelectorAll('.matrix-header input[type="checkbox"]');
  console.log(`Found ${testCheckboxes.length} checkboxes in the new tables`);
  
  testCheckboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('change', function() {
      console.log(`Checkbox ${index + 1} change event triggered`);
      
      const testMatrix = this.closest('.test-matrix');
      if (testMatrix) {
        // Find the table container specifically
        const tableContainer = testMatrix.querySelector('.table-container');
        if (!tableContainer) {
          console.error(`Could not find table container for checkbox ${index + 1}`);
          return;
        }
        
        if (this.checked) {
          // When re-checked, make sure to remove the disabled class from the table container
          tableContainer.classList.remove('disabled');
          console.log(`Enabled table container for checkbox ${index + 1}`);
        } else {
          // When unchecked, add the disabled class to the table container only
          tableContainer.classList.add('disabled');
          console.log(`Disabled table container for checkbox ${index + 1}`);
        }
      } else {
        console.error(`Could not find test matrix for checkbox ${index + 1}`);
      }
    });
    
    console.log(`Event listener added to checkbox ${index + 1}`);
  });
  
  // Verify all inputs were created successfully
  const createdInputs = container.querySelectorAll('.cell-input');
  console.log(`Initialized table check: Expected ${tableCells.length} inputs, created ${createdInputs.length} inputs`);
}

// Helper function to find an element containing specific text
function findElementContainingText(container, selector, text) {
  const elements = container.querySelectorAll(selector);
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].textContent.includes(text)) {
      return elements[i];
    }
  }
  return null;
}

// Helper function to find all elements containing specific text
function findElementsContainingText(container, selector, text) {
  const elements = container.querySelectorAll(selector);
  return Array.from(elements).filter(element => 
    element.textContent.includes(text)
  );
}

// Add a test function to help debug frequency inputs
function testFrequencyInputs() {
  const container = document.getElementById('frequency-inputs');
  if (!container) {
    console.error('Frequency container not found');
    return;
  }
  
  console.log('Frequency container:', container);
  
  const inputs = container.querySelectorAll('.frequency-input');
  console.log('Found frequency inputs:', inputs.length);
  
  inputs.forEach((input, i) => {
    console.log(`Input ${i+1} value:`, input.value);
  });
  
  return inputs.length;
}

// Make the initialization function available globally for renderer.js
window.initCellularPage = initCellularPage;

// Make test function available globally
window.testFrequencyInputs = testFrequencyInputs;