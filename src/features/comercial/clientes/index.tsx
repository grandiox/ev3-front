import { useHasPermission } from '@/hooks/use-has-permission'
import { columns } from './components/clientes-columns'
import { ClientesTable } from './components/clientes-table'
import ClientesProvider, { useClientes } from './context/clientes-context'
import { ModulesLayout } from '@/components/layout/layout'
import { useQuery } from '@tanstack/react-query'
import { clientesApi } from '@/services/api/clientes'
import { Button } from '@/components/ui/button'
import { IconPlus, IconRefresh } from '@tabler/icons-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormularioCliente } from './formulario-cliente'
import type { Cliente } from '@/services/api/clientes'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import React from 'react'
import { CheckCircle, XCircle, PauseCircle } from 'lucide-react'

function ClientesContent() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['clientes'],
    queryFn: clientesApi.getAll,
  })
  const { setOpen, open, currentRow, setCurrentRow } = useClientes()
  const canWrite = useHasPermission('comercial:write')

  const handleCancelarForm = () => {
    setOpen(null)
    setCurrentRow(null)
  }

  const handleSuccess = () => {
    setOpen(null)
    refetch()
  }

  return (
    <ModulesLayout
      title="Clientes"
      subtitle="Gestión de clientes y sus datos"
      actions={
        <div className='flex gap-2'>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <IconRefresh className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setOpen('add')}
            disabled={isLoading || !canWrite}
            variant="default"
            size="sm"
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <IconPlus className="h-4 w-4 mr-2" />
            Nuevo
          </Button>
        </div>
      }
    >
      <ClientesTable data={data?.data || []} columns={columns} />

      <Dialog 
        open={open === 'add' || open === 'edit'} 
        onOpenChange={(open) => { 
          if (!open) {
            handleCancelarForm();
            setCurrentRow(null);
          }
        }}
      >
        <DialogContent className="p-6 overflow-y-auto flex flex-col max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>
              {open === 'edit' ? 'Editar Cliente' : 'Crear Cliente'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1">
            <FormularioCliente
              onCancel={handleCancelarForm}
              onSuccess={handleSuccess}
              cliente={open === 'edit' ? currentRow || undefined : undefined}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={open === 'view'} 
        onOpenChange={(open) => { 
          if (!open) {
            handleCancelarForm();
            setCurrentRow(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl min-w-[800px]">
          <DialogHeader>
            <DialogTitle>Detalle de Cliente</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">Cargando detalle...</div>
          ) : (currentRow as Cliente) && (
            <div className="space-y-6">
              {/* Información General */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información General</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground">Código</Label>
                        <p className="font-medium">{currentRow?.codigo || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Nombre</Label>
                        <p className="font-medium">{currentRow?.nombre || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Tipo</Label>
                        <p className="font-medium">{currentRow?.tipo || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Estado</Label>
                        <div className="flex items-center gap-2 mt-1">
                          {currentRow?.estado && (
                            <div className={`flex items-center gap-2 rounded-full px-2 py-1 ${
                              currentRow.estado === 'Activo' ? 'bg-green-100' :
                              currentRow.estado === 'Inactivo' ? 'bg-red-100' :
                              'bg-yellow-100'
                            }`}>
                              {currentRow.estado === 'Activo' && <CheckCircle className="h-4 w-4 text-green-600" />}
                              {currentRow.estado === 'Inactivo' && <XCircle className="h-4 w-4 text-red-600" />}
                              {currentRow.estado === 'Suspendido' && <PauseCircle className="h-4 w-4 text-yellow-600" />}
                              <span className={`text-sm font-medium ${
                                currentRow.estado === 'Activo' ? 'text-green-600' :
                                currentRow.estado === 'Inactivo' ? 'text-red-600' :
                                'text-yellow-600'
                              }`}>
                                {currentRow.estado}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground">Contacto</Label>
                        <p className="font-medium">{currentRow?.contacto || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Teléfono</Label>
                        <p className="font-medium">{currentRow?.telefono || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-medium">{currentRow?.email || '-'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dirección */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dirección</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground">Dirección</Label>
                        <p className="font-medium">{currentRow?.direccion || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Comuna</Label>
                        <p className="font-medium">{currentRow?.comuna || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Ciudad</Label>
                        <p className="font-medium">{currentRow?.ciudad || '-'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información Comercial */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Comercial</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground">Lista de Precios</Label>
                        <p className="font-medium">{currentRow?.listaPrecios || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Condición de Pago</Label>
                        <p className="font-medium">{currentRow?.condicionPago || '-'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notas */}
              {currentRow?.notas && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{currentRow.notas}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ModulesLayout>
  )
}

export default function Clientes() {
  return (
    <ClientesProvider>
      <ClientesContent />
    </ClientesProvider>
  )
} 