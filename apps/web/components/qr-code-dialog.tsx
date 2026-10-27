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
  CodeIcon,
  Share2Icon,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { EmbedCodeTab } from "~/components/forms/embed-code-tab";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { landingTheme } from "~/config/landing-theme";

const COLOR_PRESETS = landingTheme.qrCodePresets;

export interface QrCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title: string;
  slug?: string | null;
  defaultTab?: "embed" | "qr";
}

export function QrCodeDialog({
  open,
  onOpenChange,
  url,
  title,
  slug,
  defaultTab = "embed",
}: QrCodeDialogProps) {
  const [selectedColor, setSelectedColor] = useState<string>(COLOR_PRESETS[0]?.hex ?? "#000000");
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
        <DialogContent className="max-w-md sm:max-w-2xl max-h-[92vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6 w-[95vw] sm:w-full">
          <DialogHeader className="pb-3 border-b">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <Share2Icon className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-semibold tracking-tight">
                  Share & Embed Form
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Embed directly into your static/client website, or share via QR code and links.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue={defaultTab} className="w-full mt-2">
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger value="embed" className="flex items-center gap-2 text-xs">
                <CodeIcon className="size-3.5" />
                <span>Website Embed</span>
              </TabsTrigger>
              <TabsTrigger value="qr" className="flex items-center gap-2 text-xs">
                <QrCodeIcon className="size-3.5" />
                <span>QR Code & Flyer</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Live Syncing Website Embed Code Generator */}
            <TabsContent value="embed" className="mt-0 focus-visible:outline-hidden">
              <EmbedCodeTab url={url} title={title} slug={slug} />
            </TabsContent>

            {/* Tab 2: High-Resolution QR Code & Print Flyer */}
            <TabsContent value="qr" className="mt-0 focus-visible:outline-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-5 pt-1 text-left">
                {/* Left: QR Code Card & Color Theme (2 cols on sm) */}
                <div className="sm:col-span-2 flex flex-col items-center justify-center bg-muted/40 rounded-xl p-4 border border-border/60">
                  <div className="p-3 bg-white rounded-xl shadow-xs border border-neutral-200 flex flex-col items-center">
                    {dataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={dataUrl}
                        alt={`QR code for ${title}`}
                        className="size-36 sm:size-40 object-contain rounded"
                      />
                    ) : (
                      <div className="size-36 sm:size-40 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary" />
                      </div>
                    )}
                    <span className="text-[10px] font-semibold tracking-wider text-neutral-500 uppercase mt-2">
                      Scan with camera
                    </span>
                  </div>

                  {/* Theme Color Presets */}
                  <div className="mt-3 flex flex-col items-center gap-1.5 w-full">
                    <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                      <PaletteIcon className="size-3" /> Color Palette
                    </span>
                    <div className="flex items-center gap-2">
                      {COLOR_PRESETS.map((color) => {
                        const isSelected = selectedColor === color.hex;
                        return (
                          <button
                            key={color.hex}
                            type="button"
                            title={color.name}
                            onClick={() => setSelectedColor(color.hex)}
                            className={`size-6 rounded-full transition-all flex items-center justify-center cursor-pointer border ${
                              isSelected
                                ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110 border-transparent"
                                : "border-black/20 hover:scale-105 opacity-80 hover:opacity-100"
                            }`}
                            style={{ backgroundColor: color.hex }}
                          >
                            {isSelected && (
                              <CheckIcon className="size-3 text-white drop-shadow-xs" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right: Info, URL, & Actions (3 cols on sm) */}
                <div className="sm:col-span-3 flex flex-col justify-between gap-4 min-w-0">
                  <div className="min-w-0">
                    <Badge
                      variant="outline"
                      className="text-[10px] font-mono text-muted-foreground mb-1.5"
                    >
                      Shareable Link
                    </Badge>
                    <h3 className="text-base font-semibold leading-snug line-clamp-1">{title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      Anyone with this QR code can instantly open and submit this form from any
                      mobile browser.
                    </p>

                    {/* Target URL Pill */}
                    <div className="mt-3 flex items-center gap-1.5 p-1.5 pl-2.5 rounded-lg border bg-muted/40 text-xs font-mono text-muted-foreground min-w-0">
                      <span className="truncate flex-1 select-all min-w-0" title={url}>
                        {url}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 px-2.5 text-xs shrink-0 gap-1 font-sans cursor-pointer"
                        onClick={handleCopyLink}
                      >
                        {copiedLink ? (
                          <CheckIcon className="size-3 text-emerald-500" />
                        ) : (
                          <CopyIcon className="size-3" />
                        )}
                        <span>{copiedLink ? "Copied" : "Copy"}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons Grid */}
                  <div className="flex flex-col gap-2 pt-2 border-t">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadPng}
                        disabled={!dataUrl}
                        className="h-8.5 gap-1.5 text-xs font-medium cursor-pointer"
                      >
                        <DownloadIcon className="size-3.5" />
                        <span>PNG (1024px)</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadSvg}
                        disabled={!svgString}
                        className="h-8.5 gap-1.5 text-xs font-medium cursor-pointer"
                      >
                        <FileCodeIcon className="size-3.5" />
                        <span>Vector (SVG)</span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyImage}
                        disabled={!dataUrl}
                        className="h-8.5 gap-1.5 text-xs font-medium cursor-pointer"
                      >
                        {copiedImage ? (
                          <CheckIcon className="size-3.5 text-emerald-500" />
                        ) : (
                          <CopyIcon className="size-3.5" />
                        )}
                        <span>{copiedImage ? "Copied!" : "Copy Image"}</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={handlePrintFlyer}
                        disabled={!dataUrl}
                        className={`h-8.5 gap-1.5 text-xs font-medium shadow-xs cursor-pointer ${landingTheme.primaryButton}`}
                      >
                        <PrinterIcon className="size-3.5" />
                        <span>Print Flyer</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-neutral-900">{title}</h1>
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
