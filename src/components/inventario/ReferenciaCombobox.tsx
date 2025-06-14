import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";

interface Referencia {
  id: number;
  codigo?: string;
}

interface ReferenciaComboboxProps {
  referencias: Referencia[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ReferenciaCombobox({ referencias, value, onChange, disabled, placeholder }: ReferenciaComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = referencias.find(r => r.id.toString() === value);

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
            <span>{selected.codigo || selected.id}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder || "Seleccione una referencia"}</span>
          )}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar referencia..." />
          <CommandList>
            <CommandEmpty>No se encontraron referencias.</CommandEmpty>
            {referencias.map((ref) => (
              <CommandItem
                key={ref.id}
                value={ref.id.toString()}
                onSelect={() => {
                  onChange(ref.id.toString());
                  setOpen(false);
                }}
              >
                <CheckIcon
                  className={`mr-2 h-4 w-4 ${value === ref.id.toString() ? "opacity-100" : "opacity-0"}`}
                />
                {ref.codigo || ref.id}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 