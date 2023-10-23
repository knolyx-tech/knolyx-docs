---
title: Example Guide
description: A guide in my new Starlight docs site.
---

Guides lead a user through a specific task they want to accomplish, often with a sequence of steps.
Writing a good guide requires thinking about what your users are trying to do.


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
    "type": "PUBLIC | PRIVATE", // for platform use case, always private. !!!Public will give access to all students on knolyx
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