---
title: Getting started
---

# Calling the API

### API url

The base url for all public APIs is `https://api.knolyx.com`.
In the following pages, the next convention will be used:

```
Header: Value
Another-Header: Value

[GET|POST|PUT|DELETE] /endpoint
```

The final url should be `https://api.knolyx.com/endpoint`.

### Authentication

To authenticate, every request should send two headers: `X-Project-Id` and `X-Api-Key`. The values will be provided by knolyx.

### Permissions

Depending on the required use case, the api key may have the following permissions:

| Permission              | Description                                                    |
| ----------------------- | -------------------------------------------------------------- |
| USER_PROVISION          | Allows the api to create new users                             |
| WORKGROUP_ADD_MEMBER    | Allows the api to append an user to an existing group          |
| WORKGROUP_REMOVE_MEMBER | Allows the api to remove an user to an existing group          |
| WORKGROUP_LIST          | Allows the api to list all available groups                    |
| COURSE_LIST             | Allows the api to list available courses                       |
| COURSE_GET              | Allows the api to get specific info about a course             |
| WEBHOOK_MANAGE          | Allows the api to manage webhooks                              |
| BUSINESS_RULE_MANAGE    | Allows the api to manage rules, which allows access to courses |
| ADMIN_MANAGE            | Allows the api to edit the organization, theme settings, sso   |
| PAYMENT_INFO_READ       | Allows the api to read payment info                            |
| RESOURCE_LIST           | Allows the api to list all resources                           |
| RESOURCE_GET            | Allows the api to get specific resource details                |
| COMMUNITY_READ          | Allows the api to read info about community                    |
| EVENT_READ              | Allows the api to read event details                           |
| EVENT_MANAGE            | Allows the api to manage events                                |

The permissions assigned to the api key can only be changed by Knolyx. Please contact us if further changes are needed.

:::tip[See your current api permissions]
Using the endpoint `GET /public/api/v1/key` you can get your current api key permissions.
[Use openapi to see assigned permissions](https://api.knolyx.com/swagger-ui/index.html?configUrl=/v3/api-docs/swagger-config#/Current%20key%20APIs/getCurrentKey)
:::

# Testing the API

The api can be tested using [openapi](https://api.knolyx.com/swagger-ui.html).
