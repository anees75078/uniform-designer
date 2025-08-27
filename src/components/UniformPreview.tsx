interface UniformColors {
  shirtBody: string;
  shirtCollar: string;
  shirtSleeves: string;
  shirtCuffs: string;
  shirtButtons: string;
  shirtPocket: string;
  pantsBody: string;
  pantsWaistband: string;
  pantsSeams: string;
  pantsPockets: string;
}

interface UniformPreviewProps {
  colors: UniformColors;
  onPartSelect: (part: keyof UniformColors) => void;
  selectedPart: keyof UniformColors;
}

export const UniformPreview = ({ colors, onPartSelect, selectedPart }: UniformPreviewProps) => {
  const handlePartClick = (part: keyof UniformColors) => {
    onPartSelect(part);
  };

  const getPartClassName = (part: keyof UniformColors) => {
    const baseClass = "cursor-pointer transition-all duration-200 hover:opacity-80";
    const isSelected = selectedPart === part;
    return `${baseClass} ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`;
  };

  return (
    <div className="flex justify-center items-center gap-8 min-h-[600px] p-4">
      {/* Shirt */}
      <div className="relative">
        <svg width="200" height="280" viewBox="0 0 200 280" className="drop-shadow-lg">
          {/* Shirt Body */}
          <path
            d="M50 80 L50 260 Q50 270 60 270 L140 270 Q150 270 150 260 L150 80"
            fill={colors.shirtBody}
            stroke="#2C3E50"
            strokeWidth="2"
            className={getPartClassName("shirtBody")}
            onClick={() => handlePartClick("shirtBody")}
          />
          
          {/* Shirt Sleeves */}
          <path
            d="M50 80 L20 100 L15 140 L25 145 L50 120"
            fill={colors.shirtSleeves}
            stroke="#2C3E50"
            strokeWidth="2"
            className={getPartClassName("shirtSleeves")}
            onClick={() => handlePartClick("shirtSleeves")}
          />
          <path
            d="M150 80 L180 100 L185 140 L175 145 L150 120"
            fill={colors.shirtSleeves}
            stroke="#2C3E50"
            strokeWidth="2"
            className={getPartClassName("shirtSleeves")}
            onClick={() => handlePartClick("shirtSleeves")}
          />
          
          {/* Shirt Cuffs */}
          <rect
            x="15"
            y="135"
            width="15"
            height="15"
            fill={colors.shirtCuffs}
            stroke="#2C3E50"
            strokeWidth="2"
            className={getPartClassName("shirtCuffs")}
            onClick={() => handlePartClick("shirtCuffs")}
          />
          <rect
            x="170"
            y="135"
            width="15"
            height="15"
            fill={colors.shirtCuffs}
            stroke="#2C3E50"
            strokeWidth="2"
            className={getPartClassName("shirtCuffs")}
            onClick={() => handlePartClick("shirtCuffs")}
          />
          
          {/* Shirt Collar */}
          <path
            d="M70 80 L100 60 L130 80 L120 90 L100 80 L80 90 Z"
            fill={colors.shirtCollar}
            stroke="#2C3E50"
            strokeWidth="2"
            className={getPartClassName("shirtCollar")}
            onClick={() => handlePartClick("shirtCollar")}
          />
          
          {/* Shirt Pocket */}
          <rect
            x="70"
            y="120"
            width="25"
            height="20"
            fill={colors.shirtPocket}
            stroke="#2C3E50"
            strokeWidth="1.5"
            className={getPartClassName("shirtPocket")}
            onClick={() => handlePartClick("shirtPocket")}
          />
          
          {/* Shirt Buttons */}
          <circle
            cx="100"
            cy="100"
            r="3"
            fill={colors.shirtButtons}
            className={getPartClassName("shirtButtons")}
            onClick={() => handlePartClick("shirtButtons")}
          />
          <circle
            cx="100"
            cy="120"
            r="3"
            fill={colors.shirtButtons}
            className={getPartClassName("shirtButtons")}
            onClick={() => handlePartClick("shirtButtons")}
          />
          <circle
            cx="100"
            cy="140"
            r="3"
            fill={colors.shirtButtons}
            className={getPartClassName("shirtButtons")}
            onClick={() => handlePartClick("shirtButtons")}
          />
          <circle
            cx="100"
            cy="160"
            r="3"
            fill={colors.shirtButtons}
            className={getPartClassName("shirtButtons")}
            onClick={() => handlePartClick("shirtButtons")}
          />
          <circle
            cx="100"
            cy="180"
            r="3"
            fill={colors.shirtButtons}
            className={getPartClassName("shirtButtons")}
            onClick={() => handlePartClick("shirtButtons")}
          />
        </svg>
      </div>

      {/* Pants Front View */}
      <div className="relative">
        <svg width="160" height="280" viewBox="0 0 160 280" className="drop-shadow-lg">
          {/* Pants Body */}
          <path
            d="M40 20 L120 20 L115 280 L85 280 L80 200 L75 280 L45 280 Z"
            fill={colors.pantsBody}
            stroke="#2C3E50"
            strokeWidth="2"
            className={getPartClassName("pantsBody")}
            onClick={() => handlePartClick("pantsBody")}
          />
          
          {/* Pants Waistband */}
          <rect
            x="40"
            y="20"
            width="80"
            height="15"
            fill={colors.pantsWaistband}
            stroke="#2C3E50"
            strokeWidth="2"
            className={getPartClassName("pantsWaistband")}
            onClick={() => handlePartClick("pantsWaistband")}
          />
          
          {/* Belt Loops */}
          <rect x="50" y="15" width="4" height="10" fill={colors.pantsWaistband} stroke="#2C3E50" strokeWidth="1"/>
          <rect x="76" y="15" width="4" height="10" fill={colors.pantsWaistband} stroke="#2C3E50" strokeWidth="1"/>
          <rect x="102" y="15" width="4" height="10" fill={colors.pantsWaistband} stroke="#2C3E50" strokeWidth="1"/>
          
          {/* Pants Pockets */}
          <path
            d="M50 45 L50 75 Q55 80 65 75 L65 45"
            fill={colors.pantsPockets}
            stroke="#2C3E50"
            strokeWidth="1.5"
            className={getPartClassName("pantsPockets")}
            onClick={() => handlePartClick("pantsPockets")}
          />
          <path
            d="M95 45 L95 75 Q105 80 110 75 L110 45"
            fill={colors.pantsPockets}
            stroke="#2C3E50"
            strokeWidth="1.5"
            className={getPartClassName("pantsPockets")}
            onClick={() => handlePartClick("pantsPockets")}
          />
          
          {/* Pants Seams */}
          <line
            x1="80"
            y1="35"
            x2="80"
            y2="200"
            stroke={colors.pantsSeams}
            strokeWidth="2"
            className={getPartClassName("pantsSeams")}
            onClick={() => handlePartClick("pantsSeams")}
          />
        </svg>
      </div>

      {/* Pants Back View */}
      <div className="relative">
        <svg width="160" height="280" viewBox="0 0 160 280" className="drop-shadow-lg">
          {/* Pants Body - Back */}
          <path
            d="M40 20 L120 20 L115 280 L85 280 L80 200 L75 280 L45 280 Z"
            fill={colors.pantsBody}
            stroke="#2C3E50"
            strokeWidth="2"
            className={getPartClassName("pantsBody")}
            onClick={() => handlePartClick("pantsBody")}
          />
          
          {/* Back Waistband */}
          <rect
            x="40"
            y="20"
            width="80"
            height="15"
            fill={colors.pantsWaistband}
            stroke="#2C3E50"
            strokeWidth="2"
            className={getPartClassName("pantsWaistband")}
            onClick={() => handlePartClick("pantsWaistband")}
          />
          
          {/* Back Pockets */}
          <rect
            x="55"
            y="55"
            width="20"
            height="25"
            fill={colors.pantsPockets}
            stroke="#2C3E50"
            strokeWidth="1.5"
            className={getPartClassName("pantsPockets")}
            onClick={() => handlePartClick("pantsPockets")}
          />
          <rect
            x="85"
            y="55"
            width="20"
            height="25"
            fill={colors.pantsPockets}
            stroke="#2C3E50"
            strokeWidth="1.5"
            className={getPartClassName("pantsPockets")}
            onClick={() => handlePartClick("pantsPockets")}
          />
          
          {/* Back Seam */}
          <line
            x1="80"
            y1="35"
            x2="80"
            y2="200"
            stroke={colors.pantsSeams}
            strokeWidth="2"
            className={getPartClassName("pantsSeams")}
            onClick={() => handlePartClick("pantsSeams")}
          />
        </svg>
      </div>
    </div>
  );
};