import { Modal } from "../../../common/components/Modal/Modal";
import type { Factura } from "../types/factura";

type ModalDetallePagoProps = {
  abierta: boolean;
  factura: Factura | null;
  onCerrar: () => void;
  formatearMonto?: (monto: number) => string;
};

export function ModalDetallePago({
  abierta,
  factura,
  onCerrar,
  formatearMonto,
}: ModalDetallePagoProps) {
  const montoTexto = (monto: number) => {
    if (formatearMonto) return formatearMonto(monto);
    return `Bs. ${monto.toFixed(2)}`;
  };

  const esPagado = factura?.estado === "PAGADO";

  return (
    <Modal
      abierta={abierta && Boolean(factura) && esPagado}
      titulo="Detalle del pago"
      onCerrar={onCerrar}
      acciones={
        <button className="btn btn--primary" type="button" onClick={onCerrar}>
          Cerrar
        </button>
      }
    >
      {factura && (
        <div style={{ display: "grid", gap: 12 }}>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Informacion de la factura en estado{" "}
            <strong>PAGADO</strong>.
          </p>

          <div className="estado" style={{ borderStyle: "solid" }}>
            <div>
              <strong>ID Factura:</strong> {factura.id}
            </div>
            <div>
              <strong>identificador Cliente:</strong> {factura.idCliente}
            </div>
            <div>
              <strong>Servicio:</strong> {factura.servicio}
            </div>
            <div>
              <strong>Periodo:</strong> {factura.periodo}
            </div>
            <div>
              <strong>Monto:</strong> {montoTexto(Number(factura.monto))}
            </div>
            <div>
              <strong>Estado:</strong> {factura.estado}
            </div>
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.12)",
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Comprobante</div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>
              Nro. transacción:{" "}
              <strong>
                SIM-{factura.id}-{factura.periodo.replace("-", "")}
              </strong>
            </div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>
              Fecha de pago:
              <strong>{new Date().toLocaleDateString("es-ES")}</strong>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
