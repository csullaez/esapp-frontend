import { Modal } from "../../../common/components/Modal/Modal";
import type { Factura } from "../types/factura";

type ModalPagoProps = {
  abierta: boolean;
  factura: Factura | null;
  onCerrar: () => void;
  onConfirmarPago: (idFactura: number) => Promise<void>;
  pagando?: boolean;
  formatearMonto?: (monto: number) => string;
  errorPago?: string | null;
};

export function ModalPago({
  abierta,
  factura,
  onCerrar,
  onConfirmarPago,
  pagando = false,
  formatearMonto,
  errorPago,
}: ModalPagoProps) {
  const montoTexto = (monto: number) => {
    if (formatearMonto) return formatearMonto(monto);
    return `Bs. ${monto.toFixed(2)}`;
  };

  const confirmar = async () => {
    if (!factura) return;

    try {
      await onConfirmarPago(factura.id);
      onCerrar();
    } catch {
      // console.error(error);
    }
  };

  return (
    <Modal
      abierta={abierta}
      titulo="Confirmar pago"
      onCerrar={onCerrar}
      bloquearCierre={pagando}
      acciones={
        <>
          <button
            className="btn"
            type="button"
            onClick={onCerrar}
            disabled={pagando}
          >
            Cancelar
          </button>

          <button
            className="loginButton"
            type="button"
            onClick={confirmar}
            disabled={pagando}
            title="Marcar factura como pagada"
          >
            {pagando ? "Procesando..." : "Confirmar pago"}
          </button>
        </>
      }
    >
      {errorPago && (
        <div className="estado estado--error" role="alert">
          <div className="estado__titulo">No se pudo procesar el pago</div>
          <div className="estado__texto">{errorPago}</div>
        </div>
      )}
      {factura && (
        <div style={{ display: "grid", gap: 10 }}>
          <p style={{ margin: 0 }}>
            ¿Deseas <strong>pagar</strong> esta factura?
          </p>

          <div className="estado" style={{ borderStyle: "solid" }}>
            <div>
              <strong>Servicio:</strong> {factura.servicio}
            </div>
            <div>
              <strong>Periodo:</strong> {factura.periodo}
            </div>
            <div>
              <strong>Monto:</strong> {montoTexto(Number(factura.monto))}
            </div>
          </div>

          <p style={{ margin: 0, fontSize: 12, opacity: 0.75 }}>
            Estas seguro de realizar el pago? Esta acción es irreversible.
          </p>
        </div>
      )}
    </Modal>
  );
}
