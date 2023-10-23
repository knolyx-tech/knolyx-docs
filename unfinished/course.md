---
title: Example Guide
description: A guide in my new Starlight docs site.
---

### 1.2. Course API
**Get course list paged**
`GET {{baseURL}}/public/api/v1/course?pagination.page=0&pagination.size=20`

**Get course image**
`GET {{baseURL}}/public/api/v1/course/{{courseId}}/image`


### Get one course
`GET {{baseURL}}/public/api/v1/course/{{courseId}}`

!!!! These api's should be called with a per organization api key.
To create one with the master api key:
### POST {{url}}/public/api/v1/organization/api-key
```
{
    "tenantId": "107", // org id
    "projectId": "b2t-107", // recommend - b2t-{orgId}
    "permissions": [
        "USER_PROVISION",
        "WORKGROUP_ADD_MEMBER",
        "WORKGROUP_REMOVE_MEMBER",
        "WORKGROUP_LIST",
        "COURSE_LIST",
        "COURSE_GET",
        "WEBHOOK_MANAGE",
        "BUSINESS_RULE_MANAGE"
    ]
}
```

returned:
```
{
    "id": 9,
    "projectId": "b2t-107",
    "apiKey": "8905fb06a19144d184b041a2efd8f6ac", // only returned once
    "tenantId": 107,
    "permissions": [
        "USER_PROVISION",
        "WORKGROUP_ADD_MEMBER",
        "WORKGROUP_REMOVE_MEMBER",
        "WORKGROUP_LIST",
        "COURSE_LIST",
        "COURSE_GET",
        "WEBHOOK_MANAGE",
        "BUSINESS_RULE_MANAGE"
    ]
}
```

# Technical Details

## 1. Public API

### 1.0. Authentication
To authenticate, every request should send two headers: `X-Project-Id` and `X-Api-Key`.

### 1.1. Webhook API
**Create webhook**
```
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
!! The security token will be created client side and passed to the create webhook api. It will be sent on any webhook calls made by knolyx and it can be found in the header "X-Webhook-Security-Token". AdminSite should check every time that the token is the correct one. !!

On create, an event of type PING will be send to AdminSite to validate that the connection is good. Knolyx will only accept a https url that does not point to a localhost app. To test in development we recommend a local reverse proxy like ngrok / or deploying to a network accessible dev environment.

The ping event will have a json like:
```
{
    "id": "af46ec07-de79-40b5-916c-0058b54b2d2b", // unique id, messages with the same id should be ignored
    "type": "PING",
    "data": {
        "message": "PING"
    }
}
```

The course completed event will have a json like:
```
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

### 1.2. Course API
**Get course list paged**
`GET {{baseURL}}/public/api/v1/course?pagination.page=0&pagination.size=20`

**Get course image**
`GET {{baseURL}}/public/api/v1/course/{{courseId}}/image`


### Get one course
`GET {{baseURL}}/public/api/v1/course/{{courseId}}`


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
    "type": "PUBLIC | PRIVATE", // for AdminSite use case, always private. !!!Public will give access to all students on knolyx
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
