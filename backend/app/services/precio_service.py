from app.database.conexion import obtener_conexion


class PrecioService:

    def obtener_precios(self):

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

        registros = cursor.fetchall()

        conexion.close()

        return [dict(registro) for registro in registros]