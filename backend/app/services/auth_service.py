from app.database.conexion import obtener_conexion


class AuthService:

    def iniciar_sesion(self, usuario, contraseña):

        conexion = obtener_conexion()
        cursor = conexion.cursor()

        cursor.execute("""
            SELECT
                id_admin,
                nombre,
                usuario
            FROM administrador
            WHERE usuario = ?
            AND contraseña = ?
        """, (usuario, contraseña))

        administrador = cursor.fetchone()

        conexion.close()

        if administrador:
            return {
                "success": True,
                "administrador": dict(administrador)
            }

        return {
            "success": False,
            "mensaje": "Usuario o contraseña incorrectos."
        }