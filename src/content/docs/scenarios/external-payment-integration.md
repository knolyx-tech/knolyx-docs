---
title: External payment integration
description: an api integration docs
---

## Scenario description
The following document describes a possible api integration for a third party that handles the payments on their own
server but wants to automate the process of enrolling new users.

:::tip[Authenticating the api request]
All the api described in the next section requires authentication. [See the getting started guide for more information regarding authentication and permissions.](/guides/getting-started)
:::


## Flow description
The guide assumes that the courses are already created in knolyx and all the necessary configuration regarding 
feedback, diplomas, gamification is already done.


1. **Extract the course id from knolyx**; 
   1. _the course id is need to assign the user to the correct course_
2. **Manually create a workgroup for that course**; 
   1. _a workgroup is a collection of users_
3. **Create a rule for that course with the workgroup**
   1. _a rule in knolyx is an entity that allows an admin to select witch persons have access to the course_
   2. _a rule can specify access to workgroups, departments and individual users_
   3. _a rule describes what diploma to use / what feedback and other information_
   4. _a rule can be private (access restricted using 3.2) or public (anyone with access to the platform can access the course)_
   5. _a rule has a start date and an end date (any date outside the interval will now allow the student to take the course)_
4. **Manually and the necessary feedback / diploma on that rule**
   1. _can't be done with the api_
5. **After a course is bought:**
   1. provision user
      1. _the api will check if the user does not have an account and creates it_
      2. _Nothing happens if the account already exists_
   2. add the student to the workgroup
      1. _this will give the student access to the course (the workgroup needs to be assigned to a rule on the course, see Flow 3.)_

Steps 1 through 4 are needed only once for each course.

## 1. Extract the course id from knolyx

**Get course list paged**
`GET /public/api/v1/course?pagination.page=0&pagination.size=20`

The api will return a json list, with objects that contain an id and a title. For a given course title, copy the course id.

## 2. Manually create a workgroup for that course
Ask an admin to create a workgroup with the name of the course.

**Get workgroup list paged**
`GET /public/api/v1/workgroup`

The api will return a json list, with objects that contain an id and a name. For a given workgroup name, copy the workgroup id.

## 3. Create a rule for that course with the workgroup

Create a rule using 3.2. Given than the course already exists, first the rules should be retrieved using 3.1, a new rule having
the shape of the example down below be added and saved using 3.2. In case future modifications of the rule should be done
using the api we recommend setting the name as something computer friendly (ex.: PAYMENT_INTEGRATION_COURSE_{courseId}).
Later, the rule can be identified using that name.

:::danger[test]
We recommend to first integrate with a demo course on the platform to avoid accidentally deleting in-use rules.
You must always return unmodified rules in the new request.
:::

Example:
```json
[
  {
    "id": 2296,
    "name": "Rule name",
    "type": "PUBLIC | PRIVATE", 
    // for this scenario use case, always private.
    // !!!Public will give access to all students on knolyx
    // start date and end date in UTC timezone with format:
    // year-month-day hour:minutes
    "startDateTime": "2020-05-06 21:00:00",
    // start date and end date in UTC timezone with format: 
    // year-month-day hour:minutes
    "endDateTime": "2022-12-30 22:00:00",
    // Note:!! startDate and endDate are required.
    // If the course is bought indefinetly,
    // set a 50 year timeframe for example
    "restrictions": {
      "minimumTime": false, // should be false
      "browseOrder": "anyOrder" // should be any order
    },
    "associations": {
      "WORKGROUP": [
        workgroupId
      ]
    },
    "action": "WORKGROUP" // ignore action field
  }
]
```

3.1 **Get rule**
`GET /public/api/v1/business-rule/course/{{courseId}}`
The GET request will return an array of applied rules to a course.


3.2 **Save rule**
`POST /public/api/v1/business-rule/course/{{courseId}}`

The post will apply the changes in rules. 
The old payload should be passed modified to the POST request. 
For example, to remove a workgroup from the list, we GET the rules of the course and POST the new rule list.

```json
[
  previous rules here...,
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
      "WORKGROUP": [
        24792,
        24793
        // workgroup removed from here
      ]
    }
  }
]
```
If the id is present in the rule, the api will modify the existing rule. If no id is given, a new rule is created.
If a rules is removed from the list, a POST action without it will delete it.


## 4. Manually and the necessary feedback / diploma on that rule

Get in touch with an admin to make the necessary changes. The diploma will be set on the rule created at step 3.

## 5. After a course is bought

### 5.1 provision user

**Provision user endpoint**
`POST /public/api/v1/user/provision`

The endpoints allow to create and edit basic user information.
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

### 5.2 add the student to the workgroup

**Add student to workgroup**

`PUT /public/api/v1/workgroup/{workgroupId}/member/{user-email}/`

*Body*
```json
{ "removalDate": "2024-05-04 14:30:00" }
```
The removal date is the date when the student is removed from the workgroup (and by extension loses access to the course).
If no removal date is needed, the value should be `null`.

The removal date has the format `yyyy-MM-dd HH:mm:ss` and should be in UTC time.

If the request was successful then a status code of 200 will be returned and a json of
format:

```json
{
  "email": "{user-email}"
}
```

To remove a student form the workgroup, repeat the above call with DELETE.


:::tip[Missing data]
If a user is not registered on the platform or the workgroup id does not exist,
a status of 404 is returned with a message of “Entity not found”!
:::