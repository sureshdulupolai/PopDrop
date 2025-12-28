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


def main(request):
    res = API.call_api(request['path'], user=request['user'])
    if not res.get("success"):
        API.PageNotFound(message=res.get("error"), code=res.get("status_code"), home="https://google.com")
        return

    data = API.speed()
    print(data)
    
    print("-" * 100)
    print(API.schema_generate(data)) # check tha schema here, format work when its already deformate, like speed(formats=false)

# ---------------- RUN ----------------
if __name__ == "__main__":
    main(
        request={
            "path": "https://jsonplaceholder.typicode.com/users",
            "user": "developer"
        }
    )

    # main(
    #     request={
    #         "path": "https://dummyjson.com/products",
    #         "user": "developer"
    #     }
    # )
    