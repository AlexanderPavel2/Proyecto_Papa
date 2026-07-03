from fastapi import APIRouter

from app.services.historial_service import HistorialService

router = APIRouter()

servicio = HistorialService()


@router.get("/historial")
def obtener_historial():

    return servicio.obtener_historial()