"use client";
export const Point = ({
  point,
  onClick,
}: {
  point: PartitionPoint;
  onClick: (event: React.MouseEvent<SVGCircleElement, MouseEvent>) => void;
}) => {
  const { x, y, r, fill, label } = point;
  return (
    <>
      <circle
        className="cursor-pointer"
        cx={x}
        cy={y}
        r={r}
        fill={fill}
        onClick={onClick}
      ></circle>
      ;
      <text x={x} y={y + r + 20} fill={fill} textAnchor="middle">
        {label}
      </text>
      <text
        x={x}
        y={y + r + 40}
        fill={fill}
        textAnchor="middle"
        fontSize="0.8em"
      >
        {point.fractionToString()}
      </text>
    </>
  );
};

export class PartitionPoint {
  public x: number;
  public y: number;
  public r: number;
  public label: string;
  public position: Fraction;
  public fill = "#404040";
  public id = "";

  constructor({
    x,
    y,
    label,
    position,
  }: {
    x: number;
    y: number;
    label: string;
    position: Fraction;
  }) {
    this.x = x;
    this.y = y;
    this.r = 5;
    this.label = label;
    this.position = position;
    this.id = label.toLowerCase();
  }

  public fractionToString() {
    return `${this.position.numerator}/${this.position.denominator}`;
  }

  public select() {
    this.fill = "#f099da";
    this.r = 6;
  }

  public unselect() {
    this.fill = "#404040";
    this.r = 5;
  }
}

export interface Fraction {
  numerator: number;
  denominator: number;
}
