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

bIHbv24MWmeRgasZH58o
JBFqnCBsd6RMkjVDRZzb
FGY2WhTYpPnrIDTdsKH5

```js
async function playAudioFromBackend(textInput) {
  const response = await fetch('https://rgb-psi.vercel.app/api/generate-audio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: textInput }),
  });

  if (!response.ok) {
    console.error("Failed to fetch audio");
    return;
  }

  // 1. Convert the incoming stream into a binary Blob
  const audioBlob = await response.blob();

  // 2. Create a local URL pointing to that blob
  const audioUrl = URL.createObjectURL(audioBlob);

  // 3. Play the audio in the browser
  const audio = new Audio(audioUrl);
  audio.play();
}
```
