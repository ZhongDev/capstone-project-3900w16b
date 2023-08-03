### capstone-project-3900w16b-drop-table-students

# Plateholder Restaurant Management System

Plateholder is an restaurant management system that is designed to have an easy to use, modern and responsive interface that allows restaurants to serve their customers quickly and efficently.

# Standard Evaluation Installation Instructions

To install Plateholder for evaluation, ensure that [docker](https://www.docker.com/ "Click here to goto the docker download page") is installed on the computer.

1. Unzip the submission zip file into a folder
2. In a terminal, run `docker compose build` from the root directory of the project. This may take up to a few minutes.
   ![commandline with docker compose build command](/readme-images/readme-0.png)
   Once the build finishes, you should see something similar to this:
   ![commandline showing build complete](/readme-images/readme-1.png)
3. Now run `docker compose up` to build and start the backend and frontend. Proceed to the next step once you see `Running on 3001`.
   ![commandline showing "Running on 3001"](/readme-images/readme-2.png)
4. Open your browser (Chrome or Firefox preferred), and go to `http://localhost:3000`
5. Click on the `Sign In` button on the top right, and log in with the test account:

   > Email: jason@zhong.au

   > Password: asdf1234

6. To stop the software, press Control and C at the same time, and then run `docker compose down`

# Development Installation Instructions

To install the project for development, make sure [nodeJS](https://nodejs.org/en/download/ "Click here to goto the nodeJS download page") is already installed. The LTS version is recommended for this project. If issues occur, please attempt to install node version `v18.16.0`.

### Setup

1.  Clone the repository
2.  Run `npm i` in `/server`, and wait for packages to install
3.  Run `npx knex migrate:latest` in `/server` to generate a database file
4.  Create a file named `.env` in `/server` with the template
    ```
    PORT=3001
    JWT_KEY=<jwt key>
    ```
    replacing `<jwt key>` with any string of choice for jwt authenication.
5.  Run `npm i` in `/client`, and wait for packages to install

### Running the software

1.  Run `nodemon index.ts` in `/server` to initiate the backend
2.  Run `npm run build` in `/client` to build the frontend
3.  Run `npm start` in `/client` to start the frontend
4.  Use `Cntrl + C` to close either instance.
