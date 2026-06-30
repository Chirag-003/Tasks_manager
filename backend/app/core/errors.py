from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException


# ✅ Handle normal Python exceptions
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "Something went wrong",
            "error": str(exc),  # Optional (remove in prod later)
        },
    )


# ✅ Handle FastAPI HTTP exceptions
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
        },
    )
