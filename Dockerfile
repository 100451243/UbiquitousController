FROM node

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .


ENV PORT="8080"

CMD exec node src/app.js $PORT "/movies"

# (FROM TOP FOLDER)
# sudo docker build . -t adelpozoman/ubicu : builds the image
# sudo docker run -p 8080:8080 -v /actualPathToFilms/films:/movies adelpozoman/ubicu : runs the image with default port variable, specific path and the volume
# sudo docker run --env PORT=3000 -p 3000:3000 -v /actualPathToFilms/films:/movies adelpozoman/ubicu : runs the image with the env variables and the volume
# sudo docker push adelpozoman/ubicu : pushes the image to docker hub