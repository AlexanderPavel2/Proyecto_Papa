import sqlite3
from pathlib import Path

# Ruta de la base de datos
BASE_DIR = Path(__file__).resolve().parent
ruta_bd = BASE_DIR.parent / "data" / "sqlite" / "precios_papa.db"

# Conexión
conexion = sqlite3.connect(ruta_bd)

cursor = conexion.cursor()

# Mostrar todas las tablas
cursor.execute("""
SELECT name
FROM sqlite_master
WHERE type='table';
""")

tablas = cursor.fetchall()

print("Tablas encontradas:\n")

for tabla in tablas:
    print(tabla[0])

conexion.close()