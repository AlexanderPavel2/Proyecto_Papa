from pathlib import Path

import joblib
import pandas as pd

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from app.ia.preparar_datos import preparar_datos


def crear_variables(datos):
    """
    Crea variables históricas para mejorar la predicción.
    """

    datos = datos.copy()

    datos["anio"] = datos["fecha"].dt.year
    datos["mes"] = datos["fecha"].dt.month
    datos["semana"] = datos["fecha"].dt.isocalendar().week.astype(int)

    datos["precio_anterior"] = datos["precio_promedio"].shift(1)

    datos["promedio_4_semanas"] = (
        datos["precio_promedio"]
        .shift(1)
        .rolling(window=4)
        .mean()
    )

    datos["variacion_anterior"] = (
        datos["precio_anterior"]
        - datos["precio_promedio"].shift(2)
    )

    datos = datos.dropna()

    columnas_entrada = [
        "dias",
        "anio",
        "mes",
        "semana",
        "precio_anterior",
        "promedio_4_semanas",
        "variacion_anterior"
    ]

    x = datos[columnas_entrada]

    y = datos["precio_promedio"]

    return datos, x, y


def dividir_datos(x, y):
    """
    Divide los datos respetando el orden histórico.
    """

    cantidad_datos = len(x)

    limite_entrenamiento = int(cantidad_datos * 0.8)

    x_entrenamiento = x.iloc[:limite_entrenamiento]
    x_prueba = x.iloc[limite_entrenamiento:]

    y_entrenamiento = y.iloc[:limite_entrenamiento]
    y_prueba = y.iloc[limite_entrenamiento:]

    return x_entrenamiento, x_prueba, y_entrenamiento, y_prueba


def entrenar_modelo(x_entrenamiento, y_entrenamiento):
    """
    Entrena el modelo de predicción.
    """

    modelo = RandomForestRegressor(
        n_estimators=300,
        random_state=42,
        max_depth=8
    )

    modelo.fit(x_entrenamiento, y_entrenamiento)

    return modelo


def evaluar_modelo(modelo, x_prueba, y_prueba):
    """
    Evalúa el modelo con datos no usados en el entrenamiento.
    """

    predicciones = modelo.predict(x_prueba)

    mae = mean_absolute_error(y_prueba, predicciones)

    mse = mean_squared_error(y_prueba, predicciones)

    rmse = mse ** 0.5

    r2 = r2_score(y_prueba, predicciones)

    return mae, rmse, r2, predicciones


def guardar_modelo(modelo):
    """
    Guarda el modelo entrenado en la carpeta models.
    """

    ruta_backend = Path(__file__).resolve().parents[2]

    ruta_modelos = ruta_backend / "models"

    ruta_modelos.mkdir(exist_ok=True)

    ruta_modelo = ruta_modelos / "modelo_precio_papa.pkl"

    joblib.dump(modelo, ruta_modelo)

    return ruta_modelo


def entrenar_y_guardar_modelo():
    """
    Entrena, evalúa y guarda el modelo.
    Esta función se puede usar desde la terminal o desde FastAPI.
    """

    datos_originales = preparar_datos()

    datos, x, y = crear_variables(datos_originales)

    x_entrenamiento, x_prueba, y_entrenamiento, y_prueba = dividir_datos(x, y)

    modelo = entrenar_modelo(x_entrenamiento, y_entrenamiento)

    mae, rmse, r2, predicciones = evaluar_modelo(
        modelo,
        x_prueba,
        y_prueba
    )

    ruta_modelo = guardar_modelo(modelo)

    resultado = {
        "cantidad_datos_originales": len(datos_originales),
        "cantidad_datos_usados": len(datos),
        "datos_entrenamiento": len(x_entrenamiento),
        "datos_prueba": len(x_prueba),
        "mae": round(float(mae), 4),
        "rmse": round(float(rmse), 4),
        "r2": round(float(r2), 4),
        "ruta_modelo": str(ruta_modelo)
    }

    return resultado


def main():
    """
    Entrena y evalúa el modelo desde la terminal.
    """

    resultado = entrenar_y_guardar_modelo()

    print("=" * 50)
    print("ENTRENAMIENTO DEL MODELO FINALIZADO")
    print("=" * 50)

    print("\nCantidad total de datos originales:")
    print(resultado["cantidad_datos_originales"])

    print("\nCantidad de datos usados por el modelo:")
    print(resultado["cantidad_datos_usados"])

    print("\nDatos para entrenamiento:")
    print(resultado["datos_entrenamiento"])

    print("\nDatos para prueba:")
    print(resultado["datos_prueba"])

    print("\nMétricas del modelo:")
    print(f'MAE  : {resultado["mae"]}')
    print(f'RMSE : {resultado["rmse"]}')
    print(f'R2   : {resultado["r2"]}')

    print("\nModelo guardado en:")
    print(resultado["ruta_modelo"])


if __name__ == "__main__":
    main()