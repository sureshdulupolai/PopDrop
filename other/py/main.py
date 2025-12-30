from APISecurity import APIManagement
from listED import ENDPOINTS

API = APIManagement(
    ePoint=ENDPOINTS,
    user_id=None
    # user_id="user1011"
)

def APICall(request, user: str = "user"):
    res = API.call_api(request, user=user)
    if not res.get("success"):
        API.PageNotFound(message=res.get("error"), code=res.get("status_code"), home="https://google.com")
        return
    return res

def main(request, user: str = "user"):
    data = APICall(request=request, user=user)
    print(data)
    print(API.schema_generate(data))
    # data = API.speed()
    # print(data)
    # print(API.schema_generate(data)) # check tha schema here, format work when its already deformate, like speed(formats=false)

# ---------------- RUN ----------------
if __name__ == "__main__":

    lst = [("https://dummyjson.com/productsss", None), ("https://jsonplaceholder.typicode.com/usersss", None)]
    for i in lst:
        # print(i[0], i[1])
        main(request=i[0], user=i[1])
        print()
        print("-" * 100)
    