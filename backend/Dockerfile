FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --silent

# Copy app source code
COPY . .

#Expose port and start application
EXPOSE 8081
CMD [ "npm", "start" ]
