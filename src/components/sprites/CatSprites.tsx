import { PixelSprite, type SpritePalette } from "./PixelSprite";
import { BASE_PALETTE, CAT_BODY, CAT_LEGS_A, CAT_LEGS_B, CAT_SLEEP } from "./spriteData";

/** Walking cat, 14 x 10 sprite pixels. Legs alternate via .cat-legs-a / .cat-legs-b. */
export function CatWalkSprite({ scale = 2, className }: { scale?: number; className?: string }) {
  return (
    <PixelSprite
      scale={scale}
      palette={BASE_PALETTE}
      className={className}
      layers={[
        { rows: CAT_BODY },
        { rows: CAT_LEGS_A, className: "cat-legs-a" },
        { rows: CAT_LEGS_B, className: "cat-legs-b" },
      ]}
    />
  );
}

/** Sleeping cat, 14 x 7 sprite pixels. */
export function CatSleepSprite({
  scale = 3,
  palette = BASE_PALETTE,
  className,
}: {
  scale?: number;
  palette?: SpritePalette;
  className?: string;
}) {
  return <PixelSprite scale={scale} palette={palette} className={className} layers={[{ rows: CAT_SLEEP }]} />;
}
