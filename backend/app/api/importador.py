from fastapi import APIRouter, UploadFile, File
import pandas as pd
import tempfile
import os

from app.database.importador import ImportadorExcel

router = APIRouter()


@router.post("/importar-excel")
async def importar_excel(archivo: UploadFile = File(...)):

    # Verificar extensión
    if not archivo.filename.endswith(".xlsx"):
        return {
            "success": False,
            "mensaje": "Solo se permiten archivos Excel (.xlsx)."
        }

    # Guardar temporalmente el archivo
    with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as temp:
        contenido = await archivo.read()
        temp.write(contenido)
        ruta_temporal = temp.name

    # Leer el Excel
    df = pd.read_excel(ruta_temporal)

    # Eliminar archivo temporal
    os.remove(ruta_temporal)

    # Importar registros
    importador = ImportadorExcel()

    nuevos, existentes = importador.insertar_registros(df)

    fecha = importador.actualizar_fecha()

    total = importador.contar_registros_bd()

    importador.cerrar_conexion()

    return {
        "success": True,
        "filas_excel": len(df),
        "registros_nuevos": nuevos,
        "registros_existentes": existentes,
        "total_bd": total,
        "ultima_actualizacion": fecha
    }