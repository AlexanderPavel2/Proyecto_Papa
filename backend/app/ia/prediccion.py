from pathlib import Path

import joblib
import pandas as pd

from app.ia.preparar_datos import preparar_datos


def cargar_modelo():
    """
    Carga el modelo entrenado desde la carpeta models.
    """

    ruta_backend = Path(__file__).resolve().parents[2]

    ruta_modelo = ruta_backend / "models" / "modelo_precio_papa.pkl"

    if not ruta_modelo.exists():
        raise FileNotFoundError(
            "No se encontró el modelo entrenado. "
            "Primero ejecuta: python -m app.ia.entrenamiento"
        )

    modelo = joblib.load(ruta_modelo)

    return modelo


def crear_datos_prediccion():
    """
    Crea los datos necesarios para predecir el precio
    de la siguiente semana.
    """

    datos = preparar_datos()

    datos = datos.sort_values("fecha").reset_index(drop=True)

    if len(datos) < 4:
        raise ValueError(
            "No hay suficientes datos históricos para realizar la predicción."
        )

    fecha_inicial = datos["fecha"].min()

    ultimo_registro = datos.iloc[-1]
    penultimo_registro = datos.iloc[-2]

    fecha_ultima = ultimo_registro["fecha"]
    precio_ultimo = ultimo_registro["precio_promedio"]
    precio_penultimo = penultimo_registro["precio_promedio"]

    fecha_prediccion = fecha_ultima + pd.Timedelta(days=7)

    dias = (fecha_prediccion - fecha_inicial).days

    promedio_4_semanas = (
        datos
        .tail(4)["precio_promedio"]
        .mean()
    )

    variacion_anterior = precio_ultimo - precio_penultimo

    semana = fecha_prediccion.isocalendar().week

    datos_prediccion = pd.DataFrame([{
        "dias": dias,
        "anio": fecha_prediccion.year,
        "mes": fecha_prediccion.month,
        "semana": int(semana),
        "precio_anterior": precio_ultimo,
        "promedio_4_semanas": promedio_4_semanas,
        "variacion_anterior": variacion_anterior
    }])

    return datos_prediccion, fecha_prediccion, fecha_ultima, precio_ultimo


def predecir_precio():
    """
    Realiza la predicción del precio de la papa
    para la siguiente semana.
    """

    modelo = cargar_modelo()

    datos_prediccion, fecha_prediccion, fecha_ultima, precio_ultimo = (
        crear_datos_prediccion()
    )

    precio_predicho = modelo.predict(datos_prediccion)[0]

    resultado = {
        "fecha_ultimo_registro": fecha_ultima.strftime("%Y-%m-%d"),
        "precio_ultimo_registro": round(float(precio_ultimo), 2),
        "fecha_prediccion": fecha_prediccion.strftime("%Y-%m-%d"),
        "precio_predicho": round(float(precio_predicho), 2)
    }

    return resultado


def main():
    """
    Función principal para probar la predicción.
    """

    resultado = predecir_precio()

    print("=" * 50)
    print("PREDICCIÓN DEL PRECIO DE LA PAPA")
    print("=" * 50)

    print("\nFecha del último registro:")
    print(resultado["fecha_ultimo_registro"])

    print("\nPrecio del último registro:")
    print(f'S/ {resultado["precio_ultimo_registro"]}')

    print("\nFecha predicha:")
    print(resultado["fecha_prediccion"])

    print("\nPrecio predicho:")
    print(f'S/ {resultado["precio_predicho"]} por kg')


if __name__ == "__main__":
    main()