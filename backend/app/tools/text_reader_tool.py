from dataclasses import dataclass


@dataclass
class TextReadResult:
    """Represents the outcome of trying to read a plain-text upload."""

    text: str | None
    error: str | None = None


def read_text_file(file_bytes: bytes, filename: str) -> TextReadResult:
    """Decode text-based uploads with simple safeguards against empty or binary files."""
    if not file_bytes or not file_bytes.strip():
        return TextReadResult(text=None, error=f"El archivo {filename} esta vacio.")

    if b"\x00" in file_bytes:
        return TextReadResult(
            text=None,
            error=f"El archivo {filename} no contiene texto simple legible.",
        )

    for encoding in ("utf-8", "latin-1"):
        try:
            decoded_text = file_bytes.decode(encoding).strip()
            break
        except UnicodeDecodeError:
            decoded_text = ""
    else:
        decoded_text = ""

    if not decoded_text:
        return TextReadResult(
            text=None,
            error=f"El archivo {filename} no contiene texto legible.",
        )

    normalized_text = decoded_text.replace("\r\n", "\n").replace("\r", "\n").strip()
    if len(normalized_text) < 20:
        return TextReadResult(
            text=None,
            error=f"El archivo {filename} no tiene contenido suficiente para procesarse.",
        )

    return TextReadResult(text=normalized_text)
