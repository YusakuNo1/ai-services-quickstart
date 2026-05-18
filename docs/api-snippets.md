# API Snippets

Quick-start request examples for the Zoom AI Services Scribe, Summarizer, and Translator endpoints.

## Scribe

### cURL

```bash
curl -X POST \
  https://api.zoom.us/v2/aiservices/scribe/transcribe \
  -H "Authorization: Bearer $YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "file": "{YOUR_AUDIO_URL}" }'
```

### Python

```python
import requests

# Transcribe a file
url = "https://api.zoom.us/v2/aiservices/scribe/transcribe"
headers = {
    "Authorization": f"Bearer {YOUR_JWT_TOKEN}",
    "Content-Type": "application/json"
}
data = {
    "file": "{YOUR_AUDIO_URL}"
}

response = requests.post(url, headers=headers, json=data)
print(response.json())
```

### JavaScript

```javascript
// Transcribe a file
const response = await fetch(
  "https://api.zoom.us/v2/aiservices/scribe/transcribe",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${YOUR_JWT_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "file": "{YOUR_AUDIO_URL}"
    })
  }
);

const data = await response.json();
console.log(data);
```

## Summarizer

### cURL

```bash
curl -X POST \
  https://api.zoom.us/v2/aiservices/summarizer/summarize \
  -H "Authorization: Bearer $YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "input": { "text": "{YOUR_CONVERSATION_TRANSCRIPT}" },
    "config": {
      "task": "summary",
      "output_format": "structured_json",
      "language": "en-us",
      "summary_type": "conversation"
    }
  }'
```

### Python

```python
import requests

# Summarize a conversation
url = "https://api.zoom.us/v2/aiservices/summarizer/summarize"
headers = {
    "Authorization": f"Bearer {YOUR_JWT_TOKEN}",
    "Content-Type": "application/json"
}
data = {
    "input": {"text": "{YOUR_CONVERSATION_TRANSCRIPT}"},
    "config": {
        "task": "summary",
        "output_format": "structured_json",
        "language": "en-us",
        "summary_type": "conversation"
    }
}

response = requests.post(url, headers=headers, json=data)
print(response.json())
```

### JavaScript

```javascript
// Summarize a conversation
const response = await fetch(
  "https://api.zoom.us/v2/aiservices/summarizer/summarize",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${YOUR_JWT_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "input": { "text": "{YOUR_CONVERSATION_TRANSCRIPT}" },
      "config": {
        "task": "summary",
        "output_format": "structured_json",
        "language": "en-us",
        "summary_type": "conversation"
      }
    })
  }
);

const data = await response.json();
console.log(data);
```

## Translator

### cURL

```bash
curl -X POST \
  https://api.zoom.us/v2/aiservices/translator/translate \
  -H "Authorization: Bearer $YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "{YOUR_TEXT}",
    "config": {
      "source_language": "en-US",
      "target_languages": ["es-ES"]
    }
  }'
```

### Python

```python
import requests

# Translate text
url = "https://api.zoom.us/v2/aiservices/translator/translate"
headers = {
    "Authorization": f"Bearer {YOUR_JWT_TOKEN}",
    "Content-Type": "application/json"
}
data = {
    "text": "{YOUR_TEXT}",
    "config": {
        "source_language": "en-US",
        "target_languages": ["es-ES"]
    }
}

response = requests.post(url, headers=headers, json=data)
print(response.json())
```

### JavaScript

```javascript
// Translate text
const response = await fetch(
  "https://api.zoom.us/v2/aiservices/translator/translate",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${YOUR_JWT_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "text": "{YOUR_TEXT}",
      "config": {
        "source_language": "en-US",
        "target_languages": ["es-ES"]
      }
    })
  }
);

const data = await response.json();
console.log(data);
```
