"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Fraction, PartitionPoint } from "./Point";
import { useEffect, useState } from "react";
import { endPoint, startPoint } from "./Monochord";
import { Plus } from "lucide-react";

export const AddPointDialog = ({
  points,
  onAdd,
}: {
  points: PartitionPoint[];
  onAdd: (
    label: string,
    start: PartitionPoint,
    end: PartitionPoint,
    fraction: Fraction
  ) => void;
}) => {
  const [label, setLabel] = useState("");
  const [start, setStart] = useState<PartitionPoint>(startPoint);
  const [end, setEnd] = useState<PartitionPoint>(endPoint);
  const [fraction, setFraction] = useState<{
    numerator: number;
    denominator: number;
  }>({ numerator: 1, denominator: 1 });

  const onLabelChange = (v: string) => {
    setLabel(v);
  };

  const onStartChange = (id: string) => {
    setStart(points.find((point) => point.id === id) as PartitionPoint);
  };
  const onEndChange = (id: string) => {
    setEnd(points.find((point) => point.id === id) as PartitionPoint);
  };

  const onNumeratorChange = (numerator: number) => {
    setFraction({ ...fraction, numerator });
  };
  const onDenominatorChange = (denominator: number) => {
    setFraction({ ...fraction, denominator });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          Add partition
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add partition</DialogTitle>
          <DialogDescription>
            Add new partition points based on a range and a fraction.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="label">Label</Label>
            <Input id="label" onChange={(v) => onLabelChange(v.target.value)} />
          </div>
        </div>
        <div>
          <Label>Range</Label>
          <div className="flex gap-2 justify-between" id="range">
            <Select onValueChange={(v) => onStartChange(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="start" />
              </SelectTrigger>
              <SelectContent>
                {points.map((point) => (
                  <SelectItem key={point.label} value={point.id}>
                    {point.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => onEndChange(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="end" />
              </SelectTrigger>
              <SelectContent>
                {points.map((point) => (
                  <SelectItem key={point.label} value={point.id}>
                    {point.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>Fraction</Label>
          <div id="fraction" className="flex gap-10">
            <Input
              id="numerator"
              type="number"
              placeholder="numerator"
              onChange={(v) => onNumeratorChange(parseInt(v.target.value))}
            />
            <Input
              id="denominator"
              type="number"
              placeholder="denominator"
              onChange={(v) => onDenominatorChange(parseInt(v.target.value))}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="submit"
              onClick={() => onAdd(label, start, end, fraction)}
            >
              Add
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
