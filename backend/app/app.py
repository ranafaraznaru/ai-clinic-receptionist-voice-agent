from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.app_config import settings
from app.routing.v1.endpoints import appointments

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(appointments.router, prefix=f"{settings.API_V1_STR}/appointments", tags=["Appointments"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
