# Exam Review AI

Exam Review AI es una aplicacion web academica para cargar una answer key y uno o varios examenes de estudiantes, procesarlos de forma controlada y mostrar resultados estructurados listos para revision humana.

## Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: FastAPI, Pydantic, SQLAlchemy
- Base de datos: SQLite
- Evaluacion semantica controlada: OpenAI `gpt-4o-mini`

## Arquitectura

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
│   ├── .venv/
│   └── requirements.txt
├── frontend/
│   ├── app/
│   └── components/
├── samples/
│   ├── clear/
│   ├── ambiguous/
│   └── invalid/
└── README.md
```

## Flujo del sistema

1. El usuario crea una revision cargando una answer key y examenes.
2. El backend valida texto legible y encabezados basicos.
3. Se parsean series, preguntas y reglas simples de puntaje.
4. Se compara cada examen contra la answer key con reglas exactas.
5. Si el exact match falla y la pregunta es corta y apta, se intenta `semantic_short`.
6. Se construye un contrato JSON final por examen con warnings, aclaraciones y tool trace.
7. El frontend permite navegar por revision y por resultado individual.

## Flujo agentic y tools utilizadas

El backend trabaja como un pipeline de herramientas simples y deterministicas:

- `extract_text_tool`
- `answer_key_validator_tool`
- `student_exam_validator_tool`
- `header_parser_tool`
- `series_parser_tool`
- `question_parser_tool`
- `answer_compare_tool`
- `semantic_short_evaluator`

Cada examen guarda el rastro de herramientas en `tool_trace` dentro de `result_json`.

## Contrato final del resultado

Cada examen procesado guarda exactamente estas llaves top-level:

- `status`
- `document_type`
- `summary`
- `extracted_data`
- `warnings`
- `needs_clarification`
- `clarifying_questions`
- `tool_trace`

`document_type` ahora usa `academic_document`.

## Como correr el proyecto

### Backend

1. Entra a `backend/`
2. Crea el entorno virtual si aun no existe:

```bash
python -m venv .venv
```

3. Instala dependencias:

```bash
.\.venv\Scripts\python -m pip install -r requirements.txt
```

4. Crea `backend/.env` a partir de `backend/.env.example`
5. Inicia FastAPI:

```bash
.\.venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### Frontend

1. Entra a `frontend/`
2. Instala dependencias:

```bash
npm install
```

3. Crea `frontend/.env.local` a partir de `frontend/.env.example`
4. Inicia Next.js:

```bash
npm run dev
```

5. Verifica que Next.js haya iniciado correctamente y que el servidor indique el puerto local disponible
6. Abre `http://localhost:3000`

## Archivos de prueba incluidos

Los encuentra dentro de la carpeta /samples/clear en la raiz del proyecto

Uso sugerido:

- Usa `answer_key_bases_datos_sprint10.txt` como examen guia o answer key.
- Usa los tres archivos `examen_*.txt` como examenes de estudiantes.
- Carga los cuatro archivos desde la home para probar una revision en limpio.

## OpenAI y ambiguedad

- Si `OPENAI_API_KEY` no esta configurada, el sistema no falla.
- Las preguntas aptas para `semantic_short` caen a `review` de forma segura.
- Si la key existe, se usa `gpt-4o-mini` de forma conservadora.
- Si hay duda real, la salida queda en `needs_review` y `needs_clarification = true`.

## Como se valida el output

- El backend construye un contrato JSON final por examen.
- SQLite persiste `result_json` con el contrato completo.
- La UI muestra resumen por revision y desglose completo por examen.
- El endpoint `GET /api/results/{result_id}` devuelve el detalle completo del resultado.

## Manejo de errores y ambiguedad

- `success`: examen evaluado sin dudas relevantes
- `needs_review`: hay ambiguedad, review manual o puntaje incompleto
- `error`: archivo invalido o procesamiento fallido

El sistema genera:

- warnings
- preguntas sugeridas para revision manual
- tool trace

## Ejemplos de uso

- Crear una revision desde la home con una answer key valida y examenes de texto.
- Abrir una revision desde `Revisiones procesadas`.
- Abrir un examen individual con `Ver resultado`.
- Revisar series, preguntas, warnings y herramientas usadas.

## Casos sugeridos para el video

1. Caso claro
   Usa `samples/clear/answer_key_bases_datos_sprint10.txt` junto con uno o mas de los examenes `examen_andrea_bases_datos_sprint10.txt`, `examen_diego_bases_datos_sprint10.txt` o `examen_sofia_bases_datos_sprint10.txt`
   Resultado esperado: revision creada y examenes procesados con resultado estructurado

2. Caso ambiguo
   Usa el mismo set de prueba y fuerza un caso con respuestas parciales o equivalencias breves para observar `needs_review` o uso de `semantic_short`
   Resultado esperado: `needs_review` si hay duda o equivalencia semantica insuficiente

3. Caso error
   Usa un archivo vacio, un txt sin contenido util o una answer key no valida
   Resultado esperado: rechazo o `error`

## Estado final

El proyecto ya queda listo para:

- demo funcional
- pruebas en Postman
- grabacion de video
- presentacion tecnica del flujo completo
