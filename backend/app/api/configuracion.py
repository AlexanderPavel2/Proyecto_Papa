from fastapi import APIRouter
from app.services.configuracion_service import ConfiguracionService

router = APIRouter()

servicio = ConfiguracionService()


@router.get("/ultima-actualizacion")
def obtener_ultima_actualizacion():

    return servicio.obtener_ultima_actualizacion()