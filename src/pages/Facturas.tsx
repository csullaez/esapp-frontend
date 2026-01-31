import { useEffect, useMemo, useState } from "react";
import { CustomDataTable } from "../common/components/DataTable/CustomDataTable.tsx";
import { obtenerFacturasPorIdCliente } from "../api/facturas.api.ts";
import { useNavigate, useParams } from "react-router-dom";
import type {
  EstadoFactura,
  Factura,
} from "../modules/facturas/types/factura.ts";
import { ModalPago } from "../modules/facturas/ui/ModalPago.tsx";
import { EstadosFactura } from "../modules/facturas/ui/EstadosFactura.tsx";
import { ModalDetallePago } from "../modules/facturas/ui/ModalDetallePago.tsx";
import styles from "../modules/facturas/ui/facturas.module.css";

export default function Facturas() {
  const { idCliente } = useParams<{ idCliente: string }>();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [idClienteActual, setIdClienteActual] = useState<string>("");

  const [pagina, setPagina] = useState<number>(1);
  const paginaTamanio = 4;

  const [filtro, setFiltro] = useState<string>("");
  const [estado, setEstado] = useState<"" | Factura["estado"]>("");
  const navigate = useNavigate();

  const [facturaSeleccionada, setFacturaSeleccionada] =
    useState<Factura | null>(null);
  const [facturaDetallePago, setFacturaDetallePago] = useState<Factura | null>(
    null,
  );
  const [pagando, setPagando] = useState(false);

  const buscarFacturas = async (idCliente: string) => {
    if (!idCliente) return;
    setCargando(true);
    setError(null);
    try {
      const datos = await obtenerFacturasPorIdCliente(idCliente);
      setFacturas(datos);
      setPagina(1);
    } catch (e) {
      setFacturas([]);
      setError(
        e instanceof Error
          ? e.message
          : "Error desconocido al buscar facturas.",
      );
    } finally {
      setCargando(false);
    }
  };
  const pagarFactura = async (idFactura: number) => {
    setPagando(true);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 700));

      setFacturas((prev) =>
        prev.map((f) => (f.id === idFactura ? { ...f, estado: "PAGADO" } : f)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo procesar el pago.");
      throw e;
    } finally {
      setPagando(false);
    }
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
    { nombre: "Servicio" },
    { nombre: "Periodo" },
    { nombre: "Monto (Bs)" },
    { nombre: "Estado" },
    { nombre: "Acción" },
  ];

  const filtros = (
    <div className={styles.filtersRow}>
      <input
        className={`input ${styles.filtersInput}`}
        value={filtro}
        onChange={(e) => {
          setPagina(1);
          setFiltro(e.target.value);
        }}
        placeholder="Buscar por servicio, periodo o monto…"
      />

      <select
        className={`select ${styles.filtersSelect}`}
        value={estado}
        onChange={(e) => {
          setPagina(1);
          setEstado(e.target.value as EstadoFactura);
        }}
      >
        <option value="">Todos</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="PAGADO">Pagado</option>
      </select>
    </div>
  );

  const paginacion = (
    <div className={styles.paginationRow}>
      <div className={styles.paginationMeta}>
        Página {pagina} de {totalPaginas} — {filtrado.length} registros
      </div>

      <div className={styles.paginationBtns}>
        <button
          type="button"
          disabled={pagina <= 1 || cargando}
          onClick={() => setPagina((p) => Math.max(1, p - 1))}
          className="btn btnGhost"
        >
          Anterior
        </button>

        <button
          type="button"
          disabled={pagina >= totalPaginas || cargando}
          onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
          className="btn btnGhost"
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
    (factura.estado === "PENDIENTE" && (
      <button
        key={`btn-${factura.id}`}
        type="button"
        onClick={() => setFacturaSeleccionada(factura)}
        style={{
          borderRadius: 10,
          padding: "6px 10px",
          border: "1px solid rgba(0,0,0,0.15)",
          background: "white",
          cursor: "pointer",
        }}
      >
        Pagar
      </button>
    )) ||
      (factura.estado === "PAGADO" && (
        <button
          key={`btn-${factura.id}`}
          type="button"
          onClick={() => setFacturaDetallePago(factura)}
          style={{
            borderRadius: 10,
            padding: "6px 10px",
            border: "1px solid rgba(0,0,0,0.15)",
            background: "white",
            cursor: "pointer",
          }}
        >
          Ver
        </button>
      )),
  ]);

  const mostrarVacio =
    !cargando && !error && idClienteActual && facturas.length === 0;

  useEffect(() => {
    if (!idCliente) {
      navigate("/", { replace: true });
      return;
    }

    setIdClienteActual(idCliente);
    buscarFacturas(idCliente);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idCliente]);

  return (
    <div>
      <header>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            borderRadius: 10,
            padding: "10px 15px",
            border: "1px solid rgba(0,0,0,0.15)",
            background: "white",
          }}
        >
          ← Volver
        </button>
        <h1 className="hero__titulo"> Consulta y pago de facturas </h1>
        <p className="hero__subtitulo">
          Identificador del cliente ingresado: {idCliente}
        </p>
      </header>

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
