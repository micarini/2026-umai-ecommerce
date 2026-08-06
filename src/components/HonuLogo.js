import Image from "next/image";

const ASPECT_RATIO = 521 / 226;

export default function HonuLogo({ variant = "onLight", height = 32, className = "" }) {
  const srcByVariant = {
    onLight: "/images/logo/logo.svg",
    onDark: "/images/logo/logo-v2.svg",
    footer: "/images/logo/logo-footer.svg",
  };
  const src = srcByVariant[variant] || srcByVariant.onLight;
  const width = Math.round(height * ASPECT_RATIO);

  return (
    <Image
      src={src}
      alt="Honu Bowls"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
