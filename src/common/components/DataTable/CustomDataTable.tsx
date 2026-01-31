import { useEffect, useState, type ReactNode } from "react";
import styles from "./CustomDataTable.module.css";

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
    <div className={styles.skelList}>
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
    <div className={styles.root}>
      <div className={styles.headerRow}>
        <div className={styles.titleWrap}>
          {titulo ? (
            <div className={styles.title}>{titulo}</div>
          ) : tituloPersonalizado ? (
            <>{tituloPersonalizado}</>
          ) : (
            <div />
          )}
        </div>

        <div className={styles.actionsWrap}>
          {acciones.map((accion, index) => (
            <div key={`accion-id-${index}`}>{accion}</div>
          ))}
        </div>
      </div>

      <div
        className={styles.filters}
        style={{
          paddingTop: filtros ? 8 : 16,
          paddingBottom: filtros ? 24 : 8,
        }}
      >
        {filtros}
      </div>

      <div className={styles.cardContainer}>
        {error ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyText}>Error obteniendo información</div>
          </div>
        ) : contenidoTabla.length === 0 && !cargando ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyText}>Sin registros</div>
          </div>
        ) : (
          <div className={styles.content}>
            {xs ? (
              cargando ? (
                <ListSkeleton filas={8} />
              ) : (
                <div className={styles.cards}>
                  {contenidoTabla.map((contenidoFila, rowIndex) => (
                    <div className={styles.card} key={`row-id-${rowIndex}`}>
                      <div className={styles.cardBody}>
                        {contenidoFila.map((contenido, colIndex) => (
                          <div
                            className={styles.cardRow}
                            key={`cardrow-${rowIndex}-${colIndex}`}
                          >
                            <div className={styles.cardLabel}>
                              {columnas[colIndex]?.nombre ?? ""}
                            </div>
                            <div className={styles.cardValue}>{contenido}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {columnas.map((columna, index) => (
                        <th className={styles.th} key={`cabecera-id-${index}`}>
                          <span className={styles.thText}>{columna.nombre}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {cargando ? (
                    <TableSkeletonBody filas={8} columnas={columnas.length} />
                  ) : (
                    <tbody>
                      {contenidoTabla.map((contenidoFila, rowIndex) => (
                        <tr className={styles.tr} key={`row-id-${rowIndex}`}>
                          {contenidoFila.map((contenido, colIndex) => (
                            <td
                              className={styles.td}
                              key={`celda-id-${rowIndex}-${colIndex}`}
                            >
                              <div className={styles.fadeIn}>{contenido}</div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            )}

            {paginacion ? (
              <div className={styles.pagination}>{paginacion}</div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
