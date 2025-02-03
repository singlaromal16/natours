# Create User Model, controller and routing and save the user in DB

# Decrypt the password by using bcrypt lib

    *npm i bcrypt*

`userSchema.pre('save', function (next) {
if (!this.isModified('password')) {
return;
}
next();
this.password = bcrypt.hash(this.password, 12);
});`

# How Authentication with JWT works

- JWT is a stateless solution for authentication means there is no need to store any session state on the server
- Signing Algorithm to create unique signature
- create token and send it to client
- client should store that token either in cookie or local storage
- you can check decoded token in jwt debugger online

# Signing up Users

- install lib to create token
  `npm i jsonwebtoken`
- jwt.sign to create token
- jwt.verify to verify coming token

# Login User

- We can create custom methos on document like we have created in userModel

# Protecting tour Routes

- set the token in the request headers

# Send Email using NodeEmailer

- MailTrap is a service which send fake email to real email address in development mode
-

# Security and Authentication COURSE(IMPORTANT)

- Common Attacks

1. CROSS-SITE SCRIPTING (XSS) ATTACKS

- Frontend side : Dont't store web token in localstorage. Instead of this, it should be storeed in an HTTP-only cookie that makes it so that the browser can only receive and send the cookie but can not access or modify it in any way. So, attackers can not steal the token that is stored in the cookie.
- Backend side: in order to prevent XSS attacks, set some special HTTP headers which makes these attacks a bit more difficult to happen. Express dont come with these best practices out of the box, So, we are gonna use middleware (HELMET)

2. Denial-of-Service (DOS) Attack
3. NOSQL QUERY INJECTION
4. BRUTE FORCE ATTACKS

- RATE LIMITER
  Rate limiter - It is used to count the number of requests coming from one IP and when there are too many requests, block these requests
  `npm i express-rate-limit`

- HELMET
  `npm i helmet`

- Mongo Sanitization - This lib looks req body, params , query string and filtered out all the dollar sign and dots. For example if we login we can login with below payload.

  `payload = {
 "email": {"$gt": ""},
 "password": "123456789"
}`

  ```

  ```

`npm i express-mongo-sanitize`

- XSS: Imagine that an attacker would try to insert some malicious HTML code with some JAVASCRIPT code attached to it. If that would later be injected into our HTML site. It could realy create some damage then. USing this middle we prevent this. For Example Signup with below payload and xss lib convert html into symbols.
  `{
    "name": "<div id='bad-code'>Name</div>",
    "email": "test@gmail.com",
    "password": "123456789",
    "passwordConfirm": "123456789",
    "role": "guide"
}`

  `npm i xss-clean`

```

```

- Prevent Parameter Pollution - It removes duplication req params For eg: if we add sort query param twice.

`npm i hpp`

### For Bundler

- use parcel instead of webpack : It has no complex configuration like webpack

`npm i parcel-bundler`

- add script in package.json

`"watch:js" : "parcel watch ./public/js/index.js --out-dir ./public/js/ --out-file bundle.js",`

`"build:js" : "parcel watch ./public/js/index.js --out-dir ./public/js/ --out-file bundle.js"`
