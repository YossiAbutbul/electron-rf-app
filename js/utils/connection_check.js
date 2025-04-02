/**
 * Utility functions for checking device connectivity
 */

/**
 * Ping an IP address using system ping command
 * @param {string} ipAddress - The IP address to ping
 * @returns {Promise<object>} - Promise resolving to result object
 */
function systemPing(ipAddress) {
  return new Promise((resolve) => {
    // First, validate the IP address to prevent injection
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(ipAddress)) {
      resolve({ success: false, error: 'Invalid IP address format' });
      return;
    }

    // Use Node.js child_process from Electron's main process
    const { exec } = require('child_process');
    
    // Command differs by platform
    const cmd = process.platform === 'win32' 
      ? `ping -n 1 -w 1000 ${ipAddress}` 
      : `ping -c 1 -W 1 ${ipAddress}`;
    
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        resolve({ 
          success: false, 
          ip: ipAddress,
          error: error.message
        });
        return;
      }
      
      // Check if ping was successful
      const successPattern = process.platform === 'win32'
        ? /Reply from/
        : /1 received/;
        
      const success = successPattern.test(stdout);
      
      // Try to extract time if successful
      let time = null;
      if (success) {
        const timePattern = process.platform === 'win32'
          ? /time[=<](\d+)ms/
          : /time=(\d+\.\d+) ms/;
          
        const match = stdout.match(timePattern);
        if (match && match[1]) {
          time = parseFloat(match[1]);
        }
      }
      
      resolve({
        success,
        time,
        ip: ipAddress,
        output: stdout
      });
    });
  });
}

/**
 * Perform a TCP ping by attempting to establish a connection to a specific port
 * @param {string} ipAddress - The IP address to ping
 * @param {number} port - The port to connect to
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<object>} - Promise resolving to result object
 */
function tcpPing(ipAddress, port, timeout = 2000) {
  return new Promise((resolve) => {
    // Validate IP address format
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(ipAddress)) {
      resolve({ success: false, error: 'Invalid IP address format' });
      return;
    }

    const net = require('net');
    const startTime = Date.now();
    
    const socket = new net.Socket();
    let resolved = false;

    // Set timeout
    socket.setTimeout(timeout);

    // Handle timeout
    socket.on('timeout', () => {
      if (resolved) return;
      resolved = true;
      socket.destroy();
      resolve({
        success: false,
        ip: ipAddress,
        port: port,
        error: 'Connection timed out'
      });
    });

    // Handle successful connection
    socket.on('connect', () => {
      if (resolved) return;
      resolved = true;
      const endTime = Date.now();
      socket.destroy();
      resolve({
        success: true,
        time: endTime - startTime,
        ip: ipAddress,
        port: port
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      if (resolved) return;
      resolved = true;
      socket.destroy();
      resolve({
        success: false,
        ip: ipAddress,
        port: port,
        error: error.message
      });
    });

    // Attempt to connect
    try {
      socket.connect(port, ipAddress);
    } catch (error) {
      if (resolved) return;
      resolved = true;
      socket.destroy();
      resolve({
        success: false,
        ip: ipAddress,
        port: port,
        error: error.message
      });
    }
  });
}

/**
 * Check if an instrument is connected and responsive
 * @param {string} ipAddress - IP address of the instrument
 * @param {string} instrumentType - Type of instrument for logging
 * @returns {Promise<object>} - Promise resolving to result object
 */
async function checkInstrumentConnection(ipAddress, instrumentType) {
  try {
    // First try ICMP ping
    const pingResult = await systemPing(ipAddress);
    
    if (pingResult.success) {
      return {
        success: true,
        message: `${instrumentType} at ${ipAddress} is reachable`,
        responseTime: pingResult.time,
        ip: ipAddress
      };
    }
    
    // If ICMP fails, try TCP ping on common instrument ports
    // Many instruments use port 5025 for SCPI
    const commonPorts = [5025, 80, 22, 23];
    
    for (const port of commonPorts) {
      const tcpResult = await tcpPing(ipAddress, port);
      if (tcpResult.success) {
        return {
          success: true,
          message: `${instrumentType} at ${ipAddress} is reachable on port ${port}`,
          responseTime: tcpResult.time,
          ip: ipAddress,
          port: port
        };
      }
    }
    
    // If both methods fail
    return {
      success: false,
      message: `${instrumentType} at ${ipAddress} is not reachable`,
      ip: ipAddress
    };
  } catch (error) {
    return {
      success: false,
      message: `Error checking ${instrumentType} connection: ${error.message}`,
      ip: ipAddress,
      error: error.message
    };
  }
}

// Export the functions
module.exports = {
  systemPing,
  tcpPing,
  checkInstrumentConnection
};