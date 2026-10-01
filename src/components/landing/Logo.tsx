import { ASSETS } from "@/lib/assets";

export function Logo({
  variant = "default",
  className = "",
}: {
  variant?: "default" | "3d";
  className?: string;
}) {
  // Both variants resolved to the same file even before the migration; the prop is
  // kept because call sites pass it.
  void variant;
  return (
    <img
      src={ASSETS.logo}
      alt="Framers"
      className={`object-contain ${className}`}
      loading="eager"
      decoding="async"
    />
  );
}
