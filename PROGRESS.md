- setting up of project and npm init.
- installing expressjs -> npm i express.
- creating an express js server.
- installing nodemon.
- git init and gitignore.

- Created cluster and connected using mongodb compass.
- npm i mongoose
- connecting to cluster

- added separate models for user and auth
- env for protection
- separate files for establishing connection to database
- separate files for even the servers for each services.

- adding express json middleware to read the json
- adding validations on schema level (using npm i validator)

- Encryting the password using bcrypt
- bcrypt.hash(password(plain text) , saltrounds(layers on encryption))
- created /signup api.

- login api
    - checking if user is present
    - checking the password is valid
    - ifPasswordValid - generate JWT token and send it user using cookies. (res.cookie in expressJs).
    - cookie parser to read the cookie
