// This function will be called when the LoRa page is loaded
function initLoraPage() {
  console.log('LoRa test page initialized');
  
  // Get references to the elements
  const startTestButton = document.getElementById('start-test');
  const testCheckboxes = document.querySelectorAll('.matrix-header input[type="checkbox"]');
  const tableCells = document.querySelectorAll('.matrix-table td:not(:first-child)');
  
  // Add event listener to the Start Test button
  if (startTestButton) {
    startTestButton.addEventListener('click', startLoRaTest);
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
function startLoRaTest() {
  console.log('Starting LoRa Test...');
  
  // Get selected test types
  const selectedTests = [];
  document.querySelectorAll('.matrix-header input[type="checkbox"]:checked').forEach(checkbox => {
    const testName = checkbox.nextElementSibling.textContent.trim();
    selectedTests.push(testName);
  });
  
  if (selectedTests.length === 0) {
    alert('Please select at least one test to run.');
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
      '0 dBm': {'917MHz': '22 mA', '918.5MHz': '23 mA', '919.7MHz': '22 mA'},
      '14 dBm': {'917MHz': '35 mA', '918.5MHz': '36 mA', '919.7MHz': '35 mA'},
      '20 dBm': {'917MHz': '48 mA', '918.5MHz': '49 mA', '919.7MHz': '48 mA'},
      '30 dBm': {'917MHz': '65 mA', '918.5MHz': '66 mA', '919.7MHz': '65 mA'}
    },
    'OBW': {
      'DR 7': {'917MHz': '125 kHz', '918.5MHz': '125 kHz', '919.7MHz': '125 kHz'},
      'DR 12': {'917MHz': '500 kHz', '918.5MHz': '500 kHz', '919.7MHz': '500 kHz'}
    },
    'Frequency Accuracy': {
      'At start': {'917MHz': '±0.1 ppm', '918.5MHz': '±0.1 ppm', '919.7MHz': '±0.1 ppm'},
      'After 60 sec.': {'917MHz': '±0.2 ppm', '918.5MHz': '±0.2 ppm', '919.7MHz': '±0.2 ppm'}
    }
  };
  
  // Simulate a test run with delays
  let delay = 500;
  
  selectedTests.forEach(testType => {
    // Find the table for this test type
    const testContainer = document.querySelector(`.matrix-header .checkbox span:contains('${testType}')`).closest('.test-matrix');
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

// Helper function to make it easier to select by text content
// Similar to jQuery's :contains selector
if (!document.querySelector(':contains')) {
  Element.prototype.contains = function(text) {
    return this.textContent.includes(text);
  };
  
  // Add a contains method to NodeList
  NodeList.prototype.filter = function(predicate) {
    return Array.from(this).filter(predicate);
  };
}