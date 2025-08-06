# Use Node.js 18 Alpine for development
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY hahntaskmanager.client/package*.json ./
# Install dependencies
RUN npm install
RUN npm install -g @angular/cli

# Copy the rest of the application
COPY hahntaskmanager.client ./

# Expose the Angular dev server port
EXPOSE 4200

# Start the Angular development server
CMD ["npm", "start"]
