import requests
from datetime import date


class OtherManagement:
    @staticmethod
    def todaydate():
        return date.today().strftime("%Y-%m-%d")

    def response(self, success, message, status_code=200, data=None):
        return {
            "success": success,
            "message": message,
            "status_code": status_code,
            "data": data
        }

class APIManagement(OtherManagement):
    BlockCount = 0

    def __init__(
        self,
        Log: list,
        PrivateCode: list | None = None,
        LimitSet: bool = True,
        BlockOn: int = 3
    ):
        self.Log = Log
        self.Pc = PrivateCode or []
        self.LS = LimitSet
        self.SetBlock = BlockOn
        self.OtherCount = {}

    def _get(self, url: str, Login: str):

        # Privileged user
        if Login in self.Log:
            data = requests.get(url).json()
            return self.response(True, "Privileged access", 200, data)

        # Limit disabled
        if not self.LS:
            data = requests.get(url).json()
            return self.response(True, "Limit disabled", 200, data)

        # Block condition
        if APIManagement.BlockCount >= self.SetBlock:
            return self.response(False, "API limit exceeded", 429)

        # Allowed hit
        today = self.todaydate()
        self.OtherCount[today] = self.OtherCount.get(today, 0) + 1
        APIManagement.BlockCount += 1

        data = requests.get(url).json()
        return self.response(True,f"Hit {APIManagement.BlockCount}/{self.SetBlock}",200,data)


    def _unblock(self, code: str | None = None, reset: int | None = None):

        if not self.LS:
            return self.response(False, "Unblock disabled", 400)

        if code not in self.Pc:
            return self.response(False, "Invalid auth code", 401)

        if reset is not None:
            self.SetBlock = reset
            APIManagement.BlockCount = 0
            return self.response(True, f"Limit reset to {reset}", 200)

        APIManagement.BlockCount = 0
        return self.response(True, "API unblocked", 200)

    def status(self, res: dict, code: bool = True):
        status_code = res.get("status_code")
        status_map = {
            200: "SUCCESS",
            429: "FAILED",
            401: "AUTH_ERROR",
            400: "BAD_REQUEST"
        }
        if code:
            return status_code
        return status_map.get(status_code, "UNKNOWN")

API = APIManagement(Log=["Admin", "Developer"],PrivateCode=["101", "102"])

def FunctionCall(request):
    res = API._get(request, Login="User")
    if API.status(res) == 200:
        data = res.get("data")
        print(data)
    else:
        print(res.get("message"))

FunctionCall(request="https://randomuser.me/api/?results=5")

# -------------------------------------------------------------------------------
# for i in range(1, 5):
#     print(f"\n{i}.")
#     res = API._get(url, Login="User")
#     print(API.status(res))
#     print(API.OtherCount)

# print("\nUNBLOCK")
# print(API.status(API._unblock(code="101")))
# print(API.status(API._unblock(code="101", reset=5)))
# print(API.status(API._unblock(code="101"), code=False))