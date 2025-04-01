// This function will be called when the LoRa page is loaded
function initLoraPage() {
  console.log('LoRa test page initialized');
  
  // Get references to the elements
  const startTestButton = document.getElementById('start-test');
  const testCheckboxes = document.querySelectorAll('.matrix-header input[type="checkbox"]');
  const tableCells = document.querySelectorAll('.matrix-table td:not(:first-child)');
  const editMatrixButtons = document.querySelectorAll('.edit-matrix');
  
  // Add event listener to the Start Test button
  if (startTestButton) {
    startTestButton.addEventListener('click', startLoRaTest);
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

  // Set up event listeners for the edit matrix buttons
  editMatrixButtons.forEach(button => {
    button.addEventListener('click', function() {
      const matrix = this.closest('.test-matrix');
      if (matrix) {
        openEditMatrixModal(matrix);
      }
    });
  });

  // Convert all cells to input fields by default
  tableCells.forEach(cell => {
    convertCellToInput(cell);
  });
  
  // Setup modal event listeners
  setupModalEventListeners();
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
  // Get the actual frequencies and parameters from the tables
  const matrixData = {
    'tx-power-matrix': {
      frequencies: getColumnHeaders('tx-power-matrix'),
      parameters: getRowLabels('tx-power-matrix')
    },
    'tx-current-matrix': {
      frequencies: getColumnHeaders('tx-current-matrix'),
      parameters: getRowLabels('tx-current-matrix')
    },
    'obw-matrix': {
      frequencies: getColumnHeaders('obw-matrix'),
      parameters: getRowLabels('obw-matrix')
    },
    'freq-accuracy-matrix': {
      frequencies: getColumnHeaders('freq-accuracy-matrix'),
      parameters: getRowLabels('freq-accuracy-matrix')
    }
  };
  
  // Generate sample data based on the actual table structure
  const sampleData = generateSampleData(matrixData);
  
  // Simulate a test run with delays
  let delay = 500;
  
  for (const testType of selectedTests) {
    // Find the test matrix id
    let matrixId;
    switch(testType) {
      case 'Tx Power': matrixId = 'tx-power-matrix'; break;
      case 'Tx Current Consumption': matrixId = 'tx-current-matrix'; break;
      case 'OBW': matrixId = 'obw-matrix'; break;
      case 'Frequency Accuracy': matrixId = 'freq-accuracy-matrix'; break;
      default: continue;
    }
    
    const matrix = document.getElementById(matrixId);
    if (!matrix) continue;
    
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
              testType === selectedTests[selectedTests.length - 1]) {
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
  }
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

// Function to generate sample data based on matrix structure
function generateSampleData(matrixData) {
  const sampleData = {};
  
  // TX Power data
  sampleData['Tx Power'] = {};
  matrixData['tx-power-matrix'].parameters.forEach(param => {
    sampleData['Tx Power'][param] = {};
    const powerValue = parseFloat(param) || 0;
    
    matrixData['tx-power-matrix'].frequencies.forEach(freq => {
      // Generate realistic-looking test data based on the power
      const freqNum = parseFloat(freq) || 0;
      const baseValue = -30 + powerValue;
      const randomOffset = (Math.random() * 0.6 - 0.3).toFixed(1);
      sampleData['Tx Power'][param][freq] = (baseValue + parseFloat(randomOffset)).toFixed(1);
    });
  });
  
  // TX Current Consumption data
  sampleData['Tx Current Consumption'] = {};
  matrixData['tx-current-matrix'].parameters.forEach(param => {
    sampleData['Tx Current Consumption'][param] = {};
    // Extract power level number from parameter
    const powerMatch = param.match(/(\d+)/);
    const powerValue = powerMatch ? parseInt(powerMatch[1]) : 0;
    
    matrixData['tx-current-matrix'].frequencies.forEach(freq => {
      // Current increases with power level
      const baseCurrent = 20 + (powerValue * 1.5);
      const randomOffset = Math.floor(Math.random() * 3);
      sampleData['Tx Current Consumption'][param][freq] = (baseCurrent + randomOffset).toString();
    });
  });
  
  // OBW data
  sampleData['OBW'] = {};
  matrixData['obw-matrix'].parameters.forEach(param => {
    sampleData['OBW'][param] = {};
    const isDR12 = param.includes('12');
    
    matrixData['obw-matrix'].frequencies.forEach(freq => {
      // DR12 has wider bandwidth than DR7
      const baseValue = isDR12 ? 500 : 125;
      const randomOffset = Math.floor(Math.random() * 5);
      sampleData['OBW'][param][freq] = (baseValue + randomOffset).toString();
    });
  });
  
  // Frequency Accuracy data
  sampleData['Frequency Accuracy'] = {};
  matrixData['freq-accuracy-matrix'].parameters.forEach(param => {
    sampleData['Frequency Accuracy'][param] = {};
    
    matrixData['freq-accuracy-matrix'].frequencies.forEach(freq => {
      if (param.includes('Measured')) {
        // For measured frequency, generate a value close to the target frequency
        const freqValue = parseFloat(freq);
        const offset = (Math.random() * 0.04 - 0.02).toFixed(2);
        sampleData['Frequency Accuracy'][param][freq] = (freqValue + parseFloat(offset)).toFixed(2);
      } else if (param.includes('Diff')) {
        // For diff, show the offset in ppm
        sampleData['Frequency Accuracy'][param][freq] = '±' + (Math.random() * 0.03).toFixed(2);
      }
    });
  });
  
  return sampleData;
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
  
  freqHeaders.forEach(header => {
    // Remove MHz if present to get just the number
    let freq = header.textContent.trim();
    freq = freq.replace('MHz', '');
    frequencies.push(freq);
  });
  
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
  values.forEach(value => {
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
  } else {
    alert('Matrix updated successfully!');
  }
}

// Function to rebuild a matrix with new frequencies and parameters
function rebuildMatrix(matrix, frequencies, parameters) {
  // Get the table
  const table = matrix.querySelector('.matrix-table');
  if (!table) return;
  
  // Determine what type of matrix we're dealing with
  const matrixType = matrix.querySelector('.checkbox span').textContent.trim();
  
  // Special formatting for parameters based on matrix type
  const formattedParameters = parameters.map(param => {
    if (matrixType === 'Tx Power' || matrixType === 'Tx Current Consumption') {
      // If parameter is a number, add 'dBm' to it
      if (!isNaN(parseFloat(param)) && !param.includes('dBm')) {
        return param + ' dBm';
      }
    }
    return param;
  });
  
  // Special formatting for frequencies
  const formattedFrequencies = frequencies.map(freq => {
    // Add 'MHz' to frequency if not already present
    if (!freq.includes('MHz')) {
      return freq + 'MHz';
    }
    return freq;
  });
  
  // Rebuild table header
  const thead = table.querySelector('thead');
  if (thead) {
    thead.innerHTML = '<tr><th></th>' + formattedFrequencies.map(freq => `<th>${freq}</th>`).join('') + '</tr>';
  }
  
  // Rebuild table body
  const tbody = table.querySelector('tbody');
  if (tbody) {
    tbody.innerHTML = '';
    
    formattedParameters.forEach(param => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${param}</td>` + formattedFrequencies.map(() => '<td></td>').join('');
      tbody.appendChild(row);
    });
  }
  
  // Reinitialize input cells
  const tableCells = table.querySelectorAll('td:not(:first-child)');
  tableCells.forEach(cell => {
    convertCellToInput(cell);
  });
}

// Make the initialization function available globally for renderer.js
window.initLoraPage = initLoraPage;