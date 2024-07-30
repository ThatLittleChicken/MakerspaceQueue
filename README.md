# MakerspaceQueue
Queue Automator for BYU HBLL Makerspace

http://35.153.196.169
https://queue.hbllmakerspace.click/

### To do:
- [x] Setup server
- [x] Receive webhook from google froms
- [x] Modify google sheets | [Docs](https://github.com/jpillora/node-google-sheets)
    - [x] Setup google api OAuth
- [x] Upload folders to Box | [Docs](https://github.com/box/box-typescript-sdk-gen/tree/main)
    - [x] Setup Box OAuth
- [ ] Send email from outlook

### Google Forms response data
```
{
    "First Name": "yooyoyoo",
    "Last Name": "susususuusp",
    "Email": "yo@sup.das",
    "Service": "3D Print",
    "Files": [
        "1mqIUCYhmr1RkdndzKpFx1HhNLmPCjEsV"
    ],
    "Academic": "Yes",
    "Type": "FDM",
    "Specific Requests": "yoyooyoyosuususupp"
}
```
```
curl -H "Content-Type: application/json" -X POST -d '{ "First Name": "yooyoyoo", "Last Name": "susususuusp", "Email": "yo@sup.das", "Service": "3D Print", "Files": [ "1mqIUCYhmr1RkdndzKpFx1HhNLmPCjEsV" ], "Academic": "Yes", "Type": "FDM", "Specific Requests": "yoyooyoyosuususupp" }' http://localhost:3000/data
```

