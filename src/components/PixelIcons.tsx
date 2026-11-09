import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function PixelArrowRightIcon({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M2 7h8v2H2V7zm6-4h2v2H8V3zm2 2h2v2h-2V5zm2 2h2v2h-2V7zm-2 2h2v2h-2V9zm-2 2h2v2H8v-2z" />
    </svg>
  );
}

export function PixelExternalIcon({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M5 3h8v8h-2V5H5V3zm4 4h2v2H9V7zm-2 2h2v2H7V9zm-2 2h2v2H5v-2zm-2 2h2v2H3v-2z" />
    </svg>
  );
}

export function PixelArrowUpIcon({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M7 2h2v12H7V2zM5 4h2v2H5V4zm4 0h2v2H9V4zM3 6h2v2H3V6zm8 0h2v2h-2V6z" />
    </svg>
  );
}

export function PixelCheckIcon({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M12 4h2v2h-2V4zm-2 2h2v2h-2V6zM8 8h2v2H8V8zm-2 2h2v2H6v-2M4 8h2v2H4V8zm-2-2h2v2H2V6z" />
    </svg>
  );
}

export function PixelCopyIcon({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M2 2h8v2H4v6H2V2zm4 4h8v8H6V6zm2 2v4h4V8H8z" />
    </svg>
  );
}

export function PixelMailIcon({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M1 3h14v10H1V3zm2 2v1h2v1h2v1h2V7h2V6h2V5H3zm0 3v3h10V8h-2v1H9v1H7V9H5V8H3z" />
    </svg>
  );
}

export function PixelSparkleIcon({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M7 1h2v4H7V1zm0 10h2v4H7v-4zM1 7h4v2H1V7zm10 0h4v2h-4V7zM5 5h2v2H5V5zm4 0h2v2H9V5zM5 9h2v2H5V9zm4 0h2v2H9V9z" />
    </svg>
  );
}

export function PixelCodeIcon({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M5 4h2v2H5V4zM3 6h2v2H3V6zM1 8h2v2H1V8zm2 2h2v2H3v-2zm2 2h2v2H5v-2zm4-8h2v2H9V4zm2 2h2v2h-2V6zm2 2h2v2h-2V8zm-2 2h2v2h-2v-2zm-2 2h2v2H9v-2z" />
    </svg>
  );
}

export function PixelDownloadIcon({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M7 1h2v7H7V1zm-3 5h2v2H4V6zm8 0h-2v2h2V6zm-6 2h4v2H6V8zm-4 4h12v2H2v-2zm0-3h2v3H2V9zm12 0h-2v3h2V9z" />
    </svg>
  );
}

export function PixelDocumentIcon({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path d="M3 1h7l3 3v11H3V1zm2 2v10h6V5H9V3H5zm2 4h4v1H7V7zm0 2h4v1H7V9zm0 2h3v1H7v-1z" />
    </svg>
  );
}


