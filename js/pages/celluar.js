// Cellular page functionality
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

// Set up all event listeners
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
    addFrequencyButton.addEventListener('click', addFrequencyInput);
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
  // Reset band name
  document.getElementById('band-name').value = '';
  
  // Reset frequencies
  const frequencyContainer = document.getElementById('frequency-inputs');
  while (frequencyContainer.children.length > 1) {
    frequencyContainer.removeChild(frequencyContainer.lastChild);
  }
  frequencyContainer.querySelector('.frequency-input').value = '';
  
  // Reset power levels
  const powerContainer = document.getElementById('power-inputs');
  while (powerContainer.children.length > 1) {
    powerContainer.removeChild(powerContainer.lastChild);
  }
  powerContainer.querySelector('.power-input').value = '';
  
  // Reset checkboxes
  document.querySelector('input[name="test-txpower"]').checked = true;
  document.querySelector('input[name="test-txcurrent"]').checked = true;
  document.querySelector('input[name="test-obw"]').checked = true;
  document.querySelector('input[name="test-freqaccuracy"]').checked = true;
  
  // Reset modal title
  document.querySelector('#band-modal .modal-header h2').textContent = 'Add New Band';
  
  // Clear edit band id if present
  const saveButton = document.getElementById('save-band-button');
  if (saveButton) {
    saveButton.removeAttribute('data-edit-band-id');
  }
}

// Add a frequency input field
function addFrequencyInput() {
  const container = document.getElementById('frequency-inputs');
  
  const inputRow = document.createElement('div');
  inputRow.className = 'input-row';
  
  inputRow.innerHTML = `
    <input type="text" class="frequency-input" placeholder="e.g. 700">
    <button class="remove-input"><i class='bx bx-trash'></i></button>
  `;
  
  container.appendChild(inputRow);
}

// Add a power level input field
function addPowerLevelInput() {
  const container = document.getElementById('power-inputs');
  
  const inputRow = document.createElement('div');
  inputRow.className = 'input-row';
  
  inputRow.innerHTML = `
    <input type="text" class="power-input" placeholder="e.g. 10">
    <button class="remove-input"><i class='bx bx-trash'></i></button>
  `;
  
  container.appendChild(inputRow);
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
  // Set band name
  document.getElementById('band-name').value = bandName;
  
  // COMPLETELY clear existing frequency inputs (remove all inputs first)
  const frequencyContainer = document.getElementById('frequency-inputs');
  frequencyContainer.innerHTML = '';
  
  // Add new frequency inputs for each frequency
  if (frequencies.length > 0) {
    frequencies.forEach(freq => {
      // Create a new input row
      const inputRow = document.createElement('div');
      inputRow.className = 'input-row';
      
      inputRow.innerHTML = `
        <input type="text" class="frequency-input" placeholder="e.g. 700" value="${freq}">
        <button class="remove-input"><i class='bx bx-trash'></i></button>
      `;
      
      frequencyContainer.appendChild(inputRow);
    });
  } else {
    // Add at least one empty frequency input if none exist
    const inputRow = document.createElement('div');
    inputRow.className = 'input-row';
    
    inputRow.innerHTML = `
      <input type="text" class="frequency-input" placeholder="e.g. 700">
      <button class="remove-input"><i class='bx bx-trash'></i></button>
    `;
    
    frequencyContainer.appendChild(inputRow);
  }
  
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
  // Get band name
  const bandName = document.getElementById('band-name').value.trim();
  
  // Validate band name
  if (!bandName) {
    if (window.customModal) {
      window.customModal.error('Please enter a band name', 'Validation Error');
    } else {
      alert('Please enter a band name');
    }
    return;
  }
  
  // Get frequencies
  const frequencyInputs = document.querySelectorAll('#frequency-inputs .frequency-input');
  const frequencies = [];
  
  for (const input of frequencyInputs) {
    const value = input.value.trim();
    if (!value) {
      if (window.customModal) {
        window.customModal.error('Please fill in all frequency fields', 'Validation Error');
      } else {
        alert('Please fill in all frequency fields');
      }
      return;
    }
    frequencies.push(value);
  }
  
  // Get power levels
  const powerInputs = document.querySelectorAll('#power-inputs .power-input');
  const powerLevels = [];
  
  for (const input of powerInputs) {
    const value = input.value.trim();
    if (!value) {
      if (window.customModal) {
        window.customModal.error('Please fill in all power level fields', 'Validation Error');
      } else {
        alert('Please fill in all power level fields');
      }
      return;
    }
    powerLevels.push(value);
  }
  
  // Get selected tests
  const selectedTests = {
    txPower: document.querySelector('input[name="test-txpower"]').checked,
    txCurrent: document.querySelector('input[name="test-txcurrent"]').checked,
    obw: document.querySelector('input[name="test-obw"]').checked,
    freqAccuracy: document.querySelector('input[name="test-freqaccuracy"]').checked
  };
  
  // Check if at least one test is selected
  if (!selectedTests.txPower && !selectedTests.txCurrent && 
      !selectedTests.obw && !selectedTests.freqAccuracy) {
    if (window.customModal) {
      window.customModal.error('Please select at least one test', 'Validation Error');
    } else {
      alert('Please select at least one test');
    }
    return;
  }
  
  const saveButton = document.getElementById('save-band-button');
  const editBandId = saveButton.dataset.editBandId;
  
  if (editBandId) {
    // We're editing an existing band
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
    }
    
    // Clear the edit data attribute
    saveButton.removeAttribute('data-edit-band-id');
    
    // Reset modal title
    document.querySelector('#band-modal .modal-header h2').textContent = 'Add New Band';
  } else {
    // We're adding a new band
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
  
  // Add to the page container (before test controls)
  const pageContainer = document.querySelector('.page-container');
  pageContainer.appendChild(bandSection);
  
  // Initialize the inputs in the new tables
  initializeNewTableCells(bandSection);
}

// Create a test matrix
function createTestMatrix(testName, frequencies, rowLabels, showPowerUnits) {
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
  
  // Create table header
  const thead = document.createElement('thead');
  let headerRow = '<tr><th></th>';
  
  frequencies.forEach(freq => {
    headerRow += `<th>${freq}MHz</th>`;
  });
  
  headerRow += '</tr>';
  thead.innerHTML = headerRow;
  
  // Create table body
  const tbody = document.createElement('tbody');
  
  rowLabels.forEach(label => {
    const row = document.createElement('tr');
    
    // Create the first cell with the label
    const firstCell = document.createElement('td');
    firstCell.textContent = showPowerUnits ? `${label} dBm` : label;
    row.appendChild(firstCell);
    
    // Create cells for each frequency
    frequencies.forEach(() => {
      const cell = document.createElement('td');
      row.appendChild(cell);
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
  
  return matrix;
}

function initializeNewTableCells(container) {
  const tableCells = container.querySelectorAll('.matrix-table td:not(:first-child)');
  tableCells.forEach(cell => {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'cell-input';
    input.placeholder = '-';
    cell.appendChild(input);
  });
  
  // Add event listener for newly created checkboxes - UPDATED
  const checkboxes = container.querySelectorAll('.matrix-header input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
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
}

// Make the initialization function available globally for renderer.js
window.initCellularPage = initCellularPage;
