import sqlite3
from pathlib import Path


def obtener_conexion():
    """
    Retorna una conexión a la base de datos SQLite.
    """

    base_dir = Path(__file__).resolve().parents[2]

    ruta_bd = base_dir / "data" / "sqlite" / "precios_papa.db"

    conexion = sqlite3.connect(ruta_bd)

    conexion.row_factory = sqlite3.Row

    return conexion