import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerFacturasPorIdCliente } from "../api/facturas.api";

export default function IngresoCliente() {
  const navigate = useNavigate();

  const [idCliente, setIdCliente] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const validar = (valor: string) => {
    const v = valor.trim();
    if (!v) return "El idCliente es obligatorio.";
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(v))
      return "Formato inválido (3–20 caracteres).";
    return null;
  };

  const obtenerFacturas = async () => {
    const error = validar(idCliente);
    if (error) {
      setMensaje(error);
      return;
    }

    setCargando(true);
    setMensaje(null);
    try {
      const facturas = await obtenerFacturasPorIdCliente(idCliente.trim());

      if (!facturas || facturas.length === 0) {
        setMensaje("No se encontraron facturas asociadas a ese idCliente.");
        return;
      }

      navigate(`/facturas/${encodeURIComponent(idCliente.trim())}`);
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? error.message
          : "Error al verificar el cliente.",
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    //TODO: Mejorar estilos
    <div className="loginLayout">
      <div className="loginCard">
        <section className="loginLeft">
          <div className="brand">
            <div className="brandMark" aria-hidden="true">
              ⚡
            </div>
            <div>
              <div className="brandName">ESApp</div>
              <div className="brandTag">Portal de facturación</div>
            </div>
          </div>

          <h1 className="loginTitle">Consulta tus facturas</h1>
          <p className="loginSubtitle">
            Ingresa tu <strong>idCliente</strong> para acceder a tus facturas
            pendientes y realizar el pago.
          </p>

          <div className="loginForm">
            <label className="loginLabel" htmlFor="idCliente">
              idCliente
            </label>
            <input
              id="idCliente"
              className="loginInput"
              placeholder="Ej: 123"
              value={idCliente}
              onChange={(e) => setIdCliente(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && obtenerFacturas()}
              disabled={cargando}
            />
            {mensaje && <div className="loginAlert">{mensaje}</div>}
            <button
              className="loginButton"
              onClick={obtenerFacturas}
              disabled={cargando}
            >
              {cargando ? "Verificando..." : "Continuar"}
            </button>

            <div style={{ paddingTop: 8, paddingBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <hr
                  style={{
                    flexGrow: 1,
                    border: "none",
                    borderTop: "1px solid #ccc",
                    margin: 0,
                  }}
                />
                <span
                  style={{
                    margin: "0 12px",
                    color: "#777",
                    fontSize: "0.875rem",
                    whiteSpace: "nowrap",
                  }}
                >
                O
                </span>
                <hr
                  style={{
                    flexGrow: 1,
                    border: "none",
                    borderTop: "1px solid #ccc",
                    margin: 0,
                  }}
                />
              </div>
            </div>
            <button
              className="loginButtonSecond"
              onClick={() => navigate("/facturasAdmin", { replace: true })}
              disabled={cargando}
            >
              Administrador
            </button>
            <p className="loginHint">
              Tip: prueba con <code>123</code> o <code>456</code>
            </p>
          </div>
        </section>

        <aside className="loginRight">
          <div className="rightContent">
            <h2>Pago rápido y seguro</h2>
            <p>
              Simulación de flujo empresarial: consulta, validación,
              confirmación y actualización inmediata.
            </p>

            <div className="bubbles" aria-hidden="true">
              <div className="bubble b1" />
              <div className="bubble b2" />
              <div className="bubble b3" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
