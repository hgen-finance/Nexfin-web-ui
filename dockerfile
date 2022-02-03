FROM node:14

WORKDIR /app/client

# Install app dependencies
# copy both package.json AND package-lock.json
COPY package*.json /app/client

RUN npm install

# Bundle app source
COPY . /app/client/

# build necessary, even if no static files are needed,
# since it builds the server as well
RUN npm run build

# expose 5000 on container
EXPOSE 5000

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0

# set app port
ENV NUXT_PORT=5000

# start the app
CMD [ "npm", "start" ]
