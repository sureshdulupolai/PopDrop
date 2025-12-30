import os
import json
import time
from datetime import datetime
from urllib.parse import urlparse


class APIBehaviorProfiler:
    def __init__(self, file_path="json/api_behavior.json"):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.FILE = os.path.join(base_dir, file_path)

        os.makedirs(os.path.dirname(self.FILE), exist_ok=True)

        self.data = {}
        self.last_result = None
        self._load()

    def _load(self):
        if os.path.exists(self.FILE):
            with open(self.FILE, "r") as f:
                self.data = json.load(f)
        else:
            self.data = {}

    def _save(self):
        with open(self.FILE, "w") as f:
            json.dump(self.data, f, indent=4)

    def _normalize_url(self, url):
        if not url.startswith(("http://", "https://")):
            url = "http://" + url
        p = urlparse(url)
        return f"{p.netloc}{p.path}".lower()

    def _format_time(self, ms):
        if ms < 1000:
            return f"{round(ms)} ms"
        elif ms < 60000:
            return f"{round(ms / 1000, 2)} sec"
        return f"{round(ms / 60000, 2)} min"

    def _classify_speed(self, ms):
        if ms < 500:
            return "FAST", "✅ Fast response"
        elif ms < 1200:
            return "NORMAL", "🟡 Moderate response"
        elif ms < 3000:
            return "SLOW", "⚠ Slow response"
        return "VERY_SLOW", "🚨 Very slow response"

    def track(self, url, response_time_ms):
        url = self._normalize_url(url)

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

        if status in ("SLOW", "VERY_SLOW"):
            record["alerts"].append({
                "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "message": f"{msg} ({round(response_time_ms)} ms)"
            })
            record["alerts"] = record["alerts"][-20:]

        self.data[url] = record
        self._save()

        self.last_result = {
            "url": url,
            "response_time": self._format_time(response_time_ms),
            "status": status,
            "message": msg
        }

        return self.last_result


# ============================
# 🔥 MAIN TEST BLOCK
# ============================
if __name__ == "__main__":
    profiler = APIBehaviorProfiler()

    print("TEST 1:", profiler.track("api/test", 120))
    print("TEST 2:", profiler.track("api/test", 850))
    print("TEST 3:", profiler.track("api/test", 2500))
    print("TEST 4:", profiler.track("api/test", 4100))
