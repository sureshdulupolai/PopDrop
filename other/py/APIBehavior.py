import json
import os
import time
from datetime import datetime

class APIBehaviorProfiler:
    FILE = "api_behavior.json"

    def __init__(self):
        self.data = {}
        self.last_result = None
        self._load()

    def _load(self):
        if os.path.exists(self.FILE):
            with open(self.FILE, "r") as f:
                self.data = json.load(f)

    def _save(self):
        with open(self.FILE, "w") as f:
            json.dump(self.data, f, indent=4)

    def _format_time(self, ms):
        if ms < 1000:
            return f"{round(ms)} ms"
        elif ms < 60000:
            return f"{round(ms / 1000, 2)} sec"
        else:
            return f"{round(ms / 60000, 2)} min"

    def _classify_speed(self, ms):
        if ms < 500:
            return "FAST", "✅ Fast response"
        elif ms < 1200:
            return "NORMAL", "🟡 Moderate response"
        elif ms < 3000:
            return "SLOW", "⚠ Slow response"
        else:
            return "VERY_SLOW", "🚨 Very slow response"

    def track(self, url, response_time_ms):
        record = self.data.get(url, {
            "count": 0,
            "avg_time": 0,
            "last_time": 0,
            "alerts": []
        })

        record["count"] += 1
        record["last_time"] = response_time_ms

        record["avg_time"] = round(
            ((record["avg_time"] * (record["count"] - 1)) + response_time_ms)
            / record["count"], 2
        )

        status, msg = self._classify_speed(response_time_ms)

        if status in ["SLOW", "VERY_SLOW"]:
            record["alerts"].append({
                "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "message": f"{msg} ({round(response_time_ms)} ms)"
            })

        self.data[url] = record
        self._save()

        self.last_result = {
            "response_time": self._format_time(response_time_ms),
            "behavior": {
                "count": record["count"],
                "avg_time": self._format_time(record["avg_time"]),
                "last_time": self._format_time(record["last_time"]),
                "status": status,
                "message": msg,
                "alerts": record["alerts"]
            }
        }

        return self.last_result
