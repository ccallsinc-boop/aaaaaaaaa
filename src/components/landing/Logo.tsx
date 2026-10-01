import logoAsset from "@/assets/framers-logo-new.png.asset.json";
import logo3dAsset from "@/assets/framers-logo-new.png.asset.json";

export function Logo({ variant = "default", className = "" }: { variant?: "default" | "3d"; className?: string }) {
  const asset = variant === "3d" ? logo3dAsset : logoAsset;
  return (
    <img
      src={asset.url}
      alt="Framers"
      className={`object-contain ${className}`}
      loading="eager"
      decoding="async"
    />
  );
}
