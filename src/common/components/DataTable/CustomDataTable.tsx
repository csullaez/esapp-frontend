import { useEffect, useState, type ReactNode } from "react";

export interface CustomDataTableBasicProps {
  titulo?: string;
  tituloPersonalizado?: ReactNode;
  error?: boolean;
  cargando?: boolean;
  acciones?: Array<ReactNode>;
  columnas: Array<{ nombre: string }>;
  filtros?: ReactNode;
  contenidoTabla: Array<Array<ReactNode>>;
  paginacion?: ReactNode;
}

/** Hook simple para responsividad (similar al xs de MUI). */
function useIsXs(maxWidthPx = 600) {
  const [isXs, setIsXs] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${maxWidthPx}px)`).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(`(max-width: ${maxWidthPx}px)`);
    const handler = () => setIsXs(mql.matches);

    if (mql.addEventListener) mql.addEventListener("change", handler);
    else mql.addListener(handler);

    handler();
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else mql.removeListener(handler);
    };
  }, [maxWidthPx]);

  return isXs;
}

function ListSkeleton({ filas = 8 }: { filas?: number }) {
  return (
    <div className="cdt-skelList">
      {Array.from({ length: filas }).map((_, i) => (
        <div key={i} className="cdt-skelCard" />
      ))}
    </div>
  );
}

function TableSkeletonBody({
  filas = 8,
  columnas = 5,
}: {
  filas?: number;
  columnas?: number;
}) {
  return (
    <tbody>
      {Array.from({ length: filas }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: columnas }).map((__, c) => (
            <td key={c}>
              <div className="cdt-skelCell" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export const CustomDataTable = ({
  titulo,
  tituloPersonalizado,
  error = false,
  cargando = false,
  acciones = [],
  columnas,
  filtros,
  contenidoTabla,
  paginacion,
}: CustomDataTableBasicProps) => {
  const xs = useIsXs(600);

  return (
    <div className="cdt-root">
      {/* Título y acciones */}
      <div className="cdt-headerRow">
        <div className="cdt-titleWrap">
          {titulo ? (
            <div className="cdt-title">{titulo}</div>
          ) : tituloPersonalizado ? (
            <>{tituloPersonalizado}</>
          ) : (
            <div />
          )}
        </div>

        <div className="cdt-actionsWrap">
          {acciones.map((accion, index) => (
            <div key={`accion-id-${index}`}>{accion}</div>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div
        className="cdt-filters"
        style={{ paddingTop: filtros ? 8 : 16, paddingBottom: filtros ? 24 : 8 }}
      >
        {filtros}
      </div>

      {/* Contenedor */}
      <div className="cdt-cardContainer">
        {error ? (
          <div className="cdt-emptyState">
            <div className="cdt-emptyText">Error obteniendo información</div>
          </div>
        ) : contenidoTabla.length === 0 && !cargando ? (
          <div className="cdt-emptyState">
            <div className="cdt-emptyText">Sin registros</div>
          </div>
        ) : (
          <div className="cdt-content">
            {/* Mobile => Cards */}
            {xs ? (
              cargando ? (
                <ListSkeleton filas={8} />
              ) : (
                <div className="cdt-cards">
                  {contenidoTabla.map((contenidoFila, rowIndex) => (
                    <div className="cdt-card" key={`row-id-${rowIndex}`}>
                      <div className="cdt-cardBody">
                        {contenidoFila.map((contenido, colIndex) => (
                          <div
                            className="cdt-cardRow"
                            key={`cardrow-${rowIndex}-${colIndex}`}
                          >
                            <div className="cdt-cardLabel">
                              {columnas[colIndex]?.nombre ?? ""}
                            </div>
                            <div className="cdt-cardValue">{contenido}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* Desktop => Table */
              <div className="cdt-tableWrap">
                <table className="cdt-table">
                  <thead>
                    <tr>
                      {columnas.map((columna, index) => (
                        <th className="cdt-th" key={`cabecera-id-${index}`}>
                          <span className="cdt-thText">{columna.nombre}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {cargando ? (
                    <TableSkeletonBody filas={8} columnas={columnas.length} />
                  ) : (
                    <tbody>
                      {contenidoTabla.map((contenidoFila, rowIndex) => (
                        <tr className="cdt-tr" key={`row-id-${rowIndex}`}>
                          {contenidoFila.map((contenido, colIndex) => (
                            <td
                              className="cdt-td"
                              key={`celda-id-${rowIndex}-${colIndex}`}
                            >
                              <div className="cdt-fadeIn">{contenido}</div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            )}

            {/* Paginación */}
            {paginacion ? <div className="cdt-pagination">{paginacion}</div> : null}
          </div>
        )}
      </div>

      {/* Estilos */}
      <style>{`
        .cdt-root { padding-bottom: 16px; }
        .cdt-headerRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .cdt-titleWrap { min-width: 0; }
        .cdt-title {
          font-size: 20px;
          font-weight: 600;
          padding-left: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cdt-actionsWrap {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          flex-wrap: wrap;
        }

        .cdt-filters { padding-left: 0px; }

        .cdt-cardContainer {
          border-radius: 16px;
          padding: 0;
        }

        .cdt-emptyState {
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 16px;
          padding: 28px 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff;
        }
        .cdt-emptyText {
          font-size: 14px;
          color: rgba(0,0,0,0.75);
        }

        .cdt-pagination { margin-top: 8px; }

        /* TABLE */
        .cdt-tableWrap {
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 16px;
          overflow: hidden;
          background: #fff;
        }
        .cdt-table { width: 100%; border-collapse: collapse; }
        .cdt-th, .cdt-td {
          padding: 12px 12px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          text-align: left;
          vertical-align: middle;
        }
        .cdt-th { background: #fff; font-size: 12px; font-weight: 600; color: rgba(0,0,0,0.85); }
        .cdt-tr:hover { background: rgba(0,0,0,0.02); }
        .cdt-thText { font-size: 12px; font-weight: 600; }

        .cdt-fadeIn { animation: cdtFadeIn 180ms ease-out; }
        @keyframes cdtFadeIn {
          from { opacity: 0; transform: translateY(1px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* MOBILE CARDS */
        .cdt-cards { display: flex; flex-direction: column; gap: 12px; }
        .cdt-card {
          border: 1px solid rgba(0,0,0,0.10);
          border-radius: 16px;
          background: #fff;
        }
        .cdt-cardBody { padding: 14px 14px 10px 14px; }
        .cdt-cardRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 6px 0;
        }
        .cdt-cardLabel {
          font-size: 12px;
          color: rgba(0,0,0,0.60);
          flex: 1;
          min-width: 0;
        }
        .cdt-cardValue {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          min-width: 0;
        }

        /* Skeletons */
        .cdt-skelList { display: flex; flex-direction: column; gap: 12px; }
        .cdt-skelCard {
          height: 92px;
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.06);
          background: linear-gradient(90deg, rgba(0,0,0,0.04), rgba(0,0,0,0.08), rgba(0,0,0,0.04));
          background-size: 200% 100%;
          animation: cdtShimmer 1.1s infinite;
        }
        .cdt-skelCell {
          height: 14px;
          border-radius: 8px;
          background: linear-gradient(90deg, rgba(0,0,0,0.04), rgba(0,0,0,0.08), rgba(0,0,0,0.04));
          background-size: 200% 100%;
          animation: cdtShimmer 1.1s infinite;
        }
        @keyframes cdtShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 600px) {
          .cdt-title { font-size: 18px; padding-left: 4px; }
          .cdt-th, .cdt-td { padding: 10px 10px; }
        }
      `}</style>
    </div>
  );
};
