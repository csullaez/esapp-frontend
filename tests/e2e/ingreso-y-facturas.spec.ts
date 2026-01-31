import { test, expect } from "@playwright/test";

test.describe("Ingreso y consulta de facturas", () => {
  test("Debe permitir ingresar con idCliente válido y mostrar facturas (cliente 123)", async ({
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

    await expect(
      page.getByText("Identificador del cliente ingresado: 123"),
    ).toBeVisible();

    await expect(page.getByText("Facturas", { exact: true })).toBeVisible();

    if (!isMobile) {
      const table = page.locator("table");
      await expect(table).toBeVisible();

      await expect(table.locator("tr", { hasText: "Agua" })).toBeVisible();
      await expect(table.locator("tr", { hasText: "Luz" })).toBeVisible();

      await expect(
        table.locator("tr", { hasText: "PENDIENTE" }).first(),
      ).toBeVisible();

      await expect(
        table.getByRole("button", { name: "Pagar" }).first(),
      ).toBeVisible();

      return;
    }

    await expect(page.locator("table")).toHaveCount(0);

    await expect(page.locator("text=Agua").first()).toBeVisible();
    await expect(page.locator("text=Luz").first()).toBeVisible();

    const textoAgua = page.locator("text=Agua").first();

    const cardAgua = textoAgua.locator(
      "xpath=ancestor::*[contains(@class,'cardBody')][1]",
    );

    const cardAguaFallback = textoAgua.locator(
      "xpath=ancestor::*[self::div][3]",
    );
    const card = (await cardAgua.count()) ? cardAgua : cardAguaFallback;

    await expect(card).toBeVisible();

    await expect(card).toContainText(/PENDIENTE/i);

    await expect(card.getByRole("button", { name: "Pagar" })).toBeVisible();
  });

  test("Debe mostrar mensaje de error si idCliente está vacío", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Continuar" }).click();

    await expect(page.getByText("El idCliente es obligatorio.")).toBeVisible();
  });
});
