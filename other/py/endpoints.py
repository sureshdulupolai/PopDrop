from urllib.parse import urlparse

def extract_path(url: str):
    # agar protocol nahi diya ho to add karo
    if not url.startswith(("http://", "https://")):
        url = "http://" + url

    parsed = urlparse(url)

    # remove starting slash
    path = parsed.path.lstrip("/")

    return path

class EndPoint:
    def __init__(self, EndList, Check: bool = False):
        self.EL = EndList
        self.Ck = Check

    def ePoint(self, data):
        if self.Ck:
            nd = extract_path(url=data)
            print(nd)
        return {
            "success": False,"status_code": 429,"error": "Use"
        }

api_list = [
    "api/a1",
    "api/a2",
    "api/version"
]
Ed = EndPoint(EndList=api_list, Check=True)
Ed.ePoint("https://api/a1")