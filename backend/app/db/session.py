from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings  # ✅ import settings

# ✅ use DATABASE_URL from config
engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# ✅ dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
