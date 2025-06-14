import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";

interface Lote {
  id: number;
  codigoLote: string;
}

interface LoteComboboxProps {
  lotes: Lote[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function LoteCombobox({ lotes, value, onChange, disabled, placeholder }: LoteComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = lotes.find(l => l.id.toString() === value);

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
            <span>{selected.codigoLote}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder || "Seleccione un lote"}</span>
          )}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar lote..." />
          <CommandList>
            <CommandEmpty>No se encontraron lotes.</CommandEmpty>
            {lotes.map((lote) => (
              <CommandItem
                key={lote.id}
                value={lote.id.toString()}
                onSelect={() => {
                  onChange(lote.id.toString());
                  setOpen(false);
                }}
              >
                <CheckIcon
                  className={`mr-2 h-4 w-4 ${value === lote.id.toString() ? "opacity-100" : "opacity-0"}`}
                />
                {lote.codigoLote}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 