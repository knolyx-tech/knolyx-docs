---
title: Example Guide
description: A guide in my new Starlight docs site.
---

The theme docs uses the same api format as the sso docs.

# 4. create sso
PUT {{url}}/public/api/v1/organization/{organizationId}/theme
```
{
    "logoUrl": "{https logo url}", // can be null
    "logoType": "TYPE_IN_CAPS",  // can be null or one of: SQUARE, RECTANGLE
    "primaryColor": "#hexcolor", // hexcolor, example: #2596be
    "headerColor": "#hexcolor", // hexcolor, example: #145369
    "metaColorShade": "TYPE_IN_CAPS"  // one of: NORMAL, DARK, DARKER. If headerColor is darker as a color, use NORMAL, if light, use DARKER
}
```

# 1. Get theme - if no theme is set, then the response is empty, if not, the same response format as the create / edit request api is returned
GET {{url}}/public/api/v1/organization/{organizationId}/theme
