"use client";

import { useState, useEffect } from "react";
import { portfolioData, type Certificate } from "@/data/portfolio";
import {
  PixelAwardIcon,
  PixelExternalIcon,
  PixelDocumentIcon,
  PixelCheckIcon,
} from "./PixelIcons";
import { retroSound } from "@/lib/audio";

interface CertificatesSectionProps {
  soundEnabled: boolean;
}

export function CertificatesSection({ soundEnabled }: CertificatesSectionProps) {
  const { certificates } = portfolioData;
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!selectedCert) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (soundEnabled) retroSound.playSelect();
        setSelectedCert(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCert, soundEnabled]);

  const markImageFailed = (id: string) => {
    setFailedImages((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
  };

  const openModal = (cert: Certificate) => {
    if (soundEnabled) retroSound.playSelect();
    setSelectedCert(cert);
  };

  const closeModal = () => {
    if (soundEnabled) retroSound.playSelect();
    setSelectedCert(null);
  };

  return (
    <section
      id="certificates"
      data-reveal
      className="relative py-16 border-b-2 border-[#2b2723] bg-[#fffdf9]"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div
          data-reveal-item={0}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 pb-4 border-b-2 border-[#2b2723]"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-[#eab308] inline-block border border-[#2b2723]" />
              <span className="font-pixel text-[10px] text-[#575049]">
                05 // CERTIFICATIONS &amp; CREDENTIALS
              </span>
            </div>
            <h2 className="font-pixel text-xl sm:text-2xl text-[#2b2723] pixel-wipe">
              LICENSES &amp; CERTIFICATES
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-[#f4efe6] border-2 border-[#2b2723] px-3 py-1.5 shadow-[2px_2px_0_0_#2b2723]">
            <PixelAwardIcon size={14} className="text-[#ea580c]" />
            <span className="font-pixel text-[9px] text-[#2b2723]">
              {certificates.length} VERIFIED CREDENTIAL{certificates.length === 1 ? "" : "S"}
            </span>
          </div>
        </div>

        {/* Certificates Grid (centers neatly when 1 certificate, 2-column grid for 2+) */}
        <div
          className={
            certificates.length === 1
              ? "max-w-2xl mx-auto"
              : "grid grid-cols-1 md:grid-cols-2 gap-7"
          }
        >
          {certificates.map((cert, index) => {
            const hasValidImage = Boolean(cert.imageUrl && !failedImages[cert.id]);

            return (
              <div
                key={cert.id}
                data-reveal
                data-reveal-item={index % 2}
                className="h-full"
              >
                <article className="h-full bg-[#f4efe6] pixel-border-lg pixel-card-interactive flex flex-col justify-between overflow-hidden">
                  <div>
                    {/* Interactive Certificate Thumbnail / Dossier Preview */}
                    <div className="group relative aspect-[16/11] w-full border-b-2 border-[#2b2723] bg-[#1e293b] overflow-hidden">
                      {hasValidImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cert.imageUrl}
                          alt={cert.title}
                          onError={() => markImageFailed(cert.id)}
                          className="w-full h-full object-contain p-2 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.02]"
                        />
                      ) : (
                        /* Styled 8-Bit Certificate Dossier Fallback */
                        <div className="w-full h-full p-4 sm:p-5 flex items-center justify-center bg-[#1e293b] relative">
                          {/* Subtle dot pattern */}
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 opacity-15 bg-[radial-gradient(#f4efe6_1px,transparent_1px)] [background-size:12px_12px]"
                          />

                          {/* Inner Parchment Frame */}
                          <div className="relative w-full h-full bg-[#fffdf9] border-2 border-[#2b2723] p-3.5 sm:p-4 flex flex-col justify-between shadow-[4px_4px_0_0_#0f172a] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.01]">
                            {/* Corner Pixel Accents */}
                            <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-[#ea580c]" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ea580c]" />
                            <span className="absolute bottom-1.5 left-1.5 w-2 h-2 bg-[#ea580c]" />
                            <span className="absolute bottom-1.5 right-1.5 w-2 h-2 bg-[#ea580c]" />

                            <div className="flex items-center justify-between border-b border-[#ded5c5] pb-1.5 px-2">
                              <span className="font-pixel text-[7px] text-[#575049] tracking-wider">
                                CERTIFICATE OF COMPLETION
                              </span>
                              <span className="font-mono text-[10px] font-bold text-[#047857]">
                                {cert.issueDate}
                              </span>
                            </div>

                            <div className="my-auto py-1 text-center px-2">
                              <p className="font-pixel text-[8px] text-[#ea580c] mb-1">
                                {cert.issuer.toUpperCase()}
                              </p>
                              <p className="font-pixel text-[10px] sm:text-xs text-[#2b2723] leading-snug line-clamp-2">
                                {cert.title}
                              </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-[#ded5c5] pt-1.5 px-2">
                              <span className="font-mono text-[10px] text-[#575049]">
                                ID: {cert.credentialId ?? "VERIFIED"}
                              </span>
                              <span className="inline-flex items-center gap-1 bg-[#eab308]/20 border border-[#ca8a04] px-1.5 py-0.5 font-pixel text-[7px] text-[#854d0e]">
                                <PixelAwardIcon size={10} />
                                SEALED
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Native Button Overlay for Accessible Preview + Hydration Safety */}
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() => openModal(cert)}
                        aria-label={`Inspect certificate: ${cert.title}`}
                        className="absolute inset-0 z-10 w-full h-full cursor-pointer bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ea580c]"
                      >
                        <span className="sr-only">Inspect certificate: {cert.title}</span>
                      </button>

                      {/* Hover / Corner Inspect Pill */}
                      <div className="pointer-events-none absolute bottom-2 right-2 z-20">
                        <span className="pixel-btn px-2.5 py-1 text-[8px] font-pixel bg-[#fffdf9] text-[#2b2723] group-hover:bg-[#ea580c] group-hover:text-white inline-flex items-center gap-1">
                          <span>Inspect Credential</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                        <span className="font-pixel text-[8px] bg-[#2b2723] text-[#fffdf9] px-2 py-0.5">
                          CERT 0{index + 1}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="font-pixel text-[8px] text-[#ea580c] bg-[#ea580c]/10 border border-[#ea580c] px-1.5 py-0.5">
                            {cert.category}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-[#575049]">
                            {cert.issueDate}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-pixel text-sm sm:text-base text-[#2b2723] leading-snug mb-1.5">
                        {cert.title}
                      </h3>

                      <p className="font-mono text-xs font-bold text-[#2563eb] mb-2.5">
                        Issued by {cert.issuer}
                      </p>

                      {cert.credentialId ? (
                        <div className="inline-flex items-center gap-1.5 bg-[#fffdf9] border border-[#2b2723] px-2 py-0.5 text-[11px] font-mono text-[#2b2723] mb-3">
                          <PixelCheckIcon size={11} className="text-[#10b981]" />
                          <span>Credential ID: <strong>{cert.credentialId}</strong></span>
                        </div>
                      ) : null}

                      {cert.summary ? (
                        <p className="text-sm text-[#2b2723] leading-relaxed">
                          {cert.summary}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Bottom Action Links */}
                  <div className="px-5 pb-5 pt-3 border-t-2 border-[#2b2723]/15 bg-[#fffdf9] flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => openModal(cert)}
                      className="pixel-btn px-3.5 py-2 bg-[#2b2723] text-[#fffdf9] font-pixel text-[9px] hover:bg-[#3d3732] inline-flex items-center gap-1.5"
                    >
                      <PixelAwardIcon size={12} />
                      <span>Preview Certificate</span>
                    </button>

                    {cert.verifyUrl ? (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundEnabled && retroSound.playLaser()}
                        className="pixel-btn px-3.5 py-2 bg-[#10b981] text-white font-pixel text-[9px] hover:bg-[#059669] inline-flex items-center gap-1.5"
                      >
                        <PixelExternalIcon size={12} />
                        <span>Verify Credential</span>
                      </a>
                    ) : null}

                    {cert.pdfUrl ? (
                      <a
                        href={cert.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundEnabled && retroSound.playCoin()}
                        className="pixel-btn px-3 py-2 bg-[#f4efe6] text-[#2b2723] font-pixel text-[9px] hover:bg-[#e9e2d5] inline-flex items-center gap-1.5"
                      >
                        <PixelDocumentIcon size={12} />
                        <span>Open PDF</span>
                      </a>
                    ) : null}
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      {/* Retro Lightbox Modal for Full Certificate Inspection */}
      {selectedCert ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2b2723]/70 backdrop-blur-xs animate-confirm-pop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="w-full max-w-2xl bg-[#fffdf9] pixel-border-lg p-5 sm:p-6 max-h-[90vh] overflow-y-auto no-scrollbar relative shadow-[6px_6px_0_0_#2b2723]">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b-2 border-[#2b2723] pb-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-pixel text-[8px] bg-[#eab308] text-[#2b2723] px-2 py-0.5 border border-[#2b2723]">
                    {selectedCert.category}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#575049]">
                    Issued {selectedCert.issueDate}
                  </span>
                </div>
                <h3
                  id="cert-modal-title"
                  className="font-pixel text-xs sm:text-sm text-[#2b2723] leading-snug"
                >
                  {selectedCert.title}
                </h3>
              </div>

              <button
                type="button"
                suppressHydrationWarning
                onClick={closeModal}
                aria-label="Close certificate preview"
                className="pixel-btn px-2.5 py-1 bg-[#f4efe6] hover:bg-[#e9e2d5] text-[#2b2723] font-pixel text-[9px] shrink-0"
              >
                [✕ ESC]
              </button>
            </div>

            {/* Full Visual Preview Area */}
            <div className="bg-[#1e293b] border-2 border-[#2b2723] p-3 sm:p-4 mb-4">
              {selectedCert.imageUrl && !failedImages[selectedCert.id] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedCert.imageUrl}
                  alt={selectedCert.title}
                  onError={() => markImageFailed(selectedCert.id)}
                  className="w-full max-h-[55vh] object-contain mx-auto border border-[#2b2723] bg-[#fffdf9]"
                />
              ) : (
                <div className="bg-[#fffdf9] border-2 border-[#2b2723] p-6 sm:p-8 text-center space-y-3 relative">
                  <div className="w-10 h-10 mx-auto bg-[#eab308]/20 border-2 border-[#2b2723] flex items-center justify-center text-[#ca8a04]">
                    <PixelAwardIcon size={20} />
                  </div>
                  <p className="font-pixel text-[9px] text-[#ea580c]">
                    OFFICIAL CREDENTIAL RECORD
                  </p>
                  <h4 className="font-pixel text-sm sm:text-base text-[#2b2723] max-w-lg mx-auto leading-relaxed">
                    {selectedCert.title}
                  </h4>
                  <p className="font-mono text-xs font-bold text-[#2563eb]">
                    {selectedCert.issuer} &bull; {selectedCert.issueDate}
                  </p>
                  {selectedCert.credentialId ? (
                    <p className="font-mono text-xs text-[#575049]">
                      Credential ID: <span className="font-bold text-[#2b2723]">{selectedCert.credentialId}</span>
                    </p>
                  ) : null}
                </div>
              )}
            </div>

            {/* Metadata & Summary */}
            <div className="bg-[#f4efe6] border-2 border-[#2b2723] p-4 space-y-2 mb-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono border-b border-[#ded5c5] pb-2">
                <span>
                  <strong className="text-[#575049]">ISSUER:</strong> {selectedCert.issuer}
                </span>
                {selectedCert.credentialId ? (
                  <span>
                    <strong className="text-[#575049]">ID:</strong> {selectedCert.credentialId}
                  </span>
                ) : null}
              </div>
              {selectedCert.summary ? (
                <p className="text-xs sm:text-sm text-[#2b2723] leading-relaxed pt-1">
                  {selectedCert.summary}
                </p>
              ) : null}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2.5">
                {selectedCert.verifyUrl ? (
                  <a
                    href={selectedCert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEnabled && retroSound.playLaser()}
                    className="pixel-btn px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white font-pixel text-[9px] inline-flex items-center gap-1.5"
                  >
                    <PixelExternalIcon size={12} />
                    <span>Verify Credential Online</span>
                  </a>
                ) : null}

                {selectedCert.pdfUrl ? (
                  <a
                    href={selectedCert.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEnabled && retroSound.playCoin()}
                    className="pixel-btn px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-pixel text-[9px] inline-flex items-center gap-1.5"
                  >
                    <PixelDocumentIcon size={12} />
                    <span>Open / Download PDF</span>
                  </a>
                ) : null}
              </div>

              <button
                type="button"
                suppressHydrationWarning
                onClick={closeModal}
                className="pixel-btn px-4 py-2 bg-[#2b2723] hover:bg-[#3d3732] text-[#fffdf9] font-pixel text-[9px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

