import requests
import json
import os
import time
import webbrowser
from datetime import datetime
from schema import SchemaGenerator
from APIBehavior import APIBehaviorProfiler
from Detector import AnomalyDetector
from endpoints import EndPoint

# ================= HISTORY MANAGER =================
class HistoryManager:
    def __init__(self, db_file=None):
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        json_folder = os.path.join(BASE_DIR, "json")
        os.makedirs(json_folder, exist_ok=True)  # Ensure folder exists

        self.FILE = db_file or os.path.join(json_folder, "api_history.json")
        
        self.data = {"index": -1, "history": []}
        self._load()

    def _load(self):
        if os.path.exists(self.FILE):
            with open(self.FILE, "r") as f:
                self.data = json.load(f)

    def _save(self):
        with open(self.FILE, "w") as f:
            json.dump(self.data, f, indent=4)

    def add(self, url):
        if self.data["index"] < len(self.data["history"]) - 1:
            self.data["history"] = self.data["history"][: self.data["index"] + 1]

        self.data["history"].append({
            "url": url,
            "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
        self.data["index"] += 1
        self._save()

    def back(self):
        if self.data["index"] > 0:
            self.data["index"] -= 1
        self._save()
        return self.current()

    def next(self):
        if self.data["index"] < len(self.data["history"]) - 1:
            self.data["index"] += 1
        self._save()
        return self.current()

    def current(self):
        if self.data["index"] == -1:
            return None
        return self.data["history"][self.data["index"]]["url"]

# ================= API MANAGEMENT =================
DEFAULT_USER_ID = "__anonymous__"

class APIManagement:
    def __init__(self, user_id = None, ePoint = []):
        self.EndPoint = EndPoint(EndList=ePoint, user_id=user_id if user_id else DEFAULT_USER_ID)
        self.history = HistoryManager()
        self.profiler = APIBehaviorProfiler()
        self.anomaly = AnomalyDetector()
        self.UserTrack = {}

    def _track_user(self, username):
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        if username not in self.UserTrack:
            self.UserTrack[username] = {"count": 1, "last_seen": now}
        else:
            self.UserTrack[username]["count"] += 1
            self.UserTrack[username]["last_seen"] = now

    def call_api(self, url, user="Guest"):
        if self.EndPoint.ePoint(url):

            # 🚫 Block check
            if self.anomaly.is_blocked(user):
                return {"success": False,"status_code": 429,"error": "User temporarily blocked due to suspicious activity"}

            # Rate limit check
            if not self.anomaly.register_request(user):
                return {"success": False,"status_code": 429,"error": "Too many requests"}

            start = time.time()

            try:
                res = requests.get(url, timeout=10)
                res.raise_for_status()

                elapsed = round((time.time() - start) * 1000, 2)
                self._last_speed = self.profiler.track(url, elapsed)
                self.history.add(url)

                return {"success": True,"status_code": res.status_code,"data": res.json()}

            except Exception as e:
                self.anomaly.register_failure(user)

                return {"success": False,"status_code": getattr(e.response, "status_code", 500),"error": str(e)}

        return {"success": False, "status_code": 404, "error": "Invalid endpoint"}

    def speed(self, formate=False):
        if not self._last_speed:
            return {
                "error": "No API call made yet"
            }
        elif formate == True:
            return json.dumps(self._last_speed, indent=2, ensure_ascii=False)
        return self._last_speed

    # Status helper
    def status(self, res: dict, code: bool = True):
        status_map = {
            200: "SUCCESS",
            429: "FAILED",
            401: "AUTH_ERROR",
            400: "BAD_REQUEST"
        }
        if code:
            return res.get("status_code")
        return status_map.get(res.get("status_code"), "UNKNOWN")

    # Navigation
    def back(self):
        return self.history.back()

    def next(self):
        return self.history.next()

    # Page Not Found Handler
    def PageNotFound(self, message="Something went wrong", code=404, home="/"):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        template_path = os.path.join(base_dir, "pnt.html")

        if not os.path.exists(template_path):
            raise FileNotFoundError("pnt.html file not found in same directory")

        with open(template_path, "r", encoding="utf-8") as f:
            html = f.read()

        html = html.replace("{{CODE}}", str(code))
        html = html.replace("{{MESSAGE}}", message)
        html = html.replace("{{HOME}}", home)

        output_file = os.path.join(base_dir, "error_page.html")
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(html)
        webbrowser.open("file://" + os.path.abspath(output_file))

    def schema_generate(self, data):
        generator = SchemaGenerator()
        return generator.generate(data)

# ---------------- MAIN FUNCTION ----------------
# API = APIManagement()

# def main(request):
#     path = request.get("path")
#     user = request.get("user", "Guest")

#     # API Call
#     res = API.call_api(path, user=user)

#     # ERROR HANDLING
#     if not res.get("success"):
#         API.PageNotFound(message=res.get("error"), code=res.get("status_code"), home="https://google.com")
#         return

#     print("✅ API Call Successful")
#     print("URL:", res.get("url"))
#     print("DATA:", res.get("data"))
#     print("Status:", API.status(res, code=False))


# ---------------- RUN ----------------
# if __name__ == "__main__":
#     main(
#         request={
#             "path": "https://sresh",   # wrong url → will trigger error page
#             "user": "developer"
#         }
#     )
