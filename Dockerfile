FROM node:11.14.0

# make working directory
WORKDIR /usr/src/app

# copy over package.json and package-lock.json
COPY ./package*.json ./

# install dependencies
RUN npm install

# copy source code
COPY ./ ./

# run our app
CMD ["npm", "start"]
