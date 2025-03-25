// Cellular page functionality
function initCellularPage() {
  console.log('Cellular page initialized');
  
  // Initialize all cells with input fields
  initializeTableCells();
  
  // Setup event listeners
  setupEventListeners();
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
  
  // Create the new band section
  createBandSection(bandName, frequencies, powerLevels, selectedTests);
  
  // Close the modal
  closeAddBandModal();
  
  // Show confirmation message
  if (window.customModal) {
    window.customModal.success(`Band ${bandName} has been added successfully`, 'Success');
  } else {
    alert(`Band ${bandName} has been added successfully`);
  }
}

// Create a new band section
function createBandSection(bandName, frequencies, powerLevels, selectedTests) {
  // Create band ID (for DOM)
  const bandId = 'band-' + bandName.toLowerCase().replace(/\s+/g, '-');
  
  // Create the band section container
  const bandSection = document.createElement('div');
  bandSection.className = 'band-section';
  bandSection.id = bandId;
  
  // Create the band header
  const bandHeader = document.createElement('div');
  bandHeader.className = 'band-header';
  bandHeader.innerHTML = `<h2>${bandName}</h2>`;
  
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