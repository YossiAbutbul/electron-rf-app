// Cellular page functionality
function initCellularPage() {
  console.log('Cellular page initialized');
  
  // Initialize all cells with input fields
  initializeTableCells();
  
  // Setup event listeners
  setupEventListeners();
  
  // Update existing band headers to add edit/delete buttons
  updateExistingBandHeaders();
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

// Set up all event listeners
function setupEventListeners() {
  // Test matrix checkbox functionality
  const testCheckboxes = document.querySelectorAll('.matrix-header input[type="checkbox"]');
  testCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const testMatrix = this.closest('.test-matrix');
      if (testMatrix) {
        if (this.checked) {
          testMatrix.classList.remove('disabled');
        } else {
          testMatrix.classList.add('disabled');
        }
      }
    });
  });

  // Start test button
  const startTestButton = document.getElementById('start-test');
  if (startTestButton) {
    startTestButton.addEventListener('click', startCellularTest);
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

  // Setup event delegation for dynamically created elements
  setupEventDelegation();
}

// Update existing band headers to include edit and delete buttons
function updateExistingBandHeaders() {
  // This function can be called during page initialization
  const existingBandHeaders = document.querySelectorAll('.band-header');
  
  existingBandHeaders.forEach(header => {
    // Check if the header already has the title container structure
    if (header.querySelector('.band-title-container')) {
      // Already has the right structure, but ensure event listeners are attached
      const bandSection = header.closest('.band-section');
      const bandName = header.querySelector('h2').textContent.trim();
      const renameButton = header.querySelector('.rename-band');
      const deleteButton = header.querySelector('.delete-band');
      
      // Re-attach event listeners to be safe
      const editButton = header.querySelector('.edit-band');
      if (editButton) {
        // Remove existing listeners to avoid duplicates
        const newEditButton = editButton.cloneNode(true);
        editButton.parentNode.replaceChild(newEditButton, editButton);
        newEditButton.addEventListener('click', () => openEditBandModal(bandSection));
      }
      
      if (deleteButton) {
        // Remove existing listeners to avoid duplicates
        const newDeleteButton = deleteButton.cloneNode(true);
        deleteButton.parentNode.replaceChild(newDeleteButton, deleteButton);
        newDeleteButton.addEventListener('click', () => confirmDeleteBand(bandSection, bandName));
      }
      
      return; // Skip to the next header
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
    
    // Add event listeners
    const editButton = actions.querySelector('.edit-band');
    const deleteButton = actions.querySelector('.delete-band');
    
    editButton.addEventListener('click', () => openEditBandModal(bandSection));
    deleteButton.addEventListener('click', () => confirmDeleteBand(bandSection, bandName));
  });
}

// Setup event delegation for dynamically created elements
function setupEventDelegation() {
  // Handle remove buttons for frequency and power inputs
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
  });
}

// Open the Add Band Modal
function openAddBandModal() {
  const modal = document.getElementById('band-modal');
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
  saveButton.removeAttribute('data-edit-band-id');
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
  
  // Extract frequencies from the first table header
  const frequencyHeaders = bandSection.querySelectorAll('.matrix-table thead th:not(:first-child)');
  const frequencies = [];
  frequencyHeaders.forEach(header => {
    let freq = header.textContent.trim();
    // Remove 'MHz' if present
    freq = freq.replace('MHz', '');
    frequencies.push(freq);
  });
  
  // Get power levels from the first table (Tx Power) if it exists
  const txPowerTable = bandSection.querySelector('.matrix-table');
  const powerLevels = [];
  if (txPowerTable) {
    const powerRows = txPowerTable.querySelectorAll('tbody tr');
    powerRows.forEach(row => {
      let power = row.querySelector('td:first-child').textContent.trim();
      // Remove 'dBm' if present
      power = power.replace('dBm', '').trim();
      // Only add if it has a number (to filter out rows like "Measured" or "Diff.")
      if (!isNaN(parseFloat(power))) {
        powerLevels.push(power);
      }
    });
  }
  
  // Get selected tests
  const selectedTests = {
    txPower: bandSection.querySelector('.matrix-header:has(span:contains("Tx Power"))') !== null,
    txCurrent: bandSection.querySelector('.matrix-header:has(span:contains("Tx Current"))') !== null,
    obw: bandSection.querySelector('.matrix-header:has(span:contains("OBW"))') !== null,
    freqAccuracy: bandSection.querySelector('.matrix-header:has(span:contains("Frequency Accuracy"))') !== null
  };
  
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
  
  // Clear existing frequency inputs except the first one
  const frequencyContainer = document.getElementById('frequency-inputs');
  while (frequencyContainer.children.length > 1) {
    frequencyContainer.removeChild(frequencyContainer.lastChild);
  }
  
  // Set first frequency and add the rest
  if (frequencies.length > 0) {
    frequencyContainer.querySelector('.frequency-input').value = frequencies[0];
    
    // Add the rest of the frequencies
    for (let i = 1; i < frequencies.length; i++) {
      addFrequencyInput();
      frequencyContainer.lastChild.querySelector('.frequency-input').value = frequencies[i];
    }
  }
  
  // Clear existing power inputs except the first one
  const powerContainer = document.getElementById('power-inputs');
  while (powerContainer.children.length > 1) {
    powerContainer.removeChild(powerContainer.lastChild);
  }
  
  // Set first power level and add the rest
  if (powerLevels.length > 0) {
    powerContainer.querySelector('.power-input').value = powerLevels[0];
    
    // Add the rest of the power levels
    for (let i = 1; i < powerLevels.length; i++) {
      addPowerLevelInput();
      powerContainer.lastChild.querySelector('.power-input').value = powerLevels[i];
    }
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
    
    // Show confirmation if no bands left
    const remainingBands = document.querySelectorAll('.band-section');
    if (remainingBands.length === 0 && window.customModal) {
      window.customModal.info('All bands have been removed. You can add new bands using the "Add Band" button.', 'Band Management');
    }
  }, 500);
  
  // Show confirmation
  if (window.customModal) {
    window.customModal.success('Band deleted successfully', 'Band Management');
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
        <button class="icon-button rename-band" title="Rename Band">
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
  
  // Attach event listeners to the new buttons
  const editButton = bandHeader.querySelector('.edit-band');
  const deleteButton = bandHeader.querySelector('.delete-band');
  
  editButton.addEventListener('click', () => openEditBandModal(bandSection));
  deleteButton.addEventListener('click', () => confirmDeleteBand(bandSection, bandName));
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
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'cell-input';
    input.placeholder = '-';
    cell.appendChild(input);
  });
  
  // Add event listener for newly created checkboxes
  const checkboxes = container.querySelectorAll('.matrix-header input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const testMatrix = this.closest('.test-matrix');
      if (testMatrix) {
        if (this.checked) {
          testMatrix.classList.remove('disabled');
        } else {
          testMatrix.classList.add('disabled');
        }
      }
    });
  });
}

// Start the cellular test
function startCellularTest() {
  // Get selected test types from all band sections
  const selectedTests = [];
  
  document.querySelectorAll('.band-section').forEach(bandSection => {
    const bandName = bandSection.querySelector('.band-header h2').textContent.trim();
    
    bandSection.querySelectorAll('.matrix-header input[type="checkbox"]:checked').forEach(checkbox => {
      const testName = checkbox.nextElementSibling.textContent.trim();
      selectedTests.push({
        band: bandName,
        test: testName
      });
    });
  });
  
  if (selectedTests.length === 0) {
    // Use custom modal if available
    if (window.customModal) {
      window.customModal.warning('Please select at least one test to run.', 'Test Selection');
    } else {
      alert('Please select at least one test to run.');
    }
    return;
  }
  
  console.log('Starting Cellular Test with selected tests:', selectedTests);
  
  // Clear previous results
  clearTestResults();
  
  // Show loading state
  const startButton = document.getElementById('start-test');
  startButton.textContent = 'Running Test...';
  startButton.disabled = true;
  
  // Simulate test running
  simulateTestRun(selectedTests);
}

// Clear all test results
function clearTestResults() {
  document.querySelectorAll('.cell-input').forEach(input => {
    input.value = '';
    input.classList.remove('updated');
  });
}

// Simulate a test run with sample data
function simulateTestRun(selectedTests) {
  // Sample data maps for different test types
  const sampleData = {
    'Tx Power': {
      '0 dBm': '-30.2 dBm',
      '14 dBm': '-16.3 dBm',
      '20 dBm': '-10.2 dBm',
      '30 dBm': '-0.5 dBm'
    },
    'Tx Current Consumption': {
      '0 dBm': '22 mA',
      '14 dBm': '35 mA',
      '20 dBm': '48 mA',
      '30 dBm': '65 mA'
    },
    'OBW': {
      'DR 7': '125 kHz',
      'DR 12': '500 kHz'
    },
    'Frequency Accuracy': {
      'Measured': '±0.1 ppm',
      'Diff.': '±0.2 ppm'
    }
  };
  
  // Delay for staggered updates
  let delay = 500;
  let cellCount = 0;
  let totalCells = 0;
  
  // Count total cells to update for progress tracking
  selectedTests.forEach(test => {
    const bandSection = findBandSection(test.band);
    if (!bandSection) return;
    
    const testMatrix = findTestMatrix(bandSection, test.test);
    if (!testMatrix) return;
    
    const cells = testMatrix.querySelectorAll('td:not(:first-child) .cell-input');
    totalCells += cells.length;
  });
  
  // Process each selected test
  selectedTests.forEach(test => {
    const bandSection = findBandSection(test.band);
    if (!bandSection) return;
    
    const testMatrix = findTestMatrix(bandSection, test.test);
    if (!testMatrix) return;
    
    // Get the matrix table
    const table = testMatrix.querySelector('.matrix-table');
    if (!table) return;
    
    // Process each row
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      // Get row label (e.g. "0 dBm", "DR 7")
      const rowLabel = row.querySelector('td:first-child').textContent.trim();
      
      // Get the baseline value from sample data
      const baseValue = sampleData[test.test]?.[rowLabel];
      if (!baseValue) return;
      
      // For each cell in this row
      const cells = row.querySelectorAll('td:not(:first-child) .cell-input');
      cells.forEach(input => {
        setTimeout(() => {
          // Randomize the value slightly to simulate real measurements
          if (baseValue.includes('dBm')) {
            const value = parseFloat(baseValue) + (Math.random() * 0.4 - 0.2);
            input.value = value.toFixed(1) + ' dBm';
          } else if (baseValue.includes('mA')) {
            const value = parseFloat(baseValue) + (Math.random() * 2 - 1);
            input.value = Math.round(value) + ' mA';
          } else if (baseValue.includes('kHz')) {
            const value = parseFloat(baseValue) + (Math.random() * 10 - 5);
            input.value = Math.round(value) + ' kHz';
          } else if (baseValue.includes('ppm')) {
            input.value = baseValue;
          } else {
            input.value = baseValue;
          }
          
          // Highlight the updated cell
          input.classList.add('updated');
          
          // Remove the highlight after animation
          setTimeout(() => {
            input.classList.remove('updated');
          }, 1000);
          
          // Update progress
          cellCount++;
          
          // Check if all cells are updated
          if (cellCount >= totalCells) {
            setTimeout(() => {
              // Reset the start button
              const startButton = document.getElementById('start-test');
              startButton.textContent = 'Start Test';
              startButton.disabled = false;
              
              // Show completion notification
              if (window.customModal) {
                window.customModal.success('Test completed successfully!', 'Cellular Test');
              }
            }, 500);
          }
        }, delay);
        
        // Increment delay for next cell
        delay += 100;
      });
    });
  });
}

// Helper function to find a band section by name
function findBandSection(bandName) {
  const sections = document.querySelectorAll('.band-section');
  for (const section of sections) {
    const header = section.querySelector('.band-header h2');
    if (header && header.textContent.trim() === bandName) {
      return section;
    }
  }
  return null;
}

// Helper function to find a test matrix by test name within a band section
function findTestMatrix(bandSection, testName) {
  const matrixHeaders = bandSection.querySelectorAll('.matrix-header');
  for (const header of matrixHeaders) {
    const label = header.querySelector('span');
    if (label && label.textContent.trim() === testName) {
      return header.closest('.test-matrix');
    }
  }
  return null;
}

// Make the initialization function available globally for renderer.js
window.initCellularPage = initCellularPage;