# Use an official Node.js runtime as the base image
FROM node:18.17.1 as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
