from fastapi import APIRouter, UploadFile, File
import pandas as pd
import tempfile
import os

from app.database.importador import ImportadorExcel
from app.ia.entrenamiento import entrenar_y_guardar_modelo


router = APIRouter()


@router.post("/importar-excel")
async def importar_excel(archivo: UploadFile = File(...)):

    if not archivo.filename.endswith(".xlsx"):
        return {
            "success": False,
            "mensaje": "Solo se permiten archivos Excel (.xlsx)."
        }

    with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as temp:
        contenido = await archivo.read()
        temp.write(contenido)
        ruta_temporal = temp.name

    df = pd.read_excel(ruta_temporal)

    os.remove(ruta_temporal)

    importador = ImportadorExcel()

    nuevos, existentes = importador.insertar_registros(df)

    fecha = importador.actualizar_fecha()

    total = importador.contar_registros_bd()

    importador.cerrar_conexion()

    resultado_modelo = entrenar_y_guardar_modelo()

    return {
        "success": True,
        "filas_excel": len(df),
        "registros_nuevos": nuevos,
        "registros_existentes": existentes,
        "total_bd": total,
        "ultima_actualizacion": fecha,
        "modelo_actualizado": True,
        "metricas_modelo": {
            "mae": resultado_modelo["mae"],
            "rmse": resultado_modelo["rmse"],
            "r2": resultado_modelo["r2"]
        }
    }