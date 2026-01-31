import { test, expect } from "@playwright/test";

test("Flujo: ingresar, ver facturas y pagar una factura", async ({
  page,
}, testInfo) => {
  const isMobile = !!testInfo.project.use?.isMobile;

  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Consulta tus facturas" }),
  ).toBeVisible();

  await page.getByLabel("idCliente").fill("123");

  await Promise.all([
    page.waitForURL("**/facturas/123"),
    page.getByRole("button", { name: "Continuar" }).click(),
  ]);

  await expect(
    page.getByRole("heading", { name: "Consulta y pago de facturas" }),
  ).toBeVisible();

  if (!isMobile) {
    const tabla = page.locator("table");
    await expect(tabla).toBeVisible();

    const filaAgua = tabla.getByRole("row", { name: /Agua\s+2025-12/i });
    await expect(filaAgua).toBeVisible();
    await expect(filaAgua).toContainText(/PENDIENTE/i);

    await filaAgua.getByRole("button", { name: "Pagar" }).click();

    const botonConfirmar = page.getByRole("button", { name: "Confirmar pago" });
    await expect(botonConfirmar).toBeVisible();
    await botonConfirmar.click();

    await expect(filaAgua).toContainText(/PAGADO/i);
    await expect(filaAgua.getByRole("button", { name: "Pagar" })).toHaveCount(
      0,
    );
    return;
  }

  const cardAgua = page
    .locator("div")
    .filter({ hasText: "Servicio" })
    .filter({ hasText: "Agua" })
    .filter({ hasText: "Periodo" })
    .filter({ hasText: "2025-12" })
    .first();

  await expect(cardAgua).toBeVisible();
  await expect(cardAgua).toContainText(/PENDIENTE/i);

  await cardAgua.getByRole("button", { name: "Pagar" }).first().click();

  const botonConfirmar = page.getByRole("button", { name: "Confirmar pago" });
  await expect(botonConfirmar).toBeVisible();
  await botonConfirmar.click();

  await expect(cardAgua).toContainText(/PAGADO/i);

  await expect(cardAgua.getByRole("button", { name: "Ver" })).toBeVisible();
});
