from APISecurity import APIManagement

API = APIManagement()

# def main(request):
#     # path = "https://uselessfacts.jsph.pl/random.json?language=en"
#     path="https://sresh"
#     res = API.call_api(path, user=request['user'])
#     if res.get('status') != 200 and res.get('success') != True:
#         API.PageNotFound()

#         print(res)

# main(
#     request={
#         "path" : "localhost:8000",
#         "user" : "developer"
#     }
# )

# # main(
# #     request={
# #         "path" : "localhost:8000",
# #         "user" : "user"
# #     }
# # )

# # main(
# #     request={
# #         "path" : "localhost:8000",
# #         "user" : "developer"
# #     }
# # )


def APICall(request, user: str = "user"):
    res = API.call_api(request, user=user)
    if not res.get("success"):
        API.PageNotFound(message=res.get("error"), code=res.get("status_code"), home="https://google.com")
        return
    return res

def main(request, user: str = "user"):
    data = APICall(request=request, user=user)['data']
    print(API.schema_generate(data))
    # data = API.speed()
    # print(data)
    # print(API.schema_generate(data)) # check tha schema here, format work when its already deformate, like speed(formats=false)

# ---------------- RUN ----------------
if __name__ == "__main__":
    # main(
    #     request={
    #         "path":,
    #         "user": "developer"
    #     }
    # )

    lst = [("https://dummyjson.com/products", None), ("https://jsonplaceholder.typicode.com/users", None)]
    for i in lst:
        # print(i[0], i[1])
        main(request=i[0], user=i[1])
        print()
        print("-" * 100)
    