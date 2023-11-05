# Inherit image from antother image with linux OS & Node.js (+versions) run time:
FROM node:18-alpine3.18

# Install nodemon globally for hot-reloading using a Host Volume on project directory:
RUN npm i -g nodemon

# Global installations for node runtime:
RUN npm i -g ts-node

# Project directory:
WORKDIR /app

# Copy package.json into /app:
COPY package*.json /app

# Local installations for the project (node_modules):
RUN npm i

# Copy everthing that in the app into docker image:
COPY . /app

# Commard to run the app:
ENTRYPOINT npm start