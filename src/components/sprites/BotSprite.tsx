import { PixelSprite } from "./PixelSprite";
import { BASE_PALETTE, BOT_ANTENNA, BOT_BODY_BLINK, BOT_BODY_OPEN, BOT_EARS } from "./spriteData";

interface BotSpriteProps {
  /** Neko mode: cat ears instead of the antenna (plan 020) */
  neko?: boolean;
  scale?: number;
  /** Add "sprite-blink" to make it blink every few seconds */
  className?: string;
}

/** BOT.v2, the site mascot. 12 x 14 sprite pixels. */
export function BotSprite({ neko = false, scale = 4, className }: BotSpriteProps) {
  return (
    <PixelSprite
      scale={scale}
      palette={BASE_PALETTE}
      className={className}
      layers={[
        { rows: BOT_BODY_OPEN, className: "sprite-frame-main" },
        { rows: BOT_BODY_BLINK, className: "sprite-frame-alt" },
        { rows: neko ? BOT_EARS : BOT_ANTENNA },
      ]}
    />
  );
}
