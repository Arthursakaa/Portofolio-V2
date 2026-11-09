import { PixelSprite } from "./PixelSprite";
import {
  BASE_PALETTE,
  BOT_ANTENNA,
  BOT_BODY_BLINK,
  BOT_BODY_HAPPY,
  BOT_BODY_OPEN,
  BOT_BODY_SHOCKED,
  BOT_BODY_SLEEP,
  BOT_EARS,
} from "./spriteData";

export type BotMood = "normal" | "happy" | "shocked" | "sleep";

interface BotSpriteProps {
  /** Neko mode: cat ears instead of the antenna (plan 020) */
  neko?: boolean;
  scale?: number;
  /** Add "sprite-blink" to make it blink every few seconds */
  className?: string;
  /** Expressive mood states */
  mood?: BotMood;
}

/** BOT.v2, the site mascot. 12 x 14 sprite pixels. */
export function BotSprite({
  neko = false,
  scale = 4,
  className = "",
  mood = "normal",
}: BotSpriteProps) {
  const headLayer = neko ? BOT_EARS : BOT_ANTENNA;
  const headClass = neko ? "bot-ears-twitch" : "bot-antenna-pulse";

  const getLayers = () => {
    if (mood === "happy") {
      return [
        { rows: BOT_BODY_HAPPY },
        { rows: headLayer, className: headClass },
      ];
    }
    if (mood === "shocked") {
      return [
        { rows: BOT_BODY_SHOCKED },
        { rows: headLayer, className: headClass },
      ];
    }
    if (mood === "sleep") {
      return [
        { rows: BOT_BODY_SLEEP },
        { rows: headLayer },
      ];
    }
    // Normal: open with CSS blinking
    return [
      { rows: BOT_BODY_OPEN, className: "sprite-frame-main" },
      { rows: BOT_BODY_BLINK, className: "sprite-frame-alt" },
      { rows: headLayer, className: headClass },
    ];
  };

  return (
    <PixelSprite
      scale={scale}
      palette={BASE_PALETTE}
      className={className}
      layers={getLayers()}
    />
  );
}
