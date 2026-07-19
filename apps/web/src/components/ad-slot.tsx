interface AdSlotProps {
  placement: "below-tool" | "content-middle" | "content-bottom";
}

export function AdSlot({ placement }: AdSlotProps) {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
  )
    return null;
  return (
    <div className="ad-slot" data-placement={placement} aria-hidden="true">
      Advertisement
    </div>
  );
}
