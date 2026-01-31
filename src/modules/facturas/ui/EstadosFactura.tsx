import type { Factura } from "../types/factura";

const coloresFondoClaro = {
  primary: "#cce1df",
  secondary: "#dbe0df",
  info: "#EBF5FF",
  warning: "#FEF7E6",
  error: "#FDF4F6",
  success: "#EAF8F4",
  inherit: "#f1d1d1",
};

type EstadosFacturaProps = {
  factura: Factura;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
};

export function EstadosFactura({
  factura,
  color = "inherit",
}: EstadosFacturaProps) {
  return (
    <span
      key={`st-${factura.id}`}
      style={{
        padding: "2px 10px",
        borderRadius: 999,
        border: "1px solid rgba(0,0,0,0.15)",
        fontSize: 12,
        background: coloresFondoClaro[color],
      }}
    >
      {factura.estado.toUpperCase()}
    </span>
  );
}
