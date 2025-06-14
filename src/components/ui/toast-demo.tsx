"use client"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ToastDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => {
          toast("Este es un mensaje de prueba", {
            description: "Notificación",
          })
        }}
      >
        Mostrar Toast
      </Button>

      <Button
        variant="destructive"
        onClick={() => {
          toast.error("Este es un mensaje de error", {
            description: "Error",
          })
        }}
      >
        Mostrar Toast de Error
      </Button>
    </div>
  )
}