import requests

OLLAMA_URL = "http://localhost:11434/api/generate"

def ask_tinyllama(prompt: str):
    payload = {
        "model": "tinyllama",
        "prompt": prompt,
        "stream": False
    }

    response = requests.post(OLLAMA_URL, json=payload)

    if response.status_code != 200:
        return "Error connecting to TinyLlama"

    return response.json()["response"]
