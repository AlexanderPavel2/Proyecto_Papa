from app.database.conexion import obtener_conexion


class EstadisticaService:

    def obtener_estadisticas(self):

        conexion = obtener_conexion()
        cursor = conexion.cursor()

        cursor.execute("""
            SELECT
                MAX(precio_promedio) AS precio_maximo,
                MIN(precio_promedio) AS precio_minimo,
                ROUND(AVG(precio_promedio), 2) AS precio_promedio
            FROM precio_chacra
        """)

        estadisticas = dict(cursor.fetchone())

        cursor.execute("""
            SELECT precio_promedio
            FROM precio_chacra
            ORDER BY fecha DESC
            LIMIT 1
        """)

        ultimo = cursor.fetchone()

        conexion.close()

        estadisticas["precio_actual"] = (
            ultimo["precio_promedio"] if ultimo else None
        )

        return estadisticas