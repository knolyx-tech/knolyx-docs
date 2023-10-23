---
title: Getting started
---



### 1.3. User API
The default role assign is an existing STUDENT role

**Provision user - if already exists, nothing happens**
PUT {{baseURL}}/public/api/v1/user/provision

{
"firstName": "firstName", // required
"lastName": "lastName", // required
"email": "email", // required
"gender": "MALE | FEMALE | NON_BINARY" // default to NON_BINARY,
"disableWelcomeEmail": true // always set to true, if not will send welcome message with username and password to student
}

returns a json with the id and name of the user created.

!! Note: SSO authentication automatically creates the user in knolyx after login, but to set the business rule that gives acces to a course ahead of student login, the userId must be known.!!

