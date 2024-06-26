# Performance Insight

Performance Insight is a web application to evaluate multiple requests to an endpoint and measure their performance. It provides an easy-to-use interface for running HTTP requests and visualizing their metrics.

## Features

- Run multiple HTTP requests with configurable parameters.
- Measure and display metrics such as total requests, requests per second, average response time, and error percentage.
- Visualize metrics for each session in a card layout.
- Supports GET and POST methods with optional request bodies for POST requests.
- Dynamic calculation of request duration, updating in real-time for running requests.

## Prerequisites

- Node.js and npm installed on your system.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/performance-insight.git
```

2. Navigate to the project directory:

```bash
cd performance-insight
```

3. Install the dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm start
```

The application will be accessible at `http://localhost:7891`.

## Usage

### Running Requests

1. Open the application in your browser.
2. Fill out the form to configure your request:
   - **Method**: Select either GET or POST.
   - **URL**: Enter the endpoint URL.
   - **Iterations**: Number of times to repeat the request.
   - **Delay**: Delay between requests in milliseconds.
   - **Virtual Users**: Number of virtual users to simulate.
   - **Duration**: Duration to run the test in seconds.
   - **Request Body**: (Visible only for POST method) Enter the JSON formatted request body.
3. Click the **Run** button to initiate the requests.

### Viewing Metrics

- The metrics for each session will be displayed in the "Session Metrics" section.
- Each session will be shown as a card with the following information:
  - Session ID
  - Status (running or completed)
  - Start Time
  - End Time (blank if not available)
  - Duration (only for completed sessions)
  - Total Requests
  - Requests Per Second
  - Average Response Time (ms)
  - Error Percentage

## Project Structure

```
/performance-insight
├── /public
│ ├── index.html
│ ├── styles.css
│ └── script.js
├── /src
│ └── axiosInterceptors.ts
│ └── database.ts
│ ├── index.ts
│ ├── requestRunner.ts
│ └── routes.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Dependencies

- [Express](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [Moment.js](https://momentjs.com/)
- [Humanize Duration](https://www.npmjs.com/package/humanize-duration)

## Docker Instructions

### Build Docker Image

1. Build the Docker image:

```bash
docker build -t performance-insight .
```

### Run Docker Container

2. Run the Docker container:

```bash
docker run -p 7891:7891 performance-insight
```

The application will be accessible at `http://localhost:7891`.

### Docker Compose Instructions

1. Run the Docker Compose command to build and start the services:

```bash
docker compose up -d
```

The application will be accessible at `http://localhost:7891`.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request.

## License

This project is licensed under the MIT License.
