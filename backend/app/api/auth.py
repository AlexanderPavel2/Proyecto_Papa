from fastapi import APIRouter
from pydantic import BaseModel

from app.services.auth_service import AuthService

router = APIRouter()

servicio = AuthService()


class LoginRequest(BaseModel):
    usuario: str
    contraseña: str


@router.post("/login")
def login(datos: LoginRequest):

    return servicio.iniciar_sesion(
        datos.usuario,
        datos.contraseña
    )