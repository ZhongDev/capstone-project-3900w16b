# syntax=docker/dockerfile:1
   
FROM node:16-bookworm
WORKDIR /
COPY . .
ENV NODE_OPTIONS=--max_old_space_size=2048
ENV NEXT_PUBLIC_BASEURL=http://localhost:3001
ENV NEXT_PUBLIC_IMAGEURL=http://plateholder-server:3001
RUN npm install
RUN npm run build
CMD ["npm", "start"]
EXPOSE 3000