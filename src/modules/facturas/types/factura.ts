export const ESTADOS_FACTURA = {
  PENDIENTE: "PENDIENTE",
  PAGADO: "PAGADO",
} as const;

export type EstadoFactura = typeof ESTADOS_FACTURA[keyof typeof ESTADOS_FACTURA];

export interface Factura {
  id: number;
  idCliente: string;
  servicio: string;
  periodo: string;
  monto: number;
  estado: EstadoFactura;
}
