# RGB's BACKEND DOCUMENTATION

DOMAIN = ["RGB's Domain"](https://rgb-psi.vercel.app/)
Default_API = ["RGB's Default API"](https://rgb-psi.vercel.app/api)

## CREATING DRAFT 

Endpoint = ["RGB's Creating draft endpoint"](https://rgb-psi.vercel.app/api/create-draft);

Method = "POST"

Payload

```json
{
  "tune": "dumb",
  "mode": "blue",
  "recipient": "Alan",
  "optional": "He's a kind person"
}

```

### tune = ["pidgin", "dumb", "fluent", "default"]

### mode = ["red", "green", "blue"]

### optional = "Any extra information you have on the person or yourself"

### recipient = "The person's name or uid"