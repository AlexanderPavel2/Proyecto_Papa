from fastapi import APIRouter

from app.ia.prediccion import predecir_precio


router = APIRouter()


@router.get("/prediccion")
def obtener_prediccion():
    """
    Endpoint para obtener la predicción del precio
    de la papa para la siguiente semana.
    """

    resultado = predecir_precio()

    return resultado