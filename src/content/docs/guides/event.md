---
title: Events
description: event external api guide
---

### Overview

The event api allows managing community events from knolyx.

# Technical Details

## 1. Public API

### 1.0. Authentication
To authenticate, every request should send two headers: `X-Project-Id` and `X-Api-Key`.

### 1.1. Event API

**Get event list paged**
`GET {{baseURL}}/public/api/v1/community/{communityId}/event/paged?pagination.page=0&pagination.size=20`

**Get one event**
`GET {{baseURL}}/public/api/v1/community/{communityId}/event/{eventId}`

**Get attendee list paged for specific event**
`GET {{baseURL}}/public/api/v1/community/{communityId}/event/{eventId}/attendees/paged?pagination.page=0&pagination.size=20`

**Mark the user as attending the event**
`POST {{baseURL}}/public/api/v1/community/{communityId}/event/{eventId}/attend/{userId}`

**Cancel the user's attendance for the event**
`DELETE {{baseURL}}/public/api/v1/community/{communityId}/event/{eventId}/attend/{userId}`

!!!! These APIs should be called with a per organization API key.
To create one with the master API key:
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
        "EVENT_READ",
        "EVENT_MANAGE"
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
        "EVENT_READ",
        "EVENT_MANAGE"
    ]
}
```
