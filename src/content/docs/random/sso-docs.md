---
title: Example Guide
description: A guide in my new Starlight docs site.
---

Base url: https://app.knolyx.net/api

X-PROJECT-ID=production-admin-klx
X-API-KEY=48dfbde6e8fb4dc98073d4aac1419aba

On each request, X-PROJECT-ID and X-API-KEY should be sent as header 
for authentication

to be brief: {{url}} = base url

# 1. create org
POST {{url}}/public/api/v1/organization

```
{
    "appUrl": "https://demo.knolyx.net", // should be unique, no dash in subdomain name (e.g. no demo-test.knolyx.net), ssl will be created with errors
    "name": "Org S", // needs to be unique
    "description": "Org desc", 
    "j": "12142343124131212", // needs to be unique
    "cui": "12312321112", // needs to be unique
    "iban": "1321321112", // needs to be unique
    "email": "org@knolyx.com"
}
```
This request will respond with an json object with a property id.
The id returned here is the {organizationId} that needs to be sent in subsequent requests.

# 2. create admin
POST {{url}}/public/api/v1/organization/{organizationId}/admin
```
{
    "firstName": "Admin",
    "lastName": "Admin",
    "email": "ionut+ssotestor3g@knolyx.com", // unique
    "disableWelcomeEmail": true
}
```

# 3. create realm
POST {{url}}/public/api/v1/organization/{organizationId}/keycloak

# 4. create sso
PUT {{url}}/public/api/v1/organization/{organizationId}/sso
```
{
    "websiteRootUrl": "https://knolyx.com" // the website that will need sso (e.g. if developing from localhost:3000, then the websiteRootUrl is "http:"//localhost:300")
}
```
!!! The protocol must be included, and no forward slash allowed at the end.
// BAD EXAMPLES: knolyx.com | localhost:3100/ | https://knolyx.com/

example response:
```
{
    "clientId": "website-client-id-111",
    "clientSecret": "005bdb02-9b96-4c07-8e8d-e986e9b3b630",
    "rootUrl": "https://knolyx.com/"
}
```
Please announce me if extra info is needed.

After creating sso, at login, an account with the admin email should be created. It will have all the roles in the org.