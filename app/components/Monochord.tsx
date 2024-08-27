"use client";

import { Fraction, PartitionPoint, Point } from "./Point";
import { AddPointDialog } from "./AddPointDialog";
import { useEffect, useRef, useState } from "react";
import { getSynth, pointPosition } from "./Utils";
import CustomPopover from "./CirclePopover";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Tone from "tone";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const w = 1000;
const h = 100;
const m = 50;
const BASE_FREQ = 220;

export const startPoint = new PartitionPoint({
  x: m,
  y: m,
  label: "a",
  position: {
    numerator: 0,
    denominator: 1,
  },
});
startPoint.id = "start";

export const endPoint = new PartitionPoint({
  x: w - m,
  y: m,
  label: "b",
  position: {
    numerator: 1,
    denominator: 1,
  },
});
endPoint.id = "end";

export const Monochord = () => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<PartitionPoint[]>([
    startPoint,
    endPoint,
  ]);
  const [baseFreq, setBaseFreq] = useState(BASE_FREQ);
  const [lFreq, setLFreq] = useState(baseFreq);
  const [rFreq, setRFreq] = useState(baseFreq);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [bridgeId, setBridgeId] = useState(endPoint.id);

  const [selectedPoint, setSelectedPoint] = useState<PartitionPoint | null>(
    null
  );

  const handleCircleClick = (
    event: React.MouseEvent<SVGCircleElement, MouseEvent>,
    point: PartitionPoint
  ) => {
    const circle = event.currentTarget; // Get the clicked circle
    const { clientX } = event;

    const circleRect = circle.getBoundingClientRect();
    setPopoverOpen(true);
    setSelectedPoint(point);

    const popoverWidth = popoverRef.current?.offsetWidth || 110;

    setPopoverPosition({
      x: clientX - popoverWidth / 2,
      y: circleRect.top - 150,
    });
  };

  const onRemove = () => {
    if (
      selectedPoint?.id === startPoint.id ||
      selectedPoint?.id === endPoint.id
    ) {
      setPopoverOpen(false);
      return;
    }
    setPoints(points.filter((point) => selectedPoint?.id !== point.id));
    setPopoverOpen(false);
  };

  const onAddPartition = (
    label: string,
    start: PartitionPoint,
    end: PartitionPoint,
    fraction: Fraction
  ) => {
    if (start.x > end.x) {
      let tmp = start;
      start = end;
      end = tmp;
    }
    const divide = fraction.numerator / fraction.denominator;
    const x = start.x + (end.x - start.x) * divide;
    const y = start.y;
    const point = new PartitionPoint({
      x,
      y,
      label,
      position: pointPosition(start.position, end.position, fraction),
    });

    setPoints([...points, point]);
  };

  useEffect(() => {
    const point = points.find(
      (point) => point.id === bridgeId
    ) as PartitionPoint;
    const position = point.position;
    const freq = baseFreq / (position.numerator / position.denominator);
    setLFreq(freq);
    const rFreq =
      baseFreq /
      ((position.denominator - position.numerator) / position.denominator);
    setRFreq(rFreq === Infinity ? baseFreq : rFreq);
  }, [baseFreq, points, bridgeId]);

  const onLPlay = async () => {
    const synth = getSynth();
    synth?.triggerAttackRelease(lFreq, 1.5);
  };

  const onRPlay = async () => {
    const synth = getSynth();
    synth?.triggerAttackRelease(rFreq, 1.5);
  };

  const onSetBridge = (pointId: string) => {
    points.forEach((point) => point.unselect());
    const point = points.find(
      (point) => point.id === pointId
    ) as PartitionPoint;
    setBridgeId(pointId);
    point.select();
    setPoints([...points]);
    const position = point.position;
    const freq = baseFreq / (position.numerator / position.denominator);
    setLFreq(freq);
    const rFreq =
      baseFreq /
      ((position.denominator - position.numerator) / position.denominator);
    setRFreq(rFreq === Infinity ? baseFreq : rFreq);
  };

  const onFreqChange = (value: string) => {
    setBaseFreq(parseInt(value));
  };

  return (
    <div>
      <div className="p-4 m-5  bg-stone-100">
        <svg xmlns="http://www.w3.org/2000/svg" width={w} height={h}>
          <line
            x1={m}
            y1={m}
            x2={w - m}
            y2={m}
            stroke="black"
            strokeWidth="2"
          />

          {points.map((point) => (
            <Point
              key={point.id}
              point={point}
              onClick={(e) => handleCircleClick(e, point)}
            />
          ))}
        </svg>
      </div>
      <CustomPopover
        isOpen={popoverOpen}
        onClose={() => setPopoverOpen(false)}
        position={popoverPosition}
        label={selectedPoint?.label || ""}
        fraction={selectedPoint?.fractionToString() || ""}
        onRemove={onRemove}
        onLabelChange={(label) =>
          selectedPoint && (selectedPoint.label = label)
        }
        ref={popoverRef}
      />
      <div className="flex gap-1 justify-center">
        <Button variant="default" onClick={() => onLPlay()}>
          <Play /> Left
        </Button>
        <Button variant="default" onClick={() => onRPlay()}>
          <Play /> Right
        </Button>
      </div>
      <div className="flex gap-4 justify-center items-center p-2">
        <AddPointDialog onAdd={onAddPartition} points={points}></AddPointDialog>
        <Select onValueChange={(v) => onSetBridge(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Bridge" />
          </SelectTrigger>
          <SelectContent>
            {points
              .filter((p) => p.id !== startPoint.id)
              .map((point) => (
                <SelectItem key={point.label} value={point.id}>
                  {point.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1 justify-center items-center">
          <Label htmlFor="baseFreq">Frequency</Label>
          <Input
            className="w-[100px]"
            id="baseFreq"
            type="number"
            onChange={(v) => onFreqChange(v.target.value)}
            defaultValue={baseFreq}
          />
        </div>
      </div>
    </div>
  );
};
