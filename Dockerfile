# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /src

# Copy the package.json and package-lock.json files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files, excluding node_modules
COPY . .

# Build the SvelteKit application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "preview"]
