import os
import json
import time
from datetime import datetime
from urllib.parse import urlparse


# ------------------ URL NORMALIZER ------------------
def extract_path(url: str) -> str:
    if not url.startswith(("http://", "https://")):
        url = "http://" + url

    parsed = urlparse(url)
    if parsed.netloc:
        return f"{parsed.netloc}{parsed.path}".lower()
    return parsed.path.lower()

# ------------------ MAIN CLASS ------------------
class EndPoint:
    def __init__(self, EndList, Check=True, user_id=None, db_file=None):
        self.allowed = [x.lower() for x in EndList]
        self.check = Check
        self.user_id = user_id or "__anonymous__"

        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        self.db_file = db_file or os.path.join(BASE_DIR, "json", "users.json")

        os.makedirs(os.path.dirname(self.db_file), exist_ok=True)

        if not os.path.exists(self.db_file):
            with open(self.db_file, "w") as f:
                json.dump({}, f)

    def _load_all(self):
        with open(self.db_file, "r") as f:
            return json.load(f)

    def _save_all(self, data):
        with open(self.db_file, "w") as f:
            json.dump(data, f, indent=4)

    def _today(self):
        return datetime.now().strftime("%Y-%m-%d")

    def ePoint(self, url: str):
        data = self._load_all()
        path = extract_path(url)

        # 🔐 LIMIT RULES
        if self.user_id == "__anonymous__":
            LIMIT = 3
        else:
            LIMIT = 5

        # Load user or create
        user = data.get(self.user_id, {"count": 0,"last": time.time(),"day": self._today()})

        # ✅ DAILY RESET ONLY FOR NON-ANONYMOUS USERS
        if self.user_id != "__anonymous__":
            if user["day"] != self._today():
                user["count"] = 0
                user["day"] = self._today()

        # ❌ Invalid endpoint
        if path not in self.allowed:
            user["count"] += 1
            user["last"] = time.time()

            if user["count"] > LIMIT:
                data[self.user_id] = user
                self._save_all(data)
                return False  # BLOCKED

            data[self.user_id] = user
            self._save_all(data)
            return False

        # ✅ Valid endpoint
        data[self.user_id] = user
        self._save_all(data)
        return True



# ------------------ TEST ------------------
if __name__ == "__main__":
    api_list = ["api/a1", "api/a2", "api/version"]

    ep = EndPoint(api_list, Check=True, user_id="user1003")

    print(ep.ePoint("https://api/a1"))   # ✅ True
    print(ep.ePoint("API/A1"))           # ❌ False
    print(ep.ePoint("api/wrong"))        # ❌ count++
    print(ep.ePoint("api/wrong"))        # ❌ count++
    print(ep.ePoint("api/wrong"))        # ❌ block
