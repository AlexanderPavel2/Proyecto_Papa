from app.database.conexion import obtener_conexion


def crear_base_datos():

    conexion = obtener_conexion()
    cursor = conexion.cursor()

    # ==============================
    # Tabla de precios
    # ==============================

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS precio_chacra(

        id_precio INTEGER PRIMARY KEY AUTOINCREMENT,

        region TEXT NOT NULL,

        provincia TEXT NOT NULL,

        producto TEXT NOT NULL,

        fecha DATE NOT NULL,

        precio_promedio REAL NOT NULL,

        UNIQUE(region, provincia, producto, fecha)

    );
    """)

    # ==============================
    # Tabla administrador
    # ==============================

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS administrador(

        id_admin INTEGER PRIMARY KEY AUTOINCREMENT,

        nombre TEXT NOT NULL,

        usuario TEXT NOT NULL UNIQUE,

        contraseña TEXT NOT NULL

    );
    """)

    # ==============================
    # Tabla configuración
    # ==============================

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS configuracion(

        id_config INTEGER PRIMARY KEY AUTOINCREMENT,

        ultima_actualizacion TEXT

    );
    """)

    # ==============================
    # Administrador por defecto
    # ==============================

    cursor.execute("""
    INSERT OR IGNORE INTO administrador
    (id_admin, nombre, usuario, contraseña)

    VALUES
    (1,'Administrador','admin','admin123');
    """)

    # ==============================
    # Configuración inicial
    # ==============================

    cursor.execute("""
    INSERT OR IGNORE INTO configuracion
    (id_config, ultima_actualizacion)

    VALUES
    (1,NULL);
    """)

    conexion.commit()
    conexion.close()

    print("Base de datos creada correctamente.")


if __name__ == "__main__":
    crear_base_datos()