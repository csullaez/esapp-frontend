import { useState } from "react";

type FormularioTypes = {
  onBuscar: (idCliente: string) => void | Promise<void>;
  deshabilitado?: boolean;
};

export function FormularioBusquedaCliente({
  onBuscar,
  deshabilitado = false,
}: FormularioTypes) {
  const [idCliente, setIdCliente] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const validar = (valor: string) => {
    const v = valor.trim();
    if (!v) return "El campo idCliente es obligatorio.";
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(v)) {
      return "Formato inválido. Use 3–10 caracteres (letras, números, _ o -).";
    }
    return null;
  };

  const handleBuscar = async () => {
    const error = validar(idCliente);
    setError(error);
    if (error) return;

    await onBuscar(idCliente.trim());
  };

  const limpiar = async () => {
    setIdCliente("");
  };

  return (
    <div className="formRow">
      <div className="campo">
        <label htmlFor="idCliente">Identificador del Cliente</label>
        <input
          id="idCliente"
          type="text"
          placeholder="Ejemplo: 123 o 4656"
          value={idCliente}
          onChange={(e) => setIdCliente(e.target.value)}
          onBlur={() => setError(validar(idCliente))}
          disabled={deshabilitado}
          style={{
            flexGrow: "1",
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.15)",
          }}
        />
        {error && <small className="error">{error}</small>}
      </div>

      <button type="button" onClick={limpiar} disabled={deshabilitado}
      style={{
        borderRadius: 10,
        padding: "10px 15px",
        border: "1px solid rgba(0,0,0,0.15)",
        background: "white",
      }}
      >
        Limpiar
      </button>

      <button type="button" onClick={handleBuscar} disabled={deshabilitado}
      style={{
        borderRadius: 10,
        padding: "10px 15px",
        border: "1px solid rgba(0,0,0,0.15)",
        background: "white",
      }}
      >
        Buscar
      </button>
    </div>
  );
}
