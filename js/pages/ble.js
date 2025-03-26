// This function will be called when the BLE page is loaded
function initBlePage() {
  console.log('BLE test page initialized');
  
  // Get references to the elements
  const startTestButton = document.getElementById('start-test');
  const testCheckboxes = document.querySelectorAll('.matrix-header input[type="checkbox"]');
  const tableCells = document.querySelectorAll('.matrix-table td:not(:first-child)');
  
  // Add event listener to the Start Test button
  if (startTestButton) {
    startTestButton.addEventListener('click', startBleTest);
  }
  
  // Set up event listeners for the test selection checkboxes
  testCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      // Find the parent test-matrix and enable/disable it
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

  // Convert all cells to input fields by default
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
  // Sample data for each test type
  const sampleData = {
    'Tx Power': {
      '0 dBm': {'2402MHz': '-30.1', '2446MHz': '-30.3', '2480MHz': '-30.4'},
      '3 dBm': {'2402MHz': '-27.1', '2446MHz': '-27.3', '2480MHz': '-27.2'},
      '6 dBm': {'2402MHz': '-24.2', '2446MHz': '-24.0', '2480MHz': '-24.3'},
      '10 dBm': {'2402MHz': '-20.5', '2446MHz': '-20.3', '2480MHz': '-20.6'}
    },
    'Tx Current Consumption': {
      '0 dBm': {'2402MHz': '18', '2446MHz': '19', '2480MHz': '18'},
      '3 dBm': {'2402MHz': '21', '2446MHz': '22', '2480MHz': '21'},
      '6 dBm': {'2402MHz': '25', '2446MHz': '26', '2480MHz': '25'},
      '10 dBm': {'2402MHz': '32', '2446MHz': '33', '2480MHz': '32'}
    },
    'OBW': {
      '1Mbps': {'2402MHz': '1.05', '2446MHz': '1.08', '2480MHz': '1.06'},
      '2Mbps': {'2402MHz': '2.12', '2446MHz': '2.15', '2480MHz': '2.18'}
    },
    'Frequency Accuracy': {
      'Measured': {'2402MHz': '0.09', '2446MHz': '0.08', '2480MHz': '0.10'},
      'Diff.': {'2402MHz': '0.06', '2446MHz': '0.14', '2480MHz': '0.16'}
    }
  };
  
  // Simulate a test run with delays
  let delay = 500;
  
  selectedTests.forEach(testType => {
    // Find the table for this test type using our helper function
    const testHeader = findElementContainingText('.matrix-header .checkbox span', testType);
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