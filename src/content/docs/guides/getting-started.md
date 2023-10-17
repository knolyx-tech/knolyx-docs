---
title: Example Guide
description: A guide in my new Starlight docs site.
---

```js /age/#v /name/#v /setAge/#s /setName/#s /50/#i /'Taylor'/#i
const [age, setAge] = useState(50);
const [name, setName] = useState('Taylor');
```

In the following guide I will refer to the decalex app as decalex, and the knolyx app as knolyx.

``` json
{
  "name": "Name",
  "url": "https://valid-domain/hook",
  "securityToken": "token-generated-client-side"
}
```

# Flow
1. -> An admin creates a course in decalex;
2. -> An admin creates a course in knolyx;
   (are steps 1 and 2 synchronised in any way?)
   _Decalex will need to keep the knolyx course id for later referencing. It can be found in the navbar clicking on a knolyx course (the link is of format `decalex.knolyx.com/courses/{courseId}`_

3. -> An admin will assign a course in decalex to a student;
   _Decalex will use the user (1.3) api to create the user in knolyx. Then it will use the business rule (1.4) api to register the user to a "business rule" which will give him acces in knolyx._

4. -> A student click on the assigned course, the student is redirected on knolyx;
   _Decalex will redirect to a url in the form of `decalex.knolyx.com/courses/{knolyxCourseId}`. If single sign-on is setup, the user will be auto authenticated as long as the session is not expired._

6. -> The student completes the course in knolyx;

7. -> The course is marked as completed in decalex.
   _Decalex will use the webhook (1.1) api to listen to course completed events to mark the course as finished for the user. Note: If the same student is later assigned the same course in knolyx, it will not resent the course completed event, as it's already finished._

# Technical Details

## 1. Public API
The base url for all public API's is `https://decalex.knolyx.com/api`. For testing proposes, `https://qa-decalex.knolyx.com/api` can be used. A full set of credentials will be offered besides this document.

### 1.0. Authentication
To authenticate, every request should send two headers: `X-Project-Id` and `X-Api-Key`.

### 1.1. Webhook API
**Create webhook**
``` json
POST {{baseURL}}/public/api/v1/webhook
Content-Type: application/json
X-Api-Key: {{apiKey}}
X-Project-Id: {{projectId}}
{
  "name": "Name",
  "url": "https://valid-domain/hook",
  "securityToken": "token-generated-client-side"
}
```
!! The security token will be created client side and passed to the create webhook api. It will be sent on any webhook calls made by knolyx and it can be found in the header "X-Webhook-Security-Token". Decalex should check every time that the token is the correct one. !!

On create, an event of type PING will be send to decalex to validate that the connection is good. Knolyx will only accept a https url that does not point to a localhost app. To test in development we recommend a local reverse proxy like ngrok / or deploying to a network accessible dev environment.

The ping event will have a json like:
``` json
{
    "id": "af46ec07-de79-40b5-916c-0058b54b2d2b", // unique id, messages with the same id should be ignored
    "type": "PING",
    "data": {
        "message": "PING"
    }
}
```

The course completed event will have a json like:
``` json
{
    "id": "af46ec07-de79-40b5-916c-0058b54b2d2b", // unique id, messages with the same id should be ignored
    "type": "COURSE_COMPLETED",
    "data": {
        "user": {
          "id": user-id-as-long-value,
          "name": "student name",
          "email": "student-email"
        },
       "course": {
          "id": course-id-as-long-value,
          "name": "completed course name",
       }
    }
}
```

**Get all**
`GET {{baseURL}}/public/api/v1/webhook`

**Get one**
`GET {{baseURL}}/public/api/v1/webhook/{{wehbookId}}`

**Delete**
`DELETE {{baseURL}}/public/api/v1/webhook/{{wehbookId}}`

**Ping all**
`POST {{baseURL}}/public/api/v1/webhook/ping`

**Ping one**
`POST {{baseURL}}/public/api/v1/webhook/{{wehbookId}}/ping`

### 1.2. Course API
**Get course list paged**
`GET {{baseURL}}/public/api/v1/course?pagination.page=0&pagination.size=20`

**Get course image**
`GET {{baseURL}}/public/api/v1/course/{{courseId}}/image`


### Get one course
`GET {{baseURL}}/public/api/v1/course/{{courseId}}`

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


### 1.4. Business rule API

**Get rule**
`GET {{baseURL}}/public/api/v1/business-rule/course/{{courseId}}`
The GET request will return an array of applied rules to a course.
Example:
```
[
  {
    "id": 2296,
    "name": "Rule name",
    "type": "PUBLIC | PRIVATE", // for decalex use case, always private. !!!Public will give access to all students on knolyx
    "startDateTime": "2020-05-06 21:00:00", // start date and end date in UTC timezone with format: year-month-day hour:minutes
    "endDateTime": "2022-12-30 22:00:00", // start date and end date in UTC timezone with format: year-month-day hour:minutes
    "restrictions": {
      "minimumTime": false, // should be false
      "browseOrder": "anyOrder" // should be any order
    },
    "associations": {
      "USER": [
        24792, // users allowed to see this course between {startDate} and {endDate}
        24793, // if the startDate and endDate are different for students, each student should have a separate PRIVATE rule
        24794 // if not, all can be in the same rule, just removed the userId from rule.associations.USER list
              // Note:!! startDate and endDate are required.
      ]
    }, // there can be other types that user (DEPARTMENT, WORKGROUP, JOB)
    "action": "STUDENTS" // ignore action field
  }
]```

**Save rule**
`POST {{baseURL}}/public/api/v1/business-rule/course/{{courseId}}`

The post will apply the changes in rules. 
!!The old payload should be passed modified to the POST request. For example, to remove a user from the list, we GET the rules of the course and POST the new rule list.

```
[
{
"id": 2296,
"name": "rule name modified",
"type": "PRIVATE",
"startDateTime": "2020-05-06 21:00:00",
"endDateTime": "2022-12-30 22:00:00",
"restrictions": {
"minimumTime": false,
"browseOrder": "anyOrder"
},
"associations": {
"USER": [
24792,
24793 // user removed from here
]
}
}
]
```
If the id is present in the rule, the api will modify the existing rule. If no id is given, a new rule is created.
If a rules is removed from the list, a POST action without it will delete it.

## 2 SSO integration
For SSO integration knolyx will need:
1. a client id
2. client secret
3. redirect url set in the sso client as: `decalex.knolyx.com/sso_redirect`
4. token uri
5. issuer uri
6. sso provider name
7. SSO TYPE (oauth2 or openId connect- only oauth2 is fully supported at the moment)