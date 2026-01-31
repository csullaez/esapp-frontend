# ESAPP – Frontend de Consulta y Pago de Facturas

---

## Descripción General

**ESAPP Frontend** es una aplicación web de tipo **Single Page Application (SPA)** desarrollada con **React y TypeScript**, cuyo objetivo es permitir a los clientes consultar y pagar facturas de servicios de forma sencilla, segura y sin recarga de página.

La aplicación simula la interacción con un backend real mediante **servicios mock**, contemplando flujos de carga, error, estados vacíos y confirmación de pagos.

---

## Tecnologías Utilizadas

- React
- TypeScript
- Vite
- React Router DOM
- Vitest
- Testing Library
- Playwright
- ESLint
- CSS Modules

---

## Requisitos del Sistema

| Nombre  | Versión mínima |
|--------|----------------|
| NodeJS | 22.x           |
| NPM    | 11.x            |

> Recomendado: Node.js **22 LTS o superior**

## Instalación

Para instalar la aplicación se recomienda revisar el siguiente documento:

> [INSTALL.md](INSTALL.md)

### Ejecutar en modo desarrollo

```
npm run dev
```

---

## Funcionalidades Principales

- Ingreso mediante identificador de cliente (`idCliente`)
- Consulta de facturas por cliente
- Visualización responsive (tabla / tarjetas)
- Pago de facturas pendientes
- Actualización automática de estado a **PAGADO**
- Visualización de comprobante de pago
- Manejo de errores y estados de carga

---

## Estructura del Proyecto

```
src/
├─ api/ # Servicios mock
├─ common/ # Componentes reutilizables
├─ modules/
│ ├─ facturas/ # Consulta y pago de facturas
    ├─ ui/ # Componentes de Facturas
    ├─ types/ # Tipos y modelos de Facturas
├─ pages/ # Vistas del proyecto
├─ styles/ # Estilos globales
├─ test/ # Configuración de pruebas unitarias
tests/
└─ e2e/ # Pruebas End-to-End

```
---

## Datos de Prueba

| idCliente | Descripción                                   |
|----------|-----------------------------------------------|
| 123      | Cliente con facturas pendientes y pagadas     |
| 456      | Cliente con facturas pendiente                |
| 999      | Cliente inexistente (flujo de error)          |

---

## Flujo de Uso

1. El usuario ingresa su `idCliente`.
2. El sistema valida el formato.
3. Se consultan las facturas asociadas.
4. Se muestran en pantalla.
5. Las facturas pendientes pueden ser pagadas.
6. El estado cambia automáticamente a **PAGADO**.
7. El usuario puede visualizar el comprobante.

---

## Manejo de Estados

La aplicación contempla:

- **Loading**: carga de datos
- **Error**: cliente inexistente o error en el pago
- **Empty State**: cliente sin facturas
- **Success**: pago exitoso

---

## Pruebas Automatizadas

### Unitarias
```
npm run test:run
```

### End-to-End
```
npm run test:e2e
```
