type StudentExamUploadProps = {
  selectedFiles: File[];
  onFilesAdd: (files: File[]) => void;
  onFileRemove: (fileKey: string) => void;
};

export function StudentExamUpload({
  selectedFiles,
  onFilesAdd,
  onFileRemove
}: StudentExamUploadProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-ink">
            Cargar examenes de estudiantes
          </h3>
          <p className="mt-1 max-w-xl text-sm leading-6 text-slate">
            Agrega uno o varios archivos. Puedes revisar la lista y quitar elementos antes de
            procesar.
          </p>
        </div>
        <span className="rounded-full border border-border bg-paper px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate">
          Multiples archivos
        </span>
      </div>

      <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-paper/70 px-6 py-8 text-center transition hover:border-accent hover:bg-paper">
        <span className="text-sm font-medium text-ink">Seleccionar examenes</span>
        <span className="mt-2 text-sm text-slate">
          Puedes cargar varios archivos a la vez desde tu equipo.
        </span>
        <input
          type="file"
          multiple
          className="sr-only"
          onChange={(event) => onFilesAdd(Array.from(event.target.files ?? []))}
        />
      </label>

      <div className="mt-4 rounded-xl border border-border bg-white/80 px-4 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate">Archivos seleccionados</p>
          <p className="text-sm font-medium text-ink">{selectedFiles.length}</p>
        </div>

        {selectedFiles.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {selectedFiles.map((file) => (
              <li
                key={`${file.name}-${file.lastModified}`}
                className="flex flex-col gap-3 rounded-xl border border-border bg-paper/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{file.name}</p>
                  <p className="mt-1 text-xs text-slate">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onFileRemove(`${file.name}-${file.lastModified}`)}
                  className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-medium text-slate transition hover:border-accent hover:text-ink"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate">
            Todavia no has agregado examenes de estudiantes.
          </p>
        )}
      </div>
    </section>
  );
}
