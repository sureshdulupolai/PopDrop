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
from history import HistoryManager

DEFAULT_USER_ID = "__anonymous__"
USER_TRACK_FILE = "json/user_track.json"

class APIManagement:
    def __init__(self, user_id = None, ePoint = []):
        self.EndPoint = EndPoint(EndList=ePoint, user_id=user_id if user_id else DEFAULT_USER_ID)
        self.history = HistoryManager()
        self.profiler = APIBehaviorProfiler()
        self.anomaly = AnomalyDetector()
        self.user_file = "json/user_track.json"
        os.makedirs(os.path.dirname(self.user_file), exist_ok=True)

        if not os.path.exists(self.user_file):
            with open(self.user_file, "w") as f:
                json.dump({}, f)

        self.UserTrack = self._load_users()

    def _load_users(self):
        with open(self.user_file, "r") as f:
            return json.load(f)

    def _save_users(self):
        with open(self.user_file, "w") as f:
            json.dump(self.UserTrack, f, indent=4)

    def _track_user(self, username):
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if username not in self.UserTrack:
            self.UserTrack[username] = {
                "count": 1,
                "last_seen": now
            }
        else:
            self.UserTrack[username]["count"] += 1
            self.UserTrack[username]["last_seen"] = now

        self._save_users()


    def call_api(self, url, user="Guest"):
        self._track_user(username=user)
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
            return {"error": "No API call made yet"}
        elif formate == True:
            return json.dumps(self._last_speed, indent=2, ensure_ascii=False)
        return self._last_speed

    # Status helper
    def status(self, res: dict, code: bool = True):
        status_map = {200: "SUCCESS",429: "FAILED",401: "AUTH_ERROR",400: "BAD_REQUEST"}
        if code:
            return res.get("status_code")
        return status_map.get(res.get("status_code"), "UNKNOWN")

    # Navigation
    def backward(self):
        return self.history.back()

    def forward(self):
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
