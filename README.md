# Exam Review AI

Exam Review AI es una aplicación web académica para gestionar revisiones de exámenes usando una answer key y uno o varios exámenes de estudiantes.

## Objetivo del MVP

Este proyecto permitirá iniciar una revisión cargando:
- una answer key
- uno o varios exámenes de estudiantes

En sprints posteriores, el sistema analizará los archivos, evaluará preguntas soportadas, organizará los resultados por revisión y mostrará el detalle de cada examen procesado.

## Stack tecnológico

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Pydantic, SQLAlchemy
- **Base de datos:** SQLite

## Dirección del MVP

El Sprint 1 se enfoca únicamente en la configuración inicial del proyecto:

- crear una estructura limpia tipo monorepo
- preparar un frontend simple con estilo académico/profesional
- dejar listo un backend modular con FastAPI
- agregar modelos base en SQLite para futuras revisiones y exámenes procesados
- dejar la lógica de calificación y la integración con OpenAI para sprints posteriores

## Estructura de carpetas

```text
exam-review-ai/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── tools/
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── app/
│   ├── components/
│   └── .env.example
├── samples/
│   ├── ambiguous/
│   ├── clear/
│   └── invalid/
└── README.md
```

## Configuración local

### Frontend

1. Abre una terminal en `frontend/`
2. Instala dependencias:

```bash
npm install
```

3. Copia el archivo de ejemplo de variables de entorno y ajústalo si es necesario:

```bash
cp .env.example .env.local
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

5. Visita `http://localhost:3000`

### Backend

1. Abre una terminal en `backend/`
2. Crea y activa un entorno virtual
3. Instala dependencias:

```bash
pip install -r requirements.txt
```

4. Copia el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
```

5. Inicia el servidor API:

```bash
uvicorn app.main:app --reload
```

6. Prueba el endpoint de salud:

```bash
curl http://localhost:8000/health
```

Respuesta esperada:

```json
{"status":"ok","app":"Exam Review AI"}
```

## Notas

- Aún no incluye Docker
- Aún no incluye autenticación
- Aún no incluye el workflow de calificación
- La integración con OpenAI se agregará en sprints posteriores

## Estado actual

### Sprint 1 completado
- estructura base del proyecto
- frontend inicial
- backend inicial
- configuración de entorno
- scaffolding de SQLite
- README base
