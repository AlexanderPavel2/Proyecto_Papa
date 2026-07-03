from app.database.conexion import obtener_conexion


class ConfiguracionService:

    def obtener_ultima_actualizacion(self):

        conexion = obtener_conexion()
        cursor = conexion.cursor()

        cursor.execute("""
            SELECT ultima_actualizacion
            FROM configuracion
            WHERE id_config = 1
        """)

        resultado = cursor.fetchone()

        conexion.close()

        if resultado:
            return {
                "ultima_actualizacion": resultado["ultima_actualizacion"]
            }

        return {
            "ultima_actualizacion": None
        }