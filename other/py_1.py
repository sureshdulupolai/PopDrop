import requests
from datetime import date

# https://ipapi.co/json/
# user = data["results"][0]

class OtherManagement:
    def todaydate():
        return date.today().strftime("%Y-%m-%d")

class APIManagement(OtherManagement):
    BlockCount = 0

    def __init__(self, Log: list, PrivateCode: list | None = None,LimitSet: bool = True, BlockOn: int = 3):
        self.Log = Log
        self.LogCount = [0 for _ in self.Log]
        self.OtherCount = {"2025-12-19": 5, "2025-12-20": 10}
        self.LS = LimitSet

        if self.LS:
            self.SetBlock = BlockOn
            self.Pc = PrivateCode or []

        def _get(self, url: str, Login: str):
            if Login in self.Log:
                return requests.get(url).json()

            if not self.LS:
                return requests.get(url).json()

            if APIManagement.BlockCount < self.SetBlock:
                td = OtherManagement.todaydate()
                self.OtherCount[td] = self.OtherCount.get(td, 0) + 1
                APIManagement.BlockCount += 1
                return {"details": "Hiting Api Not Allowed"}

            return {"details": "Set TimeOut Block For EveryOne"}

        def _unblock(self, code: str | None = None, reset: int | None = None):
            if not self.LS:
                return {"details": "Unblock feature disabled"}

            if code is None or code not in self.Pc:
                return {"details": "Can't Access, Auth is Missing"}

            if reset is not None:
                self.SetBlock = reset
                APIManagement.BlockCount = 0
                return {"details": f"Successfully Reset API Limit to {reset}"}

            if APIManagement.BlockCount >= self.SetBlock:
                APIManagement.BlockCount = 0
                return {"details": "Successfully UnBlocked API Again"}
            else:
                return {"details": f"Already Unblocked, {self.SetBlock - APIManagement.BlockCount} hits left"}

API = APIManagement(Log=['Admin', 'Developer'], PrivateCode=["101", "102"])
url = "https://randomuser.me/api/?results=5"
get_data = API._get(url, Login="User")
print(get_data)
print(API.OtherCount)

print("2.")
get_data = API._get(url, Login="User")
print(get_data)
print(API.OtherCount)

print("3.")
get_data = API._get(url, Login="User")
print(get_data)
print(API.OtherCount)

print("4.")
get_data = API._get(url, Login="User")
print(get_data)
print(API.OtherCount)

print("5.")
print(API._unblock(code="101"))
print(API._unblock(code="101", reset=5))
print(API._unblock(code="101"))