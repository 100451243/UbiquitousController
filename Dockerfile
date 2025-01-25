FROM node

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .


ENV HOST="wrong"
ENV PORT="wrong"

CMD exec node src/app.js $HOST $PORT
# (FROM TOP FOLDER)
# sudo docker build . -t adelpozoman/ubicu : builds the image
# sudo docker run --env HOST=192.168.1.12 --env PORT=3000 -p 3000:3000 -v /home/adelpozoman/films:/usr/src/app/src/movies adelpozoman/ubicu : runs the image with the env variables and the volume
# sudo docker push adelpozoman/ubicu : pushes the image to docker hub