import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Facturas from "../Facturas";
import {
  ESTADOS_FACTURA,
  type Factura,
} from "../../modules/facturas/types/factura";

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

    obtenerFacturasPorIdCliente.mockResolvedValue([facturaPendiente]);
    pagarFacturaMock.mockResolvedValue(undefined);

    renderFacturasRoute("123");

    await screen.findByText("Electricidad");

    await userEvent.click(screen.getByRole("button", { name: /pagar/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const btnConfirmar = screen.getByRole("button", {
      name: /confirmar pago/i,
    });
    expect(btnConfirmar).toBeInTheDocument();

    await userEvent.click(btnConfirmar);

    await waitFor(() => {
      expect(pagarFacturaMock).toHaveBeenCalledWith(10);
    });

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /pagar/i })).toBeNull();
    });

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

    await userEvent.click(screen.getByRole("button", { name: /pagar/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: /confirmar pago/i }),
    );

    await waitFor(() => {
      const dialog = screen.getByRole("dialog");
      const alert = within(dialog).getByRole("alert");

      expect(alert).toHaveTextContent(/intente otra vez en unos minutos/i);
    });

    expect(screen.getByRole("button", { name: /pagar/i })).toBeInTheDocument();
  });
});
