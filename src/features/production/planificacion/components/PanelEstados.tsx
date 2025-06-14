// import { Badge } from "@/components/ui/badge"
import { COLORES_ESTADO } from "../constants"

interface PanelEstadosProps {
  resumen: {
    Programada: number
    'En Preparacion': number
    'En Proceso': number
    Pausada: number
    Finalizada: number
    Cancelada: number
  }
}

export function PanelEstados({ resumen }: PanelEstadosProps) {
  return (
    <div
      className="w-full overflow-x-auto border-b border-muted bg-transparent mb-4"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="flex flex-nowrap gap-2 px-2 py-2 min-w-max">
        {Object.entries(resumen).map(([estado, cantidad]) => (
          <div key={estado} className="flex items-center">
            <span
              className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-150 select-none cursor-default shadow-none border border-transparent hover:border-muted-foreground/20 hover:shadow-sm"
              style={{
                backgroundColor: COLORES_ESTADO[estado as keyof typeof COLORES_ESTADO],
                color: '#fff',
                minWidth: 0,
              }}
            >
              <span className="truncate max-w-[80px]">{estado}</span>
              <span
                className="ml-1 flex items-center justify-center rounded-full bg-white text-xs font-bold"
                style={{
                  color: COLORES_ESTADO[estado as keyof typeof COLORES_ESTADO],
                  width: 18,
                  height: 18,
                  minWidth: 18,
                  minHeight: 18,
                  fontSize: 12,
                }}
              >
                {cantidad}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 