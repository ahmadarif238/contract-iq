import requests
import json

try:
    response = requests.get("http://localhost:8000/api/v1/contracts/3")
    print("Status Code:", response.status_code)
    data = response.json()
    print(json.dumps(data, indent=2))
except Exception as e:
    print(e)
