import json
import os
from datetime import datetime

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