from pathlib import Path
import pandas as pd
from datetime import datetime

from app.database.conexion import obtener_conexion


class ImportadorExcel:

    COLUMNAS_ESPERADAS = [
        "Región",
        "Provincia",
        "Producto",
        "Fecha",
        "precio promedio en chacra S/ / kg"
    ]

    def __init__(self):

        self.base_dir = Path(__file__).resolve().parents[2]

        self.ruta_excel = (
            self.base_dir /
            "data" /
            "excel" /
            "precios_papa.xlsx"
        )

        self.conexion = obtener_conexion()
        self.cursor = self.conexion.cursor()

    def actualizar_fecha(self):

        fecha = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        self.cursor.execute("""
            UPDATE configuracion
            SET ultima_actualizacion = ?
            WHERE id_config = 1
        """, (fecha,))

        self.conexion.commit()

        return fecha

    def leer_excel(self):

        if not self.ruta_excel.exists():
            raise FileNotFoundError(
                f"No existe el archivo:\n{self.ruta_excel}"
            )

        df = pd.read_excel(self.ruta_excel)

        columnas = list(df.columns)

        if columnas != self.COLUMNAS_ESPERADAS:
            raise ValueError(
                "Las columnas del Excel no son correctas."
            )

        return df

    def contar_registros_bd(self):

        self.cursor.execute("""
            SELECT COUNT(*)
            FROM precio_chacra
        """)

        return self.cursor.fetchone()[0]
    
    def insertar_registros(self, df):

        nuevos = 0
        existentes = 0

        for _, fila in df.iterrows():

            self.cursor.execute("""
                INSERT OR IGNORE INTO precio_chacra
                (
                    region,
                    provincia,
                    producto,
                    fecha,
                    precio_promedio
                )
                VALUES (?, ?, ?, ?, ?)
            """, (
                fila["Región"],
                fila["Provincia"],
                fila["Producto"],
                fila["Fecha"].strftime("%Y-%m-%d"),
                float(fila["precio promedio en chacra S/ / kg"])
            ))

            if self.cursor.rowcount == 1:
                nuevos += 1
            else:
                existentes += 1

        self.conexion.commit()

        return nuevos, existentes

    def cerrar_conexion(self):
        self.conexion.close()


# ==========================
# Programa principal
# ==========================

def main():

    importador = ImportadorExcel()

    df = importador.leer_excel()

    antes = importador.contar_registros_bd()

    nuevos, existentes = importador.insertar_registros(df)

    fecha = importador.actualizar_fecha()

    despues = importador.contar_registros_bd()

    print("=" * 50)
    print("IMPORTACIÓN FINALIZADA")
    print("=" * 50)

    print(f"Filas leídas           : {len(df)}")
    print(f"Registros nuevos       : {nuevos}")
    print(f"Registros existentes   : {existentes}")
    print(f"Total en SQLite        : {despues}")
    print(f"Última actualización   : {fecha}")

    importador.cerrar_conexion()


if __name__ == "__main__":
    main()