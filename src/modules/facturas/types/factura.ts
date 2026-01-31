export type EstadoFactura = "PENDIENTE" | "PAGADO";

export interface Factura {
  id: number;
  idCliente: string;
  servicio: string;
  periodo: string;
  monto: number;
  estado: EstadoFactura;
}
