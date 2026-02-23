"""
User and Vault models for MongoDB.
"""
from pymongo.collection import Collection
from pymongo.errors import OperationFailure
from gridfs import GridFS
from datetime import datetime
from typing import Optional
from app.database import get_database


def get_users_collection() -> Collection:
    """Get users collection."""
    return get_database()["users"]


def get_vault_collection() -> Collection:
    """Get vault collection for metadata."""
    return get_database()["vault"]


def get_gridfs() -> GridFS:
    """Get GridFS instance for storing large files."""
    return GridFS(get_database())


class UserModel:
    """User model operations."""
    
    @staticmethod
    def find_by_email(email: str) -> Optional[dict]:
        """Find user by email."""
        try:
            return get_users_collection().find_one({"email": email})
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def create_user(email: str, name: str) -> dict:
        """Create a new user."""
        try:
            user = {
                "email": email,
                "name": name,
                "created_at": datetime.utcnow(),
                "pin_set": False
            }
            result = get_users_collection().insert_one(user)
            user["_id"] = result.inserted_id
            return user
        except Exception as e:
            raise Exception(f"Database error: {str(e)}")
    
    @staticmethod
    def set_pin_sentinel(email: str, encrypted_sentinel: str):
        """Set PIN sentinel for user."""
        get_users_collection().update_one(
            {"email": email},
            {
                "$set": {
                    "pin_sentinel": encrypted_sentinel,
                    "pin_set": True,
                    "pin_set_at": datetime.utcnow()
                }
            }
        )
    
    @staticmethod
    def get_pin_sentinel(email: str) -> Optional[str]:
        """Get PIN sentinel for user."""
        user = get_users_collection().find_one(
            {"email": email},
            {"pin_sentinel": 1}
        )
        return user.get("pin_sentinel") if user else None
    
    @staticmethod
    def is_pin_set(email: str) -> bool:
        """Check if PIN is set for user."""
        user = get_users_collection().find_one(
            {"email": email},
            {"pin_set": 1}
        )
        return user.get("pin_set", False) if user else False


class VaultModel:
    """Vault model operations using GridFS for large files."""
    
    @staticmethod
    def save_report(email: str, filename: str, encrypted_content: str) -> str:
        """Save encrypted report to vault using GridFS."""
        try:
            fs = get_gridfs()
            
            # Store encrypted content in GridFS
            grid_file_id = fs.put(
                encrypted_content.encode('utf-8'),
                filename=filename,
                owner_email=email,
                upload_date=datetime.utcnow()
            )
            
            # Store metadata in regular collection
            metadata = {
                "gridfs_id": grid_file_id,
                "owner_email": email,
                "filename": filename,
                "created_at": datetime.utcnow()
            }
            result = get_vault_collection().insert_one(metadata)
            
            # Return the metadata ID (not GridFS ID) for consistency
            return str(result.inserted_id)
        except Exception as e:
            raise Exception(f"Database error saving report: {str(e)}")
    
    @staticmethod
    def list_user_reports(email: str) -> list:
        """List all reports for a user."""
        try:
            reports = get_vault_collection().find(
                {"owner_email": email},
                {"filename": 1, "created_at": 1, "_id": 1, "gridfs_id": 1}
            ).sort("created_at", -1)
            return list(reports)
        except Exception as e:
            raise Exception(f"Database error listing reports: {str(e)}")
    
    @staticmethod
    def get_report(report_id: str, email: str) -> Optional[dict]:
        """Get a specific report by ID."""
        from bson import ObjectId
        try:
            # Get metadata
            metadata = get_vault_collection().find_one({
                "_id": ObjectId(report_id),
                "owner_email": email
            })
            
            if not metadata:
                return None
            
            # Get encrypted content from GridFS
            fs = get_gridfs()
            grid_file = fs.get(metadata["gridfs_id"])
            encrypted_content = grid_file.read().decode('utf-8')
            
            return {
                "id": str(metadata["_id"]),
                "encrypted_content": encrypted_content,
                "filename": metadata["filename"]
            }
        except Exception as e:
            raise Exception(f"Database error retrieving report: {str(e)}")

