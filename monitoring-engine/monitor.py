import psutil
import json

system_data = {
    "cpu": psutil.cpu_percent(interval=1),
    "ram": psutil.virtual_memory().percent,
    "disk": psutil.disk_usage('/').percent
}

print(json.dumps(system_data, indent=4))
print(psutil.cpu_count())

