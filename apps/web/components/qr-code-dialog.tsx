"use client";

import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";
import {
  QrCodeIcon,
  DownloadIcon,
  CopyIcon,
  CheckIcon,
  PrinterIcon,
  FileCodeIcon,
  ExternalLinkIcon,
  PaletteIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

const COLOR_PRESETS = [
  { name: "Classic Black", hex: "#000000" },
  { name: "Chai Indigo", hex: "#4f46e5" },
  { name: "Emerald Green", hex: "#059669" },
  { name: "Crimson Rose", hex: "#e11d48" },
  { name: "Amber Ochre", hex: "#d97706" },
];

export interface QrCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title: string;
  slug?: string | null;
}

export function QrCodeDialog({
  open,
  onOpenChange,
  url,
  title,
  slug,
}: QrCodeDialogProps) {
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [dataUrl, setDataUrl] = useState<string>("");
  const [svgString, setSvgString] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const printContainerRef = useRef<HTMLDivElement>(null);

  const fileBaseName = (slug || title || "form")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  useEffect(() => {
    if (!open || !url) return;

    let isCurrent = true;

    // Generate high-resolution 1024x1024 PNG data URL
    QRCode.toDataURL(url, {
      width: 1024,
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: selectedColor,
        light: "#ffffff",
      },
    })
      .then((res) => {
        if (isCurrent) setDataUrl(res);
      })
      .catch((err) => {
        console.error("Failed to generate QR PNG", err);
      });

    // Generate clean SVG vector string
    QRCode.toString(url, {
      type: "svg",
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: selectedColor,
        light: "#ffffff",
      },
    })
      .then((res) => {
        if (isCurrent) setSvgString(res);
      })
      .catch((err) => {
        console.error("Failed to generate QR SVG", err);
      });

    return () => {
      isCurrent = false;
    };
  }, [open, url, selectedColor]);

  const handleDownloadPng = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${fileBaseName}-qr-1024px.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("High-res 1024px PNG downloaded!");
  };

  const handleDownloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${fileBaseName}-qr-vector.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
    toast.success("Vector SVG downloaded!");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success("Form URL copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyImage = async () => {
    if (!dataUrl) return;
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setCopiedImage(true);
      toast.success("QR image copied to clipboard! Ready to paste.");
      setTimeout(() => setCopiedImage(false), 2000);
    } catch {
      handleCopyLink();
    }
  };

  const handlePrintFlyer = () => {
    window.print();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md sm:max-w-lg p-6">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <QrCodeIcon className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg">Form QR Code</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Scan instantly from phone camera, posters, or event desks.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* QR Code Preview Card */}
          <div className="flex flex-col items-center justify-center p-6 bg-muted/40 rounded-2xl border mt-2">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-neutral-200 flex flex-col items-center">
              {dataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dataUrl}
                  alt={`QR code for ${title}`}
                  className="size-52 sm:size-60 object-contain rounded-lg"
                />
              ) : (
                <div className="size-52 sm:size-60 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              )}
              <p className="text-[11px] font-medium text-neutral-500 mt-2 tracking-wide uppercase">
                Scan with phone camera
              </p>
            </div>

            {/* Target URL Pill */}
            <div className="w-full mt-4 flex items-center justify-between gap-2 px-3 py-1.5 bg-background border rounded-lg text-xs font-mono text-muted-foreground">
              <span className="truncate" title={url}>
                {url}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs shrink-0"
                onClick={handleCopyLink}
              >
                {copiedLink ? (
                  <CheckIcon className="size-3 text-emerald-500" />
                ) : (
                  <CopyIcon className="size-3" />
                )}
                <span className="ml-1">{copiedLink ? "Copied" : "Copy"}</span>
              </Button>
            </div>
          </div>

          {/* Color Customizer */}
          <div className="mt-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              <PaletteIcon className="size-3.5" />
              <span>QR Theme Color:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PRESETS.map((color) => {
                const isSelected = selectedColor === color.hex;
                return (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => setSelectedColor(color.hex)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition border cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/10 font-medium text-foreground"
                        : "border-transparent bg-muted/60 hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <span
                      className="size-3 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPng}
              disabled={!dataUrl}
              className="gap-1.5 h-9"
            >
              <DownloadIcon className="size-3.5" />
              <span>Download PNG (1024px)</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSvg}
              disabled={!svgString}
              className="gap-1.5 h-9"
            >
              <FileCodeIcon className="size-3.5" />
              <span>Download SVG (Vector)</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyImage}
              disabled={!dataUrl}
              className="gap-1.5 h-9"
            >
              {copiedImage ? (
                <CheckIcon className="size-3.5 text-emerald-500" />
              ) : (
                <CopyIcon className="size-3.5" />
              )}
              <span>{copiedImage ? "Copied Image!" : "Copy Image"}</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handlePrintFlyer}
              disabled={!dataUrl}
              className="gap-1.5 h-9"
            >
              <PrinterIcon className="size-3.5" />
              <span>Print Poster Flyer</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dedicated Printable Flyer Section (@media print only) */}
      <div
        ref={printContainerRef}
        className="hidden print:flex fixed inset-0 z-[9999] bg-white text-black p-12 flex-col items-center justify-between text-center"
      >
        <div className="max-w-md mx-auto flex flex-col items-center">
          <Badge className="bg-black text-white mb-6 px-4 py-1.5 text-sm uppercase tracking-widest font-mono">
            ChaiForm Event Desk
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-neutral-900">
            {title}
          </h1>
          <p className="text-base text-neutral-600 mb-8">
            Scan the QR code below with your smartphone camera to access and complete this form.
          </p>

          <div className="p-6 bg-white border-4 border-black rounded-3xl shadow-lg mb-6">
            {dataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dataUrl}
                alt={`Print QR code for ${title}`}
                className="w-72 h-72 object-contain"
              />
            )}
          </div>

          <p className="text-sm font-mono text-neutral-700 bg-neutral-100 px-4 py-2 rounded-lg border border-neutral-300">
            {url}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-200 w-full text-xs text-neutral-500 font-mono">
          Powered by ChaiForm • Instant & Secure Forms
        </div>
      </div>
    </>
  );
}
