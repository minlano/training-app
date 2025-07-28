# FastAPI 백엔드 진입점
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.ai_routes import router as ai_router

app = FastAPI(title="Workout Tracker API", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5175"],  # React 개발 서버
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(ai_router)

@app.get("/")
async def root():
    return {"message": "Workout Tracker API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/health")
async def api_health_check():
    return {"status": "healthy", "message": "API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)