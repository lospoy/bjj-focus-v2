// I made this thing from scratch, copilot refactored it

type IconProps = React.HTMLAttributes<SVGElement>;

type BeltProps = IconProps & {
  numberOfStripes: number;
  beltColor: "white" | "blue" | "purple" | "brown" | "black";
};

export const Belt = (props: BeltProps) => {
  const { numberOfStripes, beltColor } = props;

  const color = {
    white: "#faf8f2",
    blue: "#4763af",
    purple: "#9a4eaf",
    brown: "#68452e",
    black: "#110808",
    red: "#8f3131",
  };

  const renderStripes = () => {
    const stripes = [];

    for (let i = 1; i <= numberOfStripes; i++) {
      const x = 32 + (i - 1) * 14;
      const incline = Math.random() * 1; // Making it slightly random to give it a more natural look
      const width = 7 + Math.random() * 3 - 0.000001; // Making it slightly random to give it a more natural look
      stripes.push(
        <>
          <rect
            key={`${i}-stripe`}
            y={0}
            x={x}
            width={width}
            height="120%"
            fill={color.white}
            transform={`rotate(${incline} 0 0)`} // Apply rotation transform
            stroke={color.black} // Add left border color
            strokeWidth={0.2} // Set left border width
          />
        </>,
      );
    }

    return stripes;
  };

  const renderLines = () => {
    const lines = [];

    const linePositions = [
      { x1: 0, y1: "25%", x2: "20%", y2: "25%" },
      { x1: 0, y1: "50%", x2: "20%", y2: "50%" },
      { x1: 0, y1: "75%", x2: "20%", y2: "75%" },
      { x1: "52%", y1: "25%", x2: "100%", y2: "25%" },
      { x1: "52%", y1: "50%", x2: "100%", y2: "50%" },
      { x1: "52%", y1: "75%", x2: "100%", y2: "75%" },
    ];

    for (let i = 0; i < linePositions.length; i++) {
      const { x1, y1, x2, y2 } = linePositions[i] as {
        x1: string | number;
        y1: string | number;
        x2: string | number;
        y2: string | number;
      };
      lines.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#000"
          strokeWidth={0.2}
          strokeDasharray="2 2"
        />,
      );
    }

    return lines;
  };

  return (
    <svg width={100} height={20} xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* BELT COLOR */}
      <rect y={2} width="100%" height="92%" fill={color[beltColor]} />

      {/* BAR COLOR */}
      {beltColor !== "black" ? (
        <rect
          y={1}
          x={22}
          width="45%"
          height="100%"
          fill={color.black}
          rx={0.5}
          ry={4}
        />
      ) : (
        <rect
          y={2}
          x={22}
          width="45%"
          height="100%"
          fill={color.red}
          rx={1}
          ry={4}
        />
      )}

      {/* STRIPES */}
      {renderStripes()}

      {/* TINY DASHED LINES TO GIVE THE BELT TEXTURE */}
      {renderLines()}
    </svg>
  );
};
