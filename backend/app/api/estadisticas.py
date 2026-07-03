from fastapi import APIRouter
from app.services.estadistica_service import EstadisticaService

router = APIRouter()

servicio = EstadisticaService()


@router.get("/estadisticas")
def obtener_estadisticas():

    return servicio.obtener_estadisticas()