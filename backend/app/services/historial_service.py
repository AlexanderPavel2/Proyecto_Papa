from app.database.conexion import obtener_conexion


class HistorialService:

    def obtener_historial(self):

        conexion = obtener_conexion()
        cursor = conexion.cursor()

        cursor.execute("""
            SELECT
                id_precio,
                region,
                provincia,
                producto,
                fecha,
                precio_promedio
            FROM precio_chacra
            ORDER BY fecha ASC
        """)

        historial = [dict(fila) for fila in cursor.fetchall()]

        conexion.close()

        return historial