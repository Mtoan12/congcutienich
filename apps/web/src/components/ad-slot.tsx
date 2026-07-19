export type AdPlacement = "below-tool" | "content-middle" | "content-bottom";
interface AdSlotProps {
  placement: AdPlacement;
}

export function AdSlot({ placement }: AdSlotProps) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div className="ad-slot" data-placement={placement} aria-hidden="true">
      Advertisement
    </div>
  );
}
