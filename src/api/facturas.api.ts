import type { Factura } from "../modules/facturas/types/factura";
import { FACTURAS_DATA } from "./datos";

const demoraSimulada = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function obtenerFacturasPorIdCliente(
  idCliente: string,
): Promise<Factura[]> {
  await demoraSimulada(700);

  if (idCliente === "999") {
    throw new Error("Error simulado de API para pruebas.");
  }

  return FACTURAS_DATA.filter((f) => f.idCliente === idCliente);
}

export async function pagarFacturaMock(idFactura: number): Promise<void> {
  await demoraSimulada(600);

  if (idFactura === -1) {
    throw new Error(
      "No se pudo procesar el pago, intente otra vez en unos minutos",
    );
  }
}
