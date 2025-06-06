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
