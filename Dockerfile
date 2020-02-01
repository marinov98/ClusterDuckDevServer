FROM node:13


# Create app directory
WORKDIR /usr/src/service

# Get package.json and package-lock.json
COPY package*.json ./
COPY .babelrc ./

RUN npm i 
#--only=development

# production
#RUN npm ci --only=production


# Bundle app source
COPY . .


# Babel generation
RUN npm run build

EXPOSE 8080

CMD ["node", "dist/index.js"]