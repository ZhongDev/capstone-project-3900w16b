# syntax=docker/dockerfile:1
   
FROM node:16-bookworm
WORKDIR /
COPY . .
ENV NODE_OPTIONS=--max_old_space_size=2048
RUN npm install
RUN npm run migrate
CMD ["npm", "start"]
EXPOSE 3001