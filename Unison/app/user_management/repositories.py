"""
User repository for the Unison.

This module provides data access operations for the User model, including
create, read, update, and delete operations, as well as additional
user-specific operations.
"""

from typing import List, Optional
from bson import ObjectId

from app.core.mongodb import users_collection
from app.user_management.models import (
    UserInDB,
    UserInDBBase
)
from app.user_management.schemas import (
    UserCreate,
    UserUpdate,
    User
)
from app.utils.datetime_utils import datetime_now
from app.utils.security_utils import get_password_hash, generate_otp_secret
from app.utils.schema_utils import convert_urls_to_str

class UserRepository:
    def __init__(self):
        self.collection = users_collection

    async def create(self, user: UserCreate) -> User:
        hashed_password = get_password_hash(user.password)
        otp_secret = generate_otp_secret()
        user = user.model_dump(exclude={"password"})
        user = convert_urls_to_str(user)
        user_in_db = UserInDBBase(**user)
        user_in_db = UserInDB(**user_in_db.model_dump(), hashed_password=hashed_password, otp_secret=otp_secret)
        result = await self.collection.insert_one(user_in_db.model_dump(by_alias=True))
        user_in_db.id = str(result.inserted_id)
        return User(**user_in_db.model_dump())

    async def find_by_email(self, email: str) -> Optional[UserInDB]:
        user = await self.collection.find_one({"email": email})
        if user:
            return UserInDB(**user)
        return None

    async def find_by_id(self, user_id: str | ObjectId) -> Optional[UserInDB]:
        user = await self.collection.find_one({"_id": ObjectId(user_id)})
        if user:
            return UserInDB(**user)
        return None

    async def update(self, user_id: str | ObjectId, user_update: UserUpdate) -> Optional[UserInDB]:
        update_data = user_update.model_dump(exclude_unset=True)
        if update_data.get("password") is not None:
            user_update["hashed_password"] = get_password_hash(update_data.password)
            user_update.pop("password")
        update_data["updated_at"] = datetime_now()

        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )

        if result.modified_count == 1:
            return await self.find_by_id(user_id)
        return None

    async def delete(self, user_id: str | ObjectId) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count == 1

    async def get_multi(self, skip: int = 0, limit: int = 100) -> List[UserInDB]:
        users = []
        cursor = self.collection.find().skip(skip).limit(limit)
        async for user in cursor:
            users.append(UserInDB(**user))
        return users
    
    async def verify(self, user_id: str | ObjectId) -> Optional[UserInDB]:
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_verified": True, "updated_at": datetime_now()}}
        )
        if result.modified_count == 1:
            return await self.find_by_id(user_id)
        return None


    async def set_user_active(self, user_id: str | ObjectId, is_active: bool) -> Optional[UserInDB]:
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_active": is_active, "updated_at": datetime_now()}}
        )
        if result.modified_count == 1:
            return await self.find_by_id(user_id)
        return None

    async def set_user_superuser(self, user_id: str | ObjectId, is_superuser: bool) -> Optional[UserInDB]:
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_superuser": is_superuser, "updated_at": datetime_now()}}
        )
        if result.modified_count == 1:
            return await self.find_by_id(user_id)
        return None

    async def update_last_login(self, user_id: str | ObjectId) -> Optional[ObjectId]:
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"last_login": datetime_now()}}
        )
        if result.modified_count == 1:
            return await self.find_by_id(user_id)
        return None

    async def update_password(self, user_id: str | ObjectId, new_password: str) -> Optional[UserInDB]:
        hashed_password = get_password_hash(new_password)
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"hashed_password": hashed_password, "updated_at": datetime_now()}}
        )
        if result.modified_count == 1:
            return await self.find_by_id(user_id)
        return None

    async def update_otp_secret(self, user_id: str | ObjectId, otp_secret: str) -> Optional[UserInDB]:
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"otp_secret": otp_secret, "updated_at": datetime_now()}}
        )
        if result.modified_count == 1:
            return await self.find_by_id(user_id)
        return None

user_repository = UserRepository()