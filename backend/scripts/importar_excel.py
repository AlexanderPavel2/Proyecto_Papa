from pathlib import Path
import pandas as pd

# ===============================
# Configuración
# ===============================

BASE_DIR = Path(__file__).resolve().parent

RUTA_EXCEL = BASE_DIR.parent / "data" / "excel" / "precios_papa.xlsx"

COLUMNAS_ESPERADAS = [
    "Región",
    "Provincia",
    "Producto",
    "Fecha",
    "precio promedio en chacra S/ / kg"
]


def leer_excel():
    """
    Lee el archivo Excel y valida su estructura.
    """

    if not RUTA_EXCEL.exists():
        raise FileNotFoundError(
            f"No existe el archivo:\n{RUTA_EXCEL}"
        )

    df = pd.read_excel(RUTA_EXCEL)

    columnas = list(df.columns)

    if columnas != COLUMNAS_ESPERADAS:

        raise ValueError(
            "Las columnas del Excel no coinciden con la estructura esperada."
        )

    return df


def main():

    df = leer_excel()

    print("=" * 50)
    print("IMPORTACIÓN DE DATOS")
    print("=" * 50)

    print(f"Archivo: {RUTA_EXCEL.name}")

    print(f"Registros encontrados: {len(df)}")

    print("\nPrimeros registros:\n")

    print(df.head())


if __name__ == "__main__":
    main()