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
  const testControls = document.querySelector('.test-controls');
  
  if (testControls && pageContainer) {
    pageContainer.insertBefore(bandSection, testControls.nextSibling);
  } else {
    pageContainer.appendChild(bandSection);
  }
  
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

// Initialize input fields for newly created tables
function initializeNewTableCells(container) {
  const tableCells = container.querySelectorAll('.matrix-table td:not(:first-child)');
  tableCells.forEach(cell => {
    convertCellToInput(cell);
  });
  
  // Add event listener for newly created checkboxes
  const testCheckboxes = container.querySelectorAll('.matrix-header input[type="checkbox"]');
  testCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      // Find the parent test-matrix
      const testMatrix = this.closest('.test-matrix');
      if (testMatrix) {
        // Find the table container specifically
        const tableContainer = testMatrix.querySelector('.table-container');
        if (tableContainer) {
          if (this.checked) {
            // When re-checked, make sure to remove the disabled class from the table container
            tableContainer.classList.remove('disabled');
          } else {
            // When unchecked, add the disabled class to the table container only
            tableContainer.classList.add('disabled');
          }
        }
      }
    });
  });
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

// Make the initialization function available globally for renderer.js
window.initLoraPage = initLoraPage;// This function will be called when the LoRa page is loaded
function initLoraPage() {
  console.log('LoRa test page initialized');
  
  // Get references to the elements
  const startTestButton = document.getElementById('start-test');
  const addBandButton = document.getElementById('add-band-button');
  const testCheckboxes = document.querySelectorAll('.matrix-header input[type="checkbox"]');
  const tableCells = document.querySelectorAll('.matrix-table td:not(:first-child)');
  
  // Add event listener to the Start Test button
  if (startTestButton) {
    startTestButton.addEventListener('click', startLoRaTest);
  }
  
  // Add event listener to the Add Band button
  if (addBandButton) {
    addBandButton.addEventListener('click', openAddBandModal);
  }
  
  // Set up event listeners for the test selection checkboxes
  testCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      // Find the parent test-matrix
      const testMatrix = this.closest('.test-matrix');
      if (testMatrix) {
        // Find the table container specifically
        const tableContainer = testMatrix.querySelector('.table-container');
        if (tableContainer) {
          if (this.checked) {
            // When re-checked, make sure to remove the disabled class from the table container
            tableContainer.classList.remove('disabled');
          } else {
            // When unchecked, add the disabled class to the table container only
            tableContainer.classList.add('disabled');
          }
        }
      }
    });
  });

  // Convert all cells to input fields by default
  tableCells.forEach(cell => {
    convertCellToInput(cell);
  });
  
  // Set up modal event listeners
  setupModalEventListeners();
  
  // Set up event delegation for dynamically created elements
  setupEventDelegation();
  
  // Update band headers to include edit/delete buttons
  updateExistingBandHeaders();
}

// Setup modal event listeners
function setupModalEventListeners() {
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

// Function to handle starting the test
function startLoRaTest() {
  console.log('Starting LoRa Test...');
  
  // Get selected test types
  const selectedTests = [];
  document.querySelectorAll('.matrix-header input[type="checkbox"]:checked').forEach(checkbox => {
    const testName = checkbox.nextElementSibling.textContent.trim();
    selectedTests.push(testName);
  });
  
  if (selectedTests.length === 0) {
    // Use custom modal instead of alert
    if (window.customModal) {
      window.customModal.warning('Please select at least one test to run.', 'Test Selection');
    } else {
      alert('Please select at least one test to run.');
    }
    return;
  }
  
  console.log('Selected tests:', selectedTests);
  
  // Clear previous results
  clearTestResults();
  
  // Show loading state
  document.getElementById('start-test').textContent = 'Running Test...';
  document.getElementById('start-test').disabled = true;
  
  // Simulate test running
  simulateTestRun(selectedTests);
}

// Function to clear all test results
function clearTestResults() {
  document.querySelectorAll('.matrix-table td:not(:first-child) input').forEach(input => {
    input.value = '';
  });
}

// Function to simulate a test run with sample data
function simulateTestRun(selectedTests) {
  // Sample data for each test type
  const sampleData = {
    'Tx Power': {
      '0 dBm': {'917MHz': '-30.2', '918.5MHz': '-30.5', '919.7MHz': '-30.3'},
      '14 dBm': {'917MHz': '-16.3', '918.5MHz': '-16.1', '919.7MHz': '-16.4'},
      '20 dBm': {'917MHz': '-10.2', '918.5MHz': '-10.3', '919.7MHz': '-10.1'},
      '30 dBm': {'917MHz': '-0.3', '918.5MHz': '-0.2', '919.7MHz': '-0.4'}
    },
    'Tx Current Consumption': {
      '0 dBm': {'917MHz': '22', '918.5MHz': '23', '919.7MHz': '22'},
      '14 dBm': {'917MHz': '35', '918.5MHz': '36', '919.7MHz': '35'},
      '20 dBm': {'917MHz': '48', '918.5MHz': '49', '919.7MHz': '48'},
      '30 dBm': {'917MHz': '65', '918.5MHz': '66', '919.7MHz': '65'}
    },
    'OBW': {
      'DR 7': {'917MHz': '125', '918.5MHz': '125', '919.7MHz': '125'},
      'DR 12': {'917MHz': '500', '918.5MHz': '500', '919.7MHz': '500'}
    },
    'Frequency Accuracy': {
      'Measured': {'917MHz': '±0.1', '918.5MHz': '±0.1', '919.7MHz': '±0.1'},
      'Diff.': {'917MHz': '±0.2', '918.5MHz': '±0.2', '919.7MHz': '±0.2'}
    }
  };
  
  // Simulate a test run with delays
  let delay = 500;
  
  // For each band section
  const bandSections = document.querySelectorAll('.band-section');
  
  bandSections.forEach((bandSection) => {
    selectedTests.forEach(testType => {
      // Find the table for this test type using our helper function
      const testHeader = findElementContainingText(bandSection, '.matrix-header .checkbox span', testType);
      if (!testHeader) return;
      
      const testContainer = testHeader.closest('.test-matrix');
      if (!testContainer) return;
      
      const table = testContainer.querySelector('.matrix-table');
      const rows = table.querySelectorAll('tbody tr');
      
      // For each row in this test
      rows.forEach((row, rowIndex) => {
        const rowLabel = row.querySelector('td:first-child').textContent.trim();
        const cells = row.querySelectorAll('td:not(:first-child)');
        
        // For each cell in this row
        cells.forEach((cell, cellIndex) => {
          const headers = table.querySelectorAll('thead th');
          const freqLabel = headers[cellIndex + 1].textContent.trim();
          
          // Add a delay for each cell to simulate real-time data coming in
          setTimeout(() => {
            if (sampleData[testType] && sampleData[testType][rowLabel] && sampleData[testType][rowLabel][freqLabel]) {
              const input = cell.querySelector('input');
              if (input) {
                input.value = sampleData[testType][rowLabel][freqLabel];
                input.classList.add('updated');
                
                // Remove the updated class after animation
                setTimeout(() => {
                  input.classList.remove('updated');
                }, 1000);
              }
            }
            
            // Reset button state when all data is filled
            if (rowIndex === rows.length - 1 && cellIndex === cells.length - 1 && 
                testType === selectedTests[selectedTests.length - 1] &&
                bandSection === bandSections[bandSections.length - 1]) {
              setTimeout(() => {
                document.getElementById('start-test').textContent = 'Start Test';
                document.getElementById('start-test').disabled = false;
                
                // Show test completion notification
                if (window.customModal) {
                  window.customModal.success('Test completed successfully!', 'LoRa Test');
                }
              }, 500);
            }
          }, delay);
          
          delay += 50; // Increase delay for next cell
        });
      });
    });
  });
}

// Function to convert cell to input field
function convertCellToInput(cell) {
  // Create input element
  const input = document.createElement('input');
  input.type = 'text';
  input.value = ''; // Start with empty value
  input.placeholder = '-';
  input.className = 'cell-input';
  
  // Clear the cell and add the input
  cell.textContent = '';
  cell.appendChild(input);
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
  frequencyContainer.innerHTML = '';
  
  // Add default frequency inputs
  for (let i = 0; i < 3; i++) {
    const inputRow = document.createElement('div');
    inputRow.className = 'input-row';
    inputRow.innerHTML = `
      <input type="text" class="frequency-input" placeholder="e.g. ${915 + i*2}">
      <button class="remove-input"><i class='bx bx-trash'></i></button>
    `;
    frequencyContainer.appendChild(inputRow);
  }
  
  // Reset power levels
  const powerContainer = document.getElementById('power-inputs');
  powerContainer.innerHTML = '';
  
  // Add default power level inputs
  const defaultPowers = [0, 14, 20];
  for (let i = 0; i < defaultPowers.length; i++) {
    const inputRow = document.createElement('div');
    inputRow.className = 'input-row';
    inputRow.innerHTML = `
      <input type="text" class="power-input" placeholder="e.g. ${defaultPowers[i]}">
      <button class="remove-input"><i class='bx bx-trash'></i></button>
    `;
    powerContainer.appendChild(inputRow);
  }
  
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
    <input type="text" class="frequency-input" placeholder="e.g. 915">
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
        <input type="text" class="frequency-input" placeholder="e.g. 915" value="${freq}">
        <button class="remove-input"><i class='bx bx-trash'></i></button>
      `;
      
      frequencyContainer.appendChild(inputRow);
    });
  } else {
    // Add at least one empty frequency input if none exist
    const inputRow = document.createElement('div');
    inputRow.className = 'input-row';
    
    inputRow.innerHTML = `
      <input type="text" class="frequency-input" placeholder="e.g. 915">
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
}value.trim();
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
    const value = input.