import { useEffect, useId, useRef } from "react";

type Props = {
  abierta: boolean;
  titulo?: string;
  children: React.ReactNode;
  onCerrar: () => void;
  acciones?: React.ReactNode;
  bloquearCierre?: boolean; // útil mientras procesa
};

export function Modal({
  abierta,
  titulo,
  children,
  onCerrar,
  acciones,
  bloquearCierre = false,
}: Props) {
  const tituloId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!abierta) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !bloquearCierre) onCerrar();
    };

    document.addEventListener("keydown", onKeyDown);

    // bloquear scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // enfoque inicial
    const prevActive = document.activeElement as HTMLElement | null;
    setTimeout(() => panelRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      prevActive?.focus?.();
    };
  }, [abierta, onCerrar, bloquearCierre]);

  if (!abierta) return null;

  return (
    <div
      className="modalOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titulo ? tituloId : undefined}
      onMouseDown={(e) => {
        if (bloquearCierre) return;
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div
        className="modal"
        tabIndex={-1}
        ref={panelRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modalHeader">
          {titulo && (
            <h3 className="modalTitulo" id={tituloId}>
              {titulo}
            </h3>
          )}
          <button
            className="btn btn--ghost"
            type="button"
            onClick={onCerrar}
            disabled={bloquearCierre}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="modalBody">{children}</div>

        {acciones && <div className="modalAcciones">{acciones}</div>}
      </div>
    </div>
  );
}
