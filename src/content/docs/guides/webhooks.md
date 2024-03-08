---
title: Webhooks
description: a webhook integration guide
---

### Overview

The webhook api allows managing receiving events from knolyx.

### Existing event types

| Event                   | Description                                                                  |
|-------------------------|------------------------------------------------------------------------------|
| PING                    | Sent when creating a new webhook or manually to test the webhook integration |
 | COURSE_COMPLETED        | The event is sent when a student completes a course                          |
 | COURSE_STARTED          | The event is sent when a student starts a course                             |
 | COURSE_PAYMENT_RECEIVED | The event is send when a student buys a course                               |

### Event message
All events are sent as json in the following format:
```json
 {
 "id": "{{uuid}}",
 "type": "{{eventType}}",
 "data": "{{eventBody}}"
}
```

:::danger
The id of a webhook message is unique. Messages with the same id should be ignored. It's possible that the
message will be retransmitted if knolyx does not receive confirmation of handling the event.
:::

**PING** <br />
The ping event will have a body like:
``` json
{
    "id": "af46ec07-de79-40b5-916c-0058b54b2d2b",
    "type": "PING",
    "data": {
        "message": "PING"
    }
}
```

**COURSE_COMPLETED** <br />
The course completed event will have a body like:
``` json
{
    "id": "af46ec07-de79-40b5-916c-0058b54b2d2b",
    "type": "COURSE_COMPLETED",
    "data": {
        "user": {
          "id": {{user-id-as-long-value}},
          "name": "{{student-name}}",
          "email": "{{student-email}}"
        },
       "course": {
          "id": {{course-id-as-long-value}},
          "name": "{{completed-course-name}}",
       }
    }
}
```

**COURSE_STARTED** <br />
The course started event will have a body like:
``` json
{
    "id": "af46ec07-de79-40b5-916c-0058b54b2d2b",
    "type": "COURSE_STARTED",
    "data": {
        "user": {
          "id": {{user-id-as-long-value}},
          "name": "{{student-name}}",
          "email": "{{student-email}}"
        },
       "course": {
          "id": {{course-id-as-long-value}},
          "name": "{{completed-course-name}}",
       }
    }
}
```

**COURSE_PAYMENT_RECEIVED** <br />
The course payment received event will have a body like:
``` json
{
    "id": "af46ec07-de79-40b5-916c-0058b54b2d2b",
    "type": "COURSE_PAYMENT_RECEIVED",
    "data": {
        "user": {
          "id": {{user-id-as-long-value}},
          "name": "{{student-name}}",
          "email": "{{student-email}}"
        },
       "course": {
          "id": {{course-id-as-long-value}},
          "name": "{{course-name}}",
       }
    }
}
```

**BUNDLE_PAYMENT_RECEIVED** <br />
The bundle payment received event will have a body like:
``` json
{
    "id": "af46ec03-de79-40b5-916c-0058b54b2d2b",
    "type": "BUNDLE_PAYMENT_RECEIVED",
    "data": {
        "user": {
          "id": {{user-id-as-long-value}},
          "name": "{{student-name}}",
          "email": "{{student-email}}"
        },
       "bundle": {
          "id": {{bundle-id-as-long-value}},
          "slug": {{bundle-slug-as-string-value}},
          "name": "{{bundle-name}}",
       }
    }
}
```

### Webhook API

**Create webhook**
``` json
POST /public/api/v1/webhook
Content-Type: application/json
X-Api-Key: {{apiKey}}
X-Project-Id: {{projectId}}

{
  "name": "Webhook name",
  // url that accepts a PUT request
  "url": "https://valid-domain/hook",
  "securityToken": "token-generated-client-side"
}
```

:::caution
A valid webhook url can't be on http or on localhost. For local testing, a service like ngrok can be used.
:::

The security token will be created client side and passed to the create webhook api.
It will be sent on any webhook calls made by knolyx, and it will be found in the header "X-Webhook-Security-Token".
The platform should check every time that the token is the correct one.

On create, an event of type PING will be sent to platform to validate that the connection is good.


:::note
Knolyx will only accept a https url that does not point to a localhost app. 
To test in development we recommend a local reverse proxy like ngrok / or deploying to a network accessible dev environment.
:::

**Get all**
`GET /public/api/v1/webhook`

**Get one**
`GET /public/api/v1/webhook/{{wehbookId}}`

**Delete**
`DELETE /public/api/v1/webhook/{{wehbookId}}`

**Ping all**
`POST /public/api/v1/webhook/ping`

**Ping one**
`POST /public/api/v1/webhook/{{wehbookId}}/ping`


