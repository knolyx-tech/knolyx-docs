---
title: Event Registration Integration
description: API integration guide for event registration
---

## Scenario description
The following document describes the API integration flow for registering users to events, including necessary account setup and community access management.

:::tip[Authenticating the api request]
All the API described in the next section requires authentication. [See the getting started guide for more information regarding authentication and permissions.](/guides/getting-started)
:::

## Flow description
The guide assumes that the events are already created in knolyx and all the necessary configuration regarding 
community access and workgroups is already done.

1. **Check/Create User Account**
   1. _the API will check if the user does not have an account and creates it_
   2. _Nothing happens if the account already exists_
2. **Ensure Community Access**
   1. _add the user to the appropriate workgroup for event access_
   2. _this will give the user access to the community and its events_
3. **Register for Event**
   1. _mark the user as attending the event_
   2. _this will add the user to the event's attendee list_

## 1. Check/Create User Account

### 1.1 Provision user endpoint
`POST /public/api/v1/user/provision`

The endpoint allows creating and editing basic user information.
If the user does not exist, the response status will be 201 (created) and an on-boarding
email is sent to the user. If the user exists, the response status will be 200 OK, no
email will be sent and the changed fields will be persisted.

**Example body**
```json
{
  "firstName": "Jon",
  "lastName": "Doe",
  "email": "jon.doe@knolyx.com",
  "gender": "NON-BINARY"
}
```

All fields besides gender are required. If gender is omitted, a default value of NON-BINARY is set.
Gender values allowed: NON-BINARY | MALE | FEMALE.

## 2. Ensure Community Access

### 2.1 Add user to workgroup
`PUT /public/api/v1/workgroup/{workgroupId}/member/{user-email}/`

*Body*
```json
{ "removalDate": "2024-05-04 14:30:00" }
```
The removal date is the date when the user is removed from the workgroup (and by extension loses access to the community).
If no removal date is needed, the value should be `null`.

The removal date has the format `yyyy-MM-dd HH:mm:ss` and should be in UTC time.

If the request was successful then a status code of 200 will be returned and a json of
format:

```json
{
  "email": "{user-email}"
}
```

:::tip[Missing data]
If a user is not registered on the platform or the workgroup id does not exist,
a status of 404 is returned with a message of "Entity not found"!
:::

## 3. Register for Event

### 3.1 Mark user as attending
`POST /public/api/v1/community/{communityId}/event/{eventId}/attend/{userId}`

This endpoint marks the user as attending the event. The user must have access to the community (through workgroup membership) to be able to register for events.

If the request was successful, a status code of 200 will be returned.

:::tip[Error handling]
- If the event doesn't exist, a 404 status code will be returned
- If the user is already registered, a 409 status code will be returned
- If the user doesn't have community access, a 403 status code will be returned
:::

### 3.2 Cancel attendance (if needed)
`DELETE /public/api/v1/community/{communityId}/event/{eventId}/attend/{userId}`

This endpoint cancels the user's attendance for the event.

If the request was successful, a status code of 200 will be returned.

:::tip[Error handling]
- If the event doesn't exist, a 404 status code will be returned
- If the user is not registered for the event, a 404 status code will be returned
:::

## Required Permissions

To implement this integration, you'll need an API key with the following permissions:
- `USER_PROVISION`: For creating new user accounts
- `WORKGROUP_ADD_MEMBER`: For adding users to workgroups
- `EVENT_MANAGE`: For managing event attendance

To create an API key with these permissions, see the [getting started guide](/guides/getting-started). 