def user_serializer(user) -> dict:
    return {
        "_id": str(user["_id"]),
        "username": str(user["username"]),
        "password": str(user["password"])
    }


def users_serializer(users) -> list:
    return [user_serializer(user) for user in users]
