"""
MongoDB database connection and configuration.
"""
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.errors import ConnectionFailure, OperationFailure, ConfigurationError
import os

# MongoDB connection string
# Can be overridden with MONGODB_URI environment variable
MONGODB_URI = os.getenv(
    "MONGODB_URI",
    ""
)

client: MongoClient = None
db: Database = None
_db_connection_error = None


def get_database() -> Database:
    """Get MongoDB database instance."""
    global client, db, _db_connection_error
    
    if db is not None:
        return db
    
    if _db_connection_error:
        raise _db_connection_error
    
    try:
        # Test connection with serverSelectionTimeoutMS
        client = MongoClient(
            MONGODB_URI,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000
        )
        
        # Test the connection
        client.admin.command('ping')
        
        db = client.get_database("autism_screening")
        print("✓ MongoDB connection successful")
        return db
        
    except (ConnectionFailure, OperationFailure, ConfigurationError) as e:
        error_msg = f"MongoDB connection failed: {str(e)}"
        print(f"✗ {error_msg}")
        print("\nTo fix this:")
        print("1. Set MONGODB_PASSWORD environment variable with your MongoDB password")
        print("   Example: export MONGODB_PASSWORD=your_password")
        print("2. Or set MONGODB_URI environment variable with full connection string")
        print("   Example: export MONGODB_URI='mongodb+srv://admin:password@cluster0.qjd6rib.mongodb.net/?appName=Cluster0'")
        print("3. Make sure your MongoDB Atlas cluster allows connections from your IP address")
        
        _db_connection_error = Exception(error_msg)
        raise _db_connection_error
    except Exception as e:
        error_msg = f"Unexpected MongoDB error: {str(e)}"
        print(f"✗ {error_msg}")
        _db_connection_error = Exception(error_msg)
        raise _db_connection_error


def close_database():
    """Close MongoDB connection."""
    global client, db, _db_connection_error
    if client:
        try:
            client.close()
            print("✓ MongoDB connection closed")
        except:
            pass
    client = None
    db = None
    _db_connection_error = None

