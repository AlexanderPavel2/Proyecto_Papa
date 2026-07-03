# Sistema de Información y Predicción del Precio de la Papa

Sistema web desarrollado para consultar, comparar y predecir el precio de la papa blanca en el Mercado Mayorista de Huancayo, con el objetivo de apoyar al agricultor en la toma de decisiones durante la negociación de venta.

---

## Descripción del proyecto

El sistema permite visualizar información histórica del precio de la papa, consultar el precio actual, analizar ofertas de compradores, simular ingresos por venta y obtener una predicción del precio para la siguiente semana mediante un modelo de Machine Learning.

Además, cuenta con un panel administrador que permite importar nuevos datos desde un archivo Excel y actualizar automáticamente la base de datos y el modelo predictivo.

---

## Tecnologías utilizadas

### Backend

- **Python**
- **FastAPI**
- **SQLite**
- **Pandas**
- **OpenPyXL**
- **Scikit-learn**
- **Joblib**
- **Uvicorn**

### Frontend

- **HTML5**
- **CSS3**
- **JavaScript**
- **Chart.js**

---

## Estructura del proyecto

```text
Proyecto_Papa/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── database/
│   │   ├── ia/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── data/
│   │   ├── excel/
│   │   └── sqlite/
│   │
│   ├── models/
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── admin.html
│   ├── css/
│   ├── js/
│   └── img/
│
└── README.md
```

---

## Funcionalidades principales

- Consulta del precio actual de la papa.
- Visualización del historial de precios.
- Filtro de historial por fechas.
- Gráfico de evolución del precio.
- Predicción del precio para la siguiente semana.
- Asistente para la negociación.
- Comparación de oferta del comprador con el precio actual.
- Simulación de ingresos por venta.
- Panel administrador.
- Importación de datos desde Excel.
- Reentrenamiento automático del modelo de Machine Learning.
- Visualización de métricas del modelo entrenado.

---

## Instalación del backend

Primero, ingresar a la carpeta del backend:

```bash
cd backend
```

Crear el entorno virtual:

```bash
python -m venv venv
```

Activar el entorno virtual en Windows:

```bash
venv\Scripts\activate
```

Instalar las dependencias necesarias:

```bash
pip install -r requirements.txt
```

---

## Dependencias del backend

El archivo `requirements.txt` debe contener:

```txt
fastapi
uvicorn
pandas
openpyxl
sqlalchemy
python-multipart
passlib[bcrypt]
joblib
scikit-learn
numpy
```

---

## Ejecución del backend

Desde la carpeta `backend`, ejecutar el servidor FastAPI:

```bash
python -m uvicorn app.main:app --reload
```

La API estará disponible en:

```text
http://127.0.0.1:8000
```

La documentación Swagger estará disponible en:

```text
http://127.0.0.1:8000/docs
```

---

## Ejecución del frontend

Para ejecutar el frontend, abrir la carpeta `frontend` en Visual Studio Code y usar la extensión **Live Server**.

Archivos principales del frontend:

```text
index.html
login.html
admin.html
```

La página principal se abre desde:

```text
index.html
```

El panel de login se abre desde:

```text
login.html
```

El panel administrador se abre desde:

```text
admin.html
```

---

## Credenciales del administrador

```text
Usuario: admin
Contraseña: admin123
```

---

## Flujo del administrador

El administrador realiza el siguiente proceso:

1. Ingresa al sistema mediante el login.
2. Selecciona un archivo Excel con los precios actualizados.
3. El sistema importa los datos hacia la base de datos SQLite.
4. El sistema evita duplicar registros ya existentes.
5. Se actualiza la fecha de última actualización.
6. El modelo de Machine Learning se reentrena automáticamente.
7. Se muestran las métricas del modelo actualizado.

---

## Flujo del agricultor

El agricultor puede realizar las siguientes acciones:

1. Consultar el precio actual de la papa.
2. Revisar el historial de precios.
3. Filtrar precios por rango de fechas.
4. Visualizar la evolución del precio en un gráfico.
5. Consultar la predicción del precio para la siguiente semana.
6. Ingresar una oferta del comprador.
7. Ingresar la cantidad de papa que desea vender.
8. Recibir una recomendación para apoyar la negociación.

---

## Base de datos

El sistema utiliza una base de datos SQLite ubicada en:

```text
backend/data/sqlite/precios_papa.db
```

Las tablas principales son:

```text
precio_chacra
administrador
configuracion
```

### Tabla `precio_chacra`

Almacena los precios históricos de la papa.

Campos principales:

- `id_precio`
- `region`
- `provincia`
- `producto`
- `fecha`
- `precio_promedio`

### Tabla `administrador`

Almacena los datos del administrador del sistema.

Campos principales:

- `id_admin`
- `nombre`
- `usuario`
- `contraseña`

### Tabla `configuracion`

Almacena información general del sistema, como la última actualización.

Campos principales:

- `id_config`
- `ultima_actualizacion`

---

## Archivo Excel utilizado

El sistema trabaja con un archivo Excel que debe mantener el siguiente formato:

```text
Región
Provincia
Producto
Fecha
precio promedio en chacra S/ / kg
```

El archivo debe estar en formato `.xlsx`.

---

## Modelo de predicción

El sistema utiliza un modelo de Machine Learning basado en **Random Forest Regressor** para estimar el precio de la papa de la siguiente semana.

El modelo se guarda en:

```text
backend/models/modelo_precio_papa.pkl
```

---

## Variables utilizadas por el modelo

El modelo utiliza las siguientes variables:

- **Días transcurridos**
- **Año**
- **Mes**
- **Semana**
- **Precio anterior**
- **Promedio de las últimas 4 semanas**
- **Variación anterior**

Estas variables permiten que el modelo considere tanto el comportamiento temporal como la tendencia reciente del precio.

---

## Métricas del modelo

Las métricas obtenidas durante el entrenamiento fueron:

```text
MAE: 0.07
RMSE: 0.0925
R2: 0.532
```

### Interpretación

- **MAE**: indica el error promedio absoluto del modelo.
- **RMSE**: indica el error cuadrático medio, penalizando errores grandes.
- **R2**: indica qué tan bien el modelo explica la variación de los datos.

En este caso, el modelo presenta un error promedio aproximado de **S/ 0.07 por kg**, lo cual permite obtener una predicción referencial para apoyar la toma de decisiones.

---

## Endpoints principales del backend

### Inicio

```http
GET /
```

Permite verificar que la API está funcionando.

---

### Precios

```http
GET /precios
```

Devuelve los precios almacenados en la base de datos.

---

### Historial

```http
GET /historial
```

Devuelve el historial completo de precios.

---

### Estadísticas

```http
GET /estadisticas
```

Devuelve el precio actual, precio máximo, precio mínimo y precio promedio.

---

### Última actualización

```http
GET /ultima-actualizacion
```

Devuelve la fecha y hora de la última actualización de datos.

---

### Predicción

```http
GET /prediccion
```

Devuelve la predicción del precio de la papa para la siguiente semana.

---

### Login

```http
POST /login
```

Permite iniciar sesión como administrador.

---

### Importar Excel

```http
POST /importar-excel
```

Permite subir un archivo Excel, actualizar la base de datos y reentrenar el modelo de predicción.

---

## Ejemplo de respuesta de predicción

```json
{
  "fecha_ultimo_registro": "2025-10-17",
  "precio_ultimo_registro": 0.7,
  "fecha_prediccion": "2025-10-24",
  "precio_predicho": 0.72
}
```

---

## Ejemplo de respuesta al importar Excel

```json
{
  "success": true,
  "filas_excel": 258,
  "registros_nuevos": 0,
  "registros_existentes": 258,
  "total_bd": 258,
  "ultima_actualizacion": "2026-07-03 15:44:26",
  "modelo_actualizado": true,
  "metricas_modelo": {
    "mae": 0.07,
    "rmse": 0.0925,
    "r2": 0.532
  }
}
```

---

## Observación sobre la predicción

La predicción generada por el sistema es referencial y sirve como apoyo para la toma de decisiones del agricultor.

No reemplaza el análisis comercial real, ya que el precio de la papa puede depender de otros factores como:

- oferta y demanda;
- clima;
- transporte;
- temporada agrícola;
- intermediarios;
- calidad del producto;
- condiciones del mercado.

---

## Observación sobre Live Server

Durante el desarrollo local, se recomienda abrir Live Server únicamente desde la carpeta `frontend`.

Esto evita que Live Server recargue la página al detectar cambios en archivos del backend, como:

```text
precios_papa.db
modelo_precio_papa.pkl
```

En una demostración en la nube este problema no debería ocurrir, porque Live Server no se utiliza en producción.

---

## Estado actual del proyecto

El sistema cuenta con un MVP funcional que permite:

```text
Agricultor
↓
Consulta precios, historial, predicción y recomendaciones de negociación.

Administrador
↓
Importa datos desde Excel, actualiza la base de datos y reentrena el modelo.
```

---

## Autor

Proyecto desarrollado como parte de un trabajo académico orientado a la construcción de un sistema web para apoyar la toma de decisiones de agricultores en la venta de papa blanca.