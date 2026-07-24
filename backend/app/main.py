from app.api.v1.router import router as v1_router
from app.core.errors import global_exception_handler, http_exception_handler
from fastapi import FastAPI
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Task Management API", version="1.0.0")


app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "API is running"}


app.include_router(
    v1_router,
    prefix="/api/v1",
)
