authService:

- signUp - POST

  - validate the req.body
  - encrypt the password
  - save the user

  emailId : test1@gmail.com
  password: Test@123

- login - POST

  - After validating the credentials in database , the server sends an auth token(jwt token) back to user , which is stored by user.
  - For all the requests , user sends jwt token with it , so that server knows it is authenticated(it validates every time).
  - For storage of tokens , we use cookies. cookies stores jwt tokens. Cookies are stored by all browsers.
  - If cookie is expired , we have to login again.

  - cookieparser to read the cookies.

  - JWT token (3 colors : red : header, pink : payload , blue : signature)
  - jsonwebtoken to create a jwt token
  - using jwt.sign() : which takes two arguments(data to be stored , SECRET KEY).

- Creating auth middleware

      - read the cookie from the req cookie.  (req.cookies)
      - validate the token - finding the decodedObj = jwt.verify(token, process.env.JWT_SECRET).
      - Find the user excluding password : await Auth.findById(_id).select("-password");

- logout - POST
      - expires the cookie as we click on logout as token will be present in cookies and it will expire also.
