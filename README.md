# MakerspaceQueue
Queue Automator for BYU HBLL Makerspace

http://35.153.196.169

### To do:
- [x] Setup server
- [x] Receive webhook from google froms
- [ ] Modify google sheets | [Docs](https://github.com/jpillora/node-google-sheets)
    - [x] Setup google api OAuth
- [ ] Upload folders to Box | [Docs](https://github.com/box/box-typescript-sdk-gen/tree/main)
    - [ ] Setup Box OAuth
- [ ] Send email from outlook

### Google Forms response data
```
{
    "body": {
        "First Name": "yooyoyoo",
        "Last Name": "susususuusp",
        "Email": "yo@sup.das",
        "Service": "3D Print",
        "Files": [
            "1_Coz3WcHb4NZYHsY5fquiv6ujWhuZGzc"
        ],
        "Academic": "Yes",
        "Type": "FDM",
        "Specific Requests": "yoyooyoyosuususupp"
    }
}
```