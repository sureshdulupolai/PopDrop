# https://dummyjson.com/products, https://jsonplaceholder.typicode.com/users

from APISecurity import APIManagement
from listED import ENDPOINTS

API = APIManagement(ePoint=ENDPOINTS,user_id=None) # user_id="user1011"

def APICall(request, user="user"):
    res = API.call_api(request, user=user)
    return res if res.get("success") else API.PageNotFound(message=res.get("error"),code=res.get("status_code"),home="https://google.com")

def main(request, user: str = "user"):
    data = APICall(request=request, user=user)
    # print(data)
    # print(API.schema_generate(data))
    # data = API.speed()
    # print(data)
    # print(API.schema_generate(data)) # check tha schema here, format work when its already deformate, like speed(formats=false)

# ---------------- RUN ----------------
if __name__ == "__main__":
    print(API.UserTrack)
    main(request="https://dummyjson.com/products", user="developer")
    print(API.UserTrack)