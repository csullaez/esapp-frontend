import { useEffect, useMemo, useState } from "react";
import { FormularioBusquedaCliente } from "../modules/facturas/ui/FormularioBusquedaCliente.tsx";
import { CustomDataTable } from "../common/components/DataTable/CustomDataTable.tsx";
import { obtenerFacturasPorIdCliente } from "../api/facturas.api.ts";
import { useNavigate } from "react-router-dom";
import type {
  EstadoFactura,
  Factura,
} from "../modules/facturas/types/factura.ts";
import { EstadosFactura } from "../modules/facturas/ui/EstadosFactura.tsx";

export default function FacturasAdmin() {
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [idClienteActual, setIdClienteActual] = useState<string>("");

  const [pagina, setPagina] = useState<number>(1);
  const paginaTamanio = 4;

  const [filtro, setFiltro] = useState<string>("");
  const [estado, setEstado] = useState<"" | Factura["estado"]>("");

  const buscarFacturas = async (idCliente: string) => {
    setCargando(true);
    setError(null);
    try {
      const datos = await obtenerFacturasPorIdCliente(idCliente);
      setFacturas(datos);
      setPagina(1);
    } catch (error) {
      setFacturas([]);
      setError(
        error instanceof Error
          ? error.message
          : "Error desconocido al buscar facturas.",
      );
    } finally {
      setCargando(false);
    }
  };

  const onBuscar = async (idCliente: string) => {
    setIdClienteActual(idCliente);
    await buscarFacturas(idCliente);
  };

  const filtrado = useMemo(() => {
    const filtroLower = filtro.trim().toLowerCase();

    return facturas.filter((factura) => {
      const matchQ =
        !filtroLower ||
        factura.servicio.toLowerCase().includes(filtroLower) ||
        factura.periodo.toLowerCase().includes(filtroLower) ||
        String(factura.monto).includes(filtroLower) ||
        String(factura.id).includes(filtroLower);

      const matchEstado = !estado || factura.estado === estado;
      return matchQ && matchEstado;
    });
  }, [filtro, estado, facturas]);

  const totalPaginas = Math.max(1, Math.ceil(filtrado.length / paginaTamanio));

  const itemsPagina = useMemo(() => {
    const start = (pagina - 1) * paginaTamanio;
    return filtrado.slice(start, start + paginaTamanio);
  }, [filtrado, pagina, paginaTamanio]);

  const columnas = [
    { nombre: "Cliente" },
    { nombre: "Servicio" },
    { nombre: "Periodo" },
    { nombre: "Monto (Bs)" },
    { nombre: "Estado" },
    { nombre: "Acción" },
  ];

  const filtros = (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <input
        value={filtro}
        onChange={(e) => {
          setPagina(1);
          setFiltro(e.target.value);
        }}
        placeholder="Buscar por servicio, periodo o monto…"
        style={{
          flex: "1 1 260px",
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.15)",
        }}
      />

      <select
        value={estado}
        onChange={(e) => {
          setPagina(1);
          setEstado(e.target.value as EstadoFactura);
        }}
        style={{
          flex: "0 0 180px",
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.15)",
          background: "white",
        }}
      >
        <option value="">Todos</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="PAGADO">Pagado</option>
      </select>
    </div>
  );

  const paginacion = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.65)" }}>
        Página {pagina} de {totalPaginas} — {filtrado.length} registros
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          disabled={pagina <= 1 || cargando}
          onClick={() => setPagina((p) => Math.max(1, p - 1))}
          style={{
            borderRadius: 10,
            padding: "6px 10px",
            border: "1px solid rgba(0,0,0,0.15)",
            background: "white",
            cursor: "pointer",
            opacity: pagina <= 1 || cargando ? 0.5 : 1,
          }}
        >
          Anterior
        </button>

        <button
          type="button"
          disabled={pagina >= totalPaginas || cargando}
          onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
          style={{
            borderRadius: 10,
            padding: "6px 10px",
            border: "1px solid rgba(0,0,0,0.15)",
            background: "white",
            cursor: "pointer",
            opacity: pagina >= totalPaginas || cargando ? 0.5 : 1,
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );

  const acciones = [
    <button
      key="btn-refresh"
      type="button"
      disabled={!idClienteActual || cargando}
      onClick={() => buscarFacturas(idClienteActual)}
      style={{
        borderRadius: 10,
        padding: "8px 10px",
        border: "1px solid rgba(0,0,0,0.15)",
        background: "white",
        cursor: !idClienteActual || cargando ? "not-allowed" : "pointer",
        opacity: !idClienteActual || cargando ? 0.6 : 1,
      }}
      title={!idClienteActual ? "Primero busca un cliente" : "Recargar"}
    >
      Recargar
    </button>,
  ];

  const contenidoTabla = itemsPagina.map((factura) => [
    factura.idCliente,
    factura.servicio,
    factura.periodo,
    <span key={`monto-${factura.id}`}>{Number(factura.monto).toFixed(2)}</span>,
    <EstadosFactura
      factura={factura}
      color={
        factura.estado === "PENDIENTE"
          ? "inherit"
          : factura.estado === "PAGADO"
            ? "success"
            : "error"
      }
    />,
    <button
      key={`btn-${factura.id}`}
      type="button"
      onClick={() => alert(`Ver factura ${factura.id}`)}
      style={{
        borderRadius: 10,
        padding: "6px 10px",
        border: "1px solid rgba(0,0,0,0.15)",
        background: "white",
        cursor: "pointer",
      }}
    >
      Ver
    </button>,
  ]);

  const mostrarVacio =
    !cargando && !error && idClienteActual && facturas.length === 0;

  useEffect(() => {
    if (pagina > totalPaginas) {
      setPagina(totalPaginas);
    }
  }, [pagina, totalPaginas]);

  return (
    <div>
      <header>
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            borderRadius: 10,
            padding: "10px 15px",
            border: "1px solid rgba(0,0,0,0.15)",
            background: "white",
          }}
        >
          ← Volver
        </button>
        <h1 className="hero__titulo">
          Consulta y pago de facturas (Administrador)
        </h1>
        <p className="hero__subtitulo">
          Ingrese el identificador del cliente <strong>idCliente</strong> para
          consultar facturas y realizar el pago.
        </p>
      </header>

      <section className="card">
        <FormularioBusquedaCliente
          onBuscar={onBuscar}
          deshabilitado={cargando}
        />
      </section>

      <section className="card">
        {!cargando && error && (
          <div className="estado errorBox">
            <h3>Ocurrió un error</h3>
            <p className="muted">{error}</p>
          </div>
        )}

        {mostrarVacio && (
          <div className="estado">
            <h3>Sin facturas</h3>
            <p className="muted">
              No se encontraron facturas asociadas al Cliente ingresado.
            </p>
          </div>
        )}

        <CustomDataTable
          titulo="Facturas"
          error={!!error}
          cargando={cargando}
          acciones={acciones}
          filtros={filtros}
          columnas={columnas}
          contenidoTabla={contenidoTabla}
          paginacion={paginacion}
        />
      </section>
    </div>
  );
}
