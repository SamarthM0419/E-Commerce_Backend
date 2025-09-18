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


- Express router : seperate router for auth and profile.


- profile/view api - GET
        - check for userAuth middleware , if token is present will send back the response.


- profile/edit - PATCH
        - validate req.body and attach every key to its corresponding key and saves into database.

- profile/changePassword - patch
        - get oldPassword , new Password from req.body
        - comapare oldPassword with password present in db
        - if true , encrypt the new password
        - store the new password into database.

- using redis cloud  
- created a .env with credentials

-created a publisher and subscriber and attached error listeners , to detect error when it fails.
- publisher.connect()
- subscriber.connect() which establishes connections.

- publish (channel , message) -> serializes message into JSON , sends message to redis.
- subscribe (channel , callback function) => parse the json

working:
- after signin , publish an event into redis server called user:signup
- the notificationListener subscribes to that server and listens and when it encounters the published event, it will trigger an event to sendEmail() which is set up by nodemailer.

- created a dataset of 1000 products containing images and pushed the image url into cloudinary(5000 images).
