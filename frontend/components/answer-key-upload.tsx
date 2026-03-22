type AnswerKeyUploadProps = {
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
  resetKey?: number;
};

export function AnswerKeyUpload({
  selectedFile,
  onFileChange,
  disabled = false,
  resetKey = 0
}: AnswerKeyUploadProps) {
  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-ink">Cargar answer key</h3>
          <p className="mt-1 max-w-xl text-sm leading-6 text-slate">
            Selecciona el archivo de referencia que servira como base para la revision.
          </p>
        </div>
        <span className="rounded-full border border-border bg-paper px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate">
          Archivo unico
        </span>
      </div>

      <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-paper/70 px-6 py-8 text-center transition hover:border-accent hover:bg-paper aria-disabled:cursor-not-allowed aria-disabled:opacity-70">
        <span className="text-sm font-medium text-ink">
          {selectedFile ? "Reemplazar answer key" : "Seleccionar answer key"}
        </span>
        <span className="mt-2 text-sm text-slate">
          Formatos de ejemplo: PDF, DOCX o imagen escaneada.
        </span>
        <input
          key={resetKey}
          type="file"
          className="sr-only"
          disabled={disabled}
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        />
      </label>

      <div className="mt-4 rounded-xl border border-border bg-white/80 px-4 py-3">
        <p className="text-sm text-slate">Archivo seleccionado</p>
        <p className="mt-1 text-sm font-medium text-ink">
          {selectedFile?.name ?? "Todavia no has seleccionado un answer key."}
        </p>
      </div>
    </section>
  );
}
