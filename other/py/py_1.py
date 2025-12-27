import requests
import json
import os
import webbrowser
from datetime import datetime
from schema import SchemaGenerator

# ================= HISTORY MANAGER =================
class HistoryManager:
    FILE = "api_history.json"

    def __init__(self):
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
class APIManagement:

    def __init__(self):
        self.history = HistoryManager()
        self.UserTrack = {}

    def _track_user(self, username):
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        if username not in self.UserTrack:
            self.UserTrack[username] = {"count": 1, "last_seen": now}
        else:
            self.UserTrack[username]["count"] += 1
            self.UserTrack[username]["last_seen"] = now

    def call_api(self, url, user="Guest"):
        self._track_user(user)

        try:
            res = requests.get(url, timeout=10)
            res.raise_for_status()

            self.history.add(url)

            return {
                "success": True,
                "url": url,
                "status_code": res.status_code,
                "data": res.json() if "application/json" in res.headers.get("Content-Type", "") else None,
                "message": "API Call Successful",
                "error": None
            }

        except Exception as e:
            status_code = getattr(e.response, "status_code", 500) if hasattr(e, "response") else 500
            return {
                "success": False,
                "url": url,
                "status_code": status_code,
                "data": None,
                "message": str(e),
                "error": str(e)
            }

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
