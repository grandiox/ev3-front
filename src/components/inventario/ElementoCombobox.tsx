import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";

interface Elemento {
  id: number;
  nombre: string;
  codigo: string;
}

interface ElementoComboboxProps {
  elementos: Elemento[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ElementoCombobox({ elementos, value, onChange, disabled, placeholder }: ElementoComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = elementos.find(e => e.id.toString() === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selected ? (
            <span>{selected.codigo} - {selected.nombre}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder || "Seleccione un elemento"}</span>
          )}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Buscar elemento..." />
          <CommandList>
            <CommandEmpty>No se encontraron elementos.</CommandEmpty>
            {elementos.map((elemento) => (
              <CommandItem
                key={elemento.id}
                value={elemento.id.toString()}
                onSelect={() => {
                  onChange(elemento.id.toString());
                  setOpen(false);
                }}
              >
                <CheckIcon
                  className={`mr-2 h-4 w-4 ${value === elemento.id.toString() ? "opacity-100" : "opacity-0"}`}
                />
                {elemento.codigo} - {elemento.nombre}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 