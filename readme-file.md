# RF Testing Application

A desktop application for testing RF parameters via Bluetooth communication to end devices. The app connects to power analyzers and spectrum analyzers to measure data, saves results, and generates test reports.

## Features

- Bluetooth device connection and management
- Multiple testing protocols: LoRa, Cellular, BLE
- Test equipment integration (spectrum analyzer, power analyzer)
- Customizable test sequences
- Data collection and reporting
- Modern, responsive UI with collapsible sidebar

## Screenshot

![RF Testing Application](path/to/screenshot.png)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/rf-test-app.git
   cd rf-test-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

### Development Mode

Run the application with hot-reloading for development:

```
npm run dev
```

### Production Mode

Run the application in standard mode:

```
npm start
```

## Project Structure

```
rf-test-app/
├── main.js               # Electron main process
├── index.html            # Main HTML entry point
├── renderer.js           # Main renderer process logic
├── titlebar.js           # Custom title bar controls
├── sidebar.js            # Sidebar and navigation handling
├── tooltip.js            # Custom tooltips for navigation
├── style.css             # Main application styles
├── pages/                # Individual page content
├── assets/               # Images and other assets
└── package.json          # Project configuration
```

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/my-feature`)
6. Create a new Pull Request

## Building for Production

To build the application for distribution:

```
npm run build
```

This will create installer packages in the `dist` directory.

## Known Issues

- DevTools may show some autofill-related errors that can be safely ignored.

## License

[MIT](LICENSE)

## Contact

For questions or support, please open an issue in the GitHub repository.