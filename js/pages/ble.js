// This function will be called when the BLE page is loaded
function initBlePage() {
  console.log('BLE test page initialized');
  
  // Get references to the elements
  const startTestButton = document.getElementById('start-test');
  const testCheckboxes = document.querySelectorAll('.matrix-header input[type="checkbox"]');
  const tableCells = document.querySelectorAll('.matrix-table td:not(:first-child)');
  const editMatrixButtons = document.querySelectorAll('.edit-matrix');
  
  // Add event listener to the Start Test button
  if (startTestButton) {
    startTestButton.addEventListener('click', startBleTest);
  }
  
  // Set up event listeners for the test selection checkboxes
  testCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      // Find the parent test-matrix and enable/disable its table container
      const testMatrix = this.closest('.test-matrix');
      if (testMatrix) {
        const tableContainer = testMatrix.querySelector('.table-container');
        if (tableContainer) {
          if (this.checked) {
            tableContainer.classList.remove('disabled');
          } else {
            tableContainer.classList.add('disabled');
          }
        }
      }
    });
  });

  // Set up event listeners for the edit matrix buttons
  editMatrixButtons.forEach(button => {
    button.addEventListener('click', function() {
      const matrix = this.closest('.test-matrix');
      if (matrix) {
        openEditMatrixModal(matrix);
      }
    });
  });

  // Modal event listeners
  setupModalEventListeners();

  // Convert all cells to input fields by default
  tableCells.forEach(cell => {
    convertCellToInput(cell);
  });
}

// Setup modal event listeners
function setupModalEventListeners() {
  // Close modal on X button click
  const closeModalButton = document.querySelector('#edit-matrix-modal .close-modal');
  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeEditMatrixModal);
  }

  // Close modal on Cancel button click
  const cancelButton = document.querySelector('#edit-matrix-modal .cancel-button');
  if (cancelButton) {
    cancelButton.addEventListener('click', closeEditMatrixModal);
  }

  // Save matrix on Save button click
  const saveButton = document.getElementById('save-matrix-button');
  if (saveButton) {
    saveButton.addEventListener('click', saveMatrixChanges);
  }

  // Add frequency button
  const addFrequencyButton = document.getElementById('add-frequency-button');
  if (addFrequencyButton) {
    addFrequencyButton.addEventListener('click', addFrequencyInput);
  }

  // Add parameter button
  const addParameterButton = document.getElementById('add-parameter-button');
  if (addParameterButton) {
    addParameterButton.addEventListener('click', addParameterInput);
  }
  
  // Event delegation for remove buttons (for dynamically added elements)
  document.addEventListener('click', function(e) {
    // Check if clicked element is a remove button
    if (e.target.closest('.remove-input')) {
      const button = e.target.closest('.remove-input');
      const inputRow = button.closest('.input-row');
      const container = inputRow.parentElement;
      
      // Check if we have more than one input
      if (container.querySelectorAll('.input-row').length > 1) {
        inputRow.remove();
      } else {
        // Don't allow removing the last input
        if (window.customModal) {
          window.customModal.warning('At least one item is required', 'Cannot Remove');
        } else {
          alert('At least one item is required');
        }
      }
    }
  });
}

// Function to open the edit matrix modal
function openEditMatrixModal(matrix) {
  // Get matrix ID and type
  const matrixId = matrix.id;
  const matrixType = matrix.querySelector('.checkbox span').textContent.trim();
  
  // Set modal title and matrix type
  document.querySelector('#edit-matrix-modal .modal-header h2').textContent = 'Edit ' + matrixType;
  document.getElementById('matrix-type').value = matrixType;
  
  // Store matrix ID in the save button's data attribute
  const saveButton = document.getElementById('save-matrix-button');
  if (saveButton) {
    saveButton.dataset.matrixId = matrixId;
  }
  
  // Get frequencies from the table headers
  const frequencies = [];
  const freqHeaders = matrix.querySelectorAll('thead th:not(:first-child)');
  
  // If no frequencies exist yet, use default BLE frequencies
  if (freqHeaders.length === 0) {
    frequencies.push('2402MHz');
    frequencies.push('2446MHz');
    frequencies.push('2480MHz');
  } else {
    freqHeaders.forEach(header => {
      frequencies.push(header.textContent.trim());
    });
  }
  
  // Get parameters from the table rows (first cell of each row)
  const parameters = [];
  const paramRows = matrix.querySelectorAll('tbody tr');
  paramRows.forEach(row => {
    parameters.push(row.querySelector('td:first-child').textContent.trim());
  });
  
  // Populate the frequency inputs
  populateInputGroup('frequency-inputs', frequencies);
  
  // Populate the parameter inputs
  populateInputGroup('parameter-inputs', parameters);
  
  // Show the modal
  const modal = document.getElementById('edit-matrix-modal');
  if (modal) {
    modal.classList.add('active');
  }
}

// Function to populate an input group with values
function populateInputGroup(containerId, values) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Clear existing inputs
  container.innerHTML = '';
  
  // Add an input row for each value
  values.forEach((value, index) => {
    addInputRow(container, value);
  });
}

// Function to add a frequency input row
function addFrequencyInput() {
  const container = document.getElementById('frequency-inputs');
  if (container) {
    addInputRow(container, '');
  }
}

// Function to add a parameter input row
function addParameterInput() {
  const container = document.getElementById('parameter-inputs');
  if (container) {
    addInputRow(container, '');
  }
}

// Generic function to add an input row
function addInputRow(container, value) {
  const inputRow = document.createElement('div');
  inputRow.className = 'input-row';
  
  inputRow.innerHTML = `
    <input type="text" class="custom-input" value="${value}">
    <button class="remove-input icon-button" title="Remove">
      <i class='bx bx-trash'></i>
    </button>
  `;
  
  container.appendChild(inputRow);
}

// Function to close the edit matrix modal
function closeEditMatrixModal() {
  const modal = document.getElementById('edit-matrix-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Function to save changes to the matrix
function saveMatrixChanges() {
  // Get the matrix ID from the save button
  const saveButton = document.getElementById('save-matrix-button');
  if (!saveButton) return;
  
  const matrixId = saveButton.dataset.matrixId;
  if (!matrixId) return;
  
  const matrix = document.getElementById(matrixId);
  if (!matrix) return;
  
  // Get new frequencies
  const frequencyInputs = document.querySelectorAll('#frequency-inputs .custom-input');
  const frequencies = Array.from(frequencyInputs).map(input => input.value.trim());
  
  // Validate frequencies
  if (frequencies.some(freq => !freq)) {
    if (window.customModal) {
      window.customModal.error('All frequency fields must be filled', 'Validation Error');
    } else {
      alert('All frequency fields must be filled');
    }
    return;
  }
  
  // Get new parameters
  const parameterInputs = document.querySelectorAll('#parameter-inputs .custom-input');
  const parameters = Array.from(parameterInputs).map(input => input.value.trim());
  
  // Validate parameters
  if (parameters.some(param => !param)) {
    if (window.customModal) {
      window.customModal.error('All parameter fields must be filled', 'Validation Error');
    } else {
      alert('All parameter fields must be filled');
    }
    return;
  }
  
  // Rebuild the table with new frequencies and parameters
  rebuildMatrix(matrix, frequencies, parameters);
  
  // Close the modal
  closeEditMatrixModal();
  
  // Show success message
  if (window.customModal) {
    window.customModal.success('Matrix updated successfully!', 'Success');
  }
}

// Function to rebuild a matrix with new frequencies and parameters
function rebuildMatrix(matrix, frequencies, parameters) {
  // Get the table
  const table = matrix.querySelector('.matrix-table');
  if (!table) return;
  
  // Rebuild table header
  const thead = table.querySelector('thead');
  if (thead) {
    thead.innerHTML = '<tr><th></th>' + frequencies.map(freq => `<th>${freq}</th>`).join('') + '</tr>';
  }
  
  // Rebuild table body
  const tbody = table.querySelector('tbody');
  if (tbody) {
    tbody.innerHTML = '';
    
    parameters.forEach(param => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${param}</td>` + frequencies.map(() => '<td></td>').join('');
      tbody.appendChild(row);
    });
  }
  
  // Reinitialize input cells
  const tableCells = table.querySelectorAll('td:not(:first-child)');
  tableCells.forEach(cell => {
    convertCellToInput(cell);
  });
}

// Function to handle starting the test
function startBleTest() {
  console.log('Starting BLE Test...');
  
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
  // Default BLE frequencies to use if none are defined in the matrix
  const defaultFrequencies = [
    '2402MHz', 
    '2446MHz', 
    '2480MHz'
  ];
  
  // Store known frequencies and parameters for each matrix to reference in our test data
  const matrixFrequenciesAndParams = {
    'tx-power-matrix': {
      frequencies: getColumnHeaders('tx-power-matrix').length > 0 ? 
                   getColumnHeaders('tx-power-matrix') : defaultFrequencies,
      parameters: getRowLabels('tx-power-matrix')
    },
    'tx-current-matrix': {
      frequencies: getColumnHeaders('tx-current-matrix').length > 0 ? 
                   getColumnHeaders('tx-current-matrix') : defaultFrequencies,
      parameters: getRowLabels('tx-current-matrix')
    },
    'obw-matrix': {
      frequencies: getColumnHeaders('obw-matrix').length > 0 ? 
                  getColumnHeaders('obw-matrix') : defaultFrequencies,
      parameters: getRowLabels('obw-matrix')
    },
    'freq-accuracy-matrix': {
      frequencies: getColumnHeaders('freq-accuracy-matrix').length > 0 ? 
                  getColumnHeaders('freq-accuracy-matrix') : defaultFrequencies,
      parameters: getRowLabels('freq-accuracy-matrix')
    }
  };
  
  // Iterate through each selected test
  let delay = 500;
  
  selectedTests.forEach(testType => {
    // Find the table for this test type
    let matrixId;
    switch(testType) {
      case 'Tx Power': matrixId = 'tx-power-matrix'; break;
      case 'Tx Current Consumption': matrixId = 'tx-current-matrix'; break;
      case 'OBW': matrixId = 'obw-matrix'; break;
      case 'Frequency Accuracy': matrixId = 'freq-accuracy-matrix'; break;
      default: return;
    }
    
    const matrix = document.getElementById(matrixId);
    if (!matrix) return;
    
    const table = matrix.querySelector('.matrix-table');
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
          // Generate realistic-looking test data based on the matrix type, parameter, and frequency
          let testValue = generateTestValue(testType, rowLabel, freqLabel);
          
          const input = cell.querySelector('input');
          if (input) {
            input.value = testValue;
            input.classList.add('updated');
            
            // Remove the updated class after animation
            setTimeout(() => {
              input.classList.remove('updated');
            }, 1000);
          }
          
          // Reset button state when all data is filled
          if (rowIndex === rows.length - 1 && cellIndex === cells.length - 1 && 
              testType === selectedTests[selectedTests.length - 1]) {
            setTimeout(() => {
              document.getElementById('start-test').textContent = 'Start Test';
              document.getElementById('start-test').disabled = false;
              
              // Show test completion notification
              if (window.customModal) {
                window.customModal.success('Test completed successfully!', 'BLE Test');
              }
            }, 500);
          }
        }, delay);
        
        delay += 200; // Increase delay for next cell
      });
    });
  });
}

// Helper function to get column headers (frequencies) from a matrix
function getColumnHeaders(matrixId) {
  const matrix = document.getElementById(matrixId);
  if (!matrix) return [];
  
  const headers = matrix.querySelectorAll('thead th:not(:first-child)');
  return Array.from(headers).map(header => header.textContent.trim());
}

// Helper function to get row labels (parameters) from a matrix
function getRowLabels(matrixId) {
  const matrix = document.getElementById(matrixId);
  if (!matrix) return [];
  
  const rows = matrix.querySelectorAll('tbody tr');
  return Array.from(rows).map(row => row.querySelector('td:first-child').textContent.trim());
}

// Function to generate a realistic test value based on the test type, parameter, and frequency
function generateTestValue(testType, param, freq) {
  // Extract the frequency value in MHz if it contains it
  const freqMatch = freq.match(/(\d+)MHz/);
  const freqMHz = freqMatch ? parseInt(freqMatch[1]) : 2440; // Default to middle of band
  
  // Extract power value in dBm if the parameter contains it
  const powerMatch = param.match(/(\d+)\s*dBm/);
  const powerDBm = powerMatch ? parseInt(powerMatch[1]) : 0;

  // For different test types, generate appropriate test values
  switch (testType) {
    case 'Tx Power':
      // For TX power, return a value that's approximately the negative of the power level
      // with slight variation based on frequency
      const freqOffset = (freqMHz - 2440) / 100; // Small offset based on frequency
      return (-30 + powerDBm + (Math.random() * 0.4 - 0.2 + freqOffset)).toFixed(1);
      
    case 'Tx Current Consumption':
      // Current consumption increases with power and varies slightly with frequency
      const baseCurrent = 18 + (powerDBm * 1.5);
      const freqVariation = (freqMHz - 2440) / 100;
      return `${Math.round(baseCurrent + (Math.random() * 2 - 1) + freqVariation)} mA`;
      
    case 'OBW':
      // OBW depends on data rate (1Mbps or 2Mbps) with slight variations
      if (param.includes('1Mbps')) {
        return `${(1 + (Math.random() * 0.1)).toFixed(2)} MHz`;
      } else if (param.includes('2Mbps')) {
        return `${(2 + (Math.random() * 0.2)).toFixed(2)} MHz`;
      } else {
        return `${(1 + (Math.random() * 1)).toFixed(2)} MHz`;
      }
      
    case 'Frequency Accuracy':
      // Frequency accuracy is typically in ppm (parts per million)
      if (param.includes('Measured')) {
        return `±${(0.08 + Math.random() * 0.04).toFixed(2)} ppm`;
      } else if (param.includes('Diff')) {
        return `±${(0.14 + Math.random() * 0.06).toFixed(2)} ppm`;
      } else {
        return `±${(0.1 + Math.random() * 0.1).toFixed(2)} ppm`;
      }
      
    default:
      // For any other test type, return a random value as fallback
      return (Math.random() * 10).toFixed(1);
  }
}

// Function to convert cell to input field
function convertCellToInput(cell) {
  // Check if cell already has an input
  if (cell.querySelector('input')) return;
  
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

// Helper function to find an element containing specific text
function findElementContainingText(selector, text) {
  const elements = document.querySelectorAll(selector);
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].textContent.includes(text)) {
      return elements[i];
    }
  }
  return null;
}

// Helper function to find all elements containing specific text
function findElementsContainingText(selector, text) {
  const elements = document.querySelectorAll(selector);
  return Array.from(elements).filter(element => 
    element.textContent.includes(text)
  );
}

// Make function available globally for the renderer.js
window.initBlePage = initBlePage;