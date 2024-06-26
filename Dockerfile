# Use the official Node.js image.
FROM node:18-alpine

# Set the timezone environment variable
ENV TZ=America/Bogota

# Install tzdata package to set timezone
RUN apt-get update && apt-get install -y tzdata

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application.
COPY . .

# Create the data directory for the database
RUN mkdir -p /usr/src/app/data

# Expose the port the app runs on.
EXPOSE 7891

# Initialize the database and start the server.
CMD ["sh", "-c", "npm run start"]
