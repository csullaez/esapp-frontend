import type { Factura } from "../modules/facturas/types/factura";

export const FACTURAS_DATA: Factura[] = [
  {
    id: 1,
    idCliente: "123",
    servicio: "Agua",
    periodo: "2025-12",
    monto: 58.2,
    estado: "PENDIENTE",
  },
  {
    id: 2,
    idCliente: "123",
    servicio: "Luz",
    periodo: "2026-01",
    monto: 120.5,
    estado: "PENDIENTE",
  },
  {
    id: 3,
    idCliente: "456",
    servicio: "Internet",
    periodo: "2025-11",
    monto: 210,
    estado: "PAGADO",
  },
  {
    id: 4,
    idCliente: "456",
    servicio: "Luz",
    periodo: "2025-12",
    monto: 98.3,
    estado: "PENDIENTE",
  },
];
