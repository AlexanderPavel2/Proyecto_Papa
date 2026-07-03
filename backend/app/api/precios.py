from fastapi import APIRouter
from app.services.precio_service import PrecioService

router = APIRouter()

servicio = PrecioService()


@router.get("/precios")
def obtener_precios():

    return servicio.obtener_precios()