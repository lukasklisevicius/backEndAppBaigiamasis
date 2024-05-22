# Use the official Node.js image as base
FROM node:latest

# Set the working directory inside the container
WORKDIR .

# Bundle app source
COPY . .

# Install dependencies
RUN npm install


# Command to run the application
CMD ["node", "server.js"]


# Expose the port that your app runs on
EXPOSE 3000
