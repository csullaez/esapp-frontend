import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Facturas from "../Facturas";
import {
  ESTADOS_FACTURA,
  type Factura,
} from "../../modules/facturas/types/factura";

// Mock del módulo API usado por Facturas.tsx
vi.mock("../../api/facturas.api.ts", () => {
  return {
    obtenerFacturasPorIdCliente: vi.fn(),
    pagarFacturaMock: vi.fn(),
  };
});

import {
  obtenerFacturasPorIdCliente,
  pagarFacturaMock,
} from "../../api/facturas.api.ts";

function renderFacturasRoute(idCliente = "123") {
  return render(
    <MemoryRouter initialEntries={[`/facturas/${idCliente}`]}>
      <Routes>
        <Route path="/facturas/:idCliente" element={<Facturas />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Facturas - flujo de pago", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("pago exitoso: cambia a PAGADO y desaparece botón Pagar", async () => {
    const facturaPendiente: Factura = {
      id: 10,
      idCliente: "123",
      servicio: "Electricidad",
      periodo: "2025-12",
      monto: 120,
      estado: ESTADOS_FACTURA.PENDIENTE,
    };

    (obtenerFacturasPorIdCliente as any).mockResolvedValue([facturaPendiente]);
    (pagarFacturaMock as any).mockResolvedValue(undefined);

    renderFacturasRoute("123");

    // Espera a que cargue la fila
    await screen.findByText("Electricidad");

    // Abre modal
    await userEvent.click(screen.getByRole("button", { name: /pagar/i }));

    // Modal presente
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Botón correcto (no el <h3>)
    const btnConfirmar = screen.getByRole("button", {
      name: /confirmar pago/i,
    });
    expect(btnConfirmar).toBeInTheDocument();

    // Confirma pago
    await userEvent.click(btnConfirmar);

    // Verifica que se llamó al mock
    await waitFor(() => {
      expect(pagarFacturaMock).toHaveBeenCalledWith(10);
    });

    // Ya no debe existir botón "Pagar" para esa factura
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /pagar/i })).toBeNull();
    });

    // Y debe verse estado PAGADO en la UI
    // expect(screen.getByText(/pagado/i)).toBeInTheDocument();
    expect(screen.getByText("PAGADO")).toBeInTheDocument();
  });

  it("pago fallido: mantiene modal abierto y muestra error en el modal", async () => {
    const facturaPendiente: Factura = {
      id: 10,
      idCliente: "123",
      servicio: "Electricidad",
      periodo: "2025-12",
      monto: 120,
      estado: ESTADOS_FACTURA.PENDIENTE,
    };

    (obtenerFacturasPorIdCliente as any).mockResolvedValue([facturaPendiente]);
    (pagarFacturaMock as any).mockRejectedValue(
      new Error(
        "No se pudo procesar el pago, intente otra vez en unos minutos",
      ),
    );

    renderFacturasRoute("123");

    await screen.findByText("Electricidad");

    // Abre modal
    await userEvent.click(screen.getByRole("button", { name: /pagar/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Confirma pago (fallará)
    await userEvent.click(
      screen.getByRole("button", { name: /confirmar pago/i }),
    );

    // Modal debe seguir abierto + error visible
    await waitFor(() => {
      const dialog = screen.getByRole("dialog");
      const alert = within(dialog).getByRole("alert");

      // Verifica el mensaje “específico” (evita el match del título)
      expect(alert).toHaveTextContent(/intente otra vez en unos minutos/i);
    });

    // Factura sigue pendiente → botón Pagar aún existe
    expect(screen.getByRole("button", { name: /pagar/i })).toBeInTheDocument();
  });
});
