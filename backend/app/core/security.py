from passlib.context import CryptContext

# ✅ Configure password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ✅ Hash password (REGISTER)
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# ✅ Verify password (LOGIN)
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
