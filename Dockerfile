FROM node:16
WORKDIR /app
COPY . /app
RUN npm i
ENV PORT 3000
ENV DB_URI mongodb://localhost:27017/wallet
EXPOSE 3000
CMD [ "node", "bin/www" ]
