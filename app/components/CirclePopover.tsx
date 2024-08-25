import React, { forwardRef } from "react";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CustomPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  label: string;
  fraction: string;
  onRemove: () => void;
  onLabelChange: (label: string) => void;
}

const CustomPopover = (
  {
    isOpen,
    onClose,
    position,
    label,
    fraction,
    onRemove,
    onLabelChange,
  }: CustomPopoverProps,
  ref: React.Ref<HTMLDivElement>
) => {
  if (!isOpen) return null;

  return (
    <Popover open={isOpen} onOpenChange={onClose}>
      <PopoverContent
        className="w-35"
        style={{ position: "absolute", left: position.x, top: position.y }}
      >
        <div className="grid gap-4" ref={ref}>
          <div className="grid flex-1 gap-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              onChange={(v) => onLabelChange(v.target.value)}
              defaultValue={label}
            />
          </div>
          <div className="space-y-2">
            <Button type="button" onClick={() => onRemove()}>
              <Trash className="mr-2 h-4 w-4" /> Remove
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default forwardRef(CustomPopover);
