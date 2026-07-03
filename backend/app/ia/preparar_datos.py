from app.database.conexion import obtener_conexion
import pandas as pd


def cargar_datos():
    """
    Carga los datos históricos de precios desde SQLite.
    """

    conexion = obtener_conexion()

    consulta = """
        SELECT
            fecha,
            precio_promedio
        FROM precio_chacra
        ORDER BY fecha ASC
    """

    datos = pd.read_sql_query(consulta, conexion)

    conexion.close()

    return datos


def preparar_datos():
    """
    Prepara los datos para el entrenamiento del modelo.
    """

    datos = cargar_datos()

    datos["fecha"] = pd.to_datetime(datos["fecha"])

    fecha_inicial = datos["fecha"].min()

    datos["dias"] = (
        datos["fecha"] - fecha_inicial
    ).dt.days

    datos = datos[
        [
            "fecha",
            "dias",
            "precio_promedio"
        ]
    ]

    return datos


def main():
    """
    Función principal para probar la preparación de datos.
    """

    datos = preparar_datos()

    print("=" * 50)
    print("DATOS PREPARADOS PARA IA")
    print("=" * 50)

    print("\nPrimeros registros:")
    print(datos.head())

    print("\nÚltimos registros:")
    print(datos.tail())

    print("\nInformación general:")
    print(datos.info())

    print("\nCantidad total de registros:")
    print(len(datos))

    print("\nFecha inicial:")
    print(datos["fecha"].min())

    print("\nFecha final:")
    print(datos["fecha"].max())


if __name__ == "__main__":
    main()