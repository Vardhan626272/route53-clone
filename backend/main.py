from contextlib import asynccontextmanager

from fastapi import FastAPI

from database import init_db
from routers import auth, dns_records, hosted_zones


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Route53 Clone API",
    description="Backend API for the AWS Route53 clone assignment",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(auth.router)
app.include_router(hosted_zones.router)
app.include_router(dns_records.router)


@app.get("/")
def health_check():
    return {"message": "Backend is running successfully"}
