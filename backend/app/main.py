from fastapi import FastAPI
from app.api.precios import router as precios_router
from app.api.auth import router as auth_router
from app.api.importador import router as importador_router
from app.api.configuracion import router as configuracion_router
from app.api.estadisticas import router as estadisticas_router
from app.api.historial import router as historial_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Sistema de Información del Precio de la Papa",
    description="API para consulta y administración de precios de papa.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(precios_router)

app.include_router(auth_router)

app.include_router(importador_router)

app.include_router(configuracion_router)

app.include_router(estadisticas_router)

app.include_router(historial_router)

@app.get("/")
def inicio():
    return {
        "mensaje": "Bienvenido al Sistema de Información del Precio de la Papa"
    }