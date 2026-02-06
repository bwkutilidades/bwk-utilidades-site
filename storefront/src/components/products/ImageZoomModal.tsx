import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageZoomModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    imageUrl: string;
    imageAlt: string;
}

/**
 * Generates a high-resolution Shopify CDN URL for zoom
 * Shopify CDN supports appending width parameter for resizing
 */
function getHighResImageUrl(url: string, width = 2048): string {
    // Shopify CDN URLs can accept width parameter
    // Example: https://cdn.shopify.com/.../image.jpg?width=2048
    try {
        const urlObj = new URL(url);
        urlObj.searchParams.set('width', String(width));
        return urlObj.toString();
    } catch {
        // If URL parsing fails, return original
        return url;
    }
}

function ZoomControls() {
    const { zoomIn, zoomOut, resetTransform } = useControls();

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg z-10">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => zoomOut()}
                aria-label="Diminuir zoom"
            >
                <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => resetTransform()}
                aria-label="Resetar zoom"
            >
                <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => zoomIn()}
                aria-label="Aumentar zoom"
            >
                <ZoomIn className="h-4 w-4" />
            </Button>
        </div>
    );
}

export function ImageZoomModal({ open, onOpenChange, imageUrl, imageAlt }: ImageZoomModalProps) {
    const hiResUrl = getHighResImageUrl(imageUrl);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 border-0 bg-black/95 overflow-hidden"
                aria-describedby={undefined}
            >
                <VisuallyHidden>
                    <DialogTitle>Visualização ampliada da imagem</DialogTitle>
                </VisuallyHidden>

                {/* Close button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-20 h-10 w-10 bg-background/80 hover:bg-background rounded-full"
                    onClick={() => onOpenChange(false)}
                    aria-label="Fechar"
                >
                    <X className="h-5 w-5" />
                </Button>

                {/* Zoom container */}
                <TransformWrapper
                    initialScale={1}
                    minScale={0.5}
                    maxScale={5}
                    centerOnInit
                    wheel={{ step: 0.1 }}
                    pinch={{ step: 5 }}
                    doubleClick={{ mode: "reset" }}
                >
                    <ZoomControls />
                    <TransformComponent
                        wrapperClass="!w-full !h-full"
                        contentClass="!w-full !h-full flex items-center justify-center"
                    >
                        <img
                            src={hiResUrl}
                            alt={imageAlt}
                            className="max-w-full max-h-[90vh] object-contain select-none"
                            draggable={false}
                        />
                    </TransformComponent>
                </TransformWrapper>

                {/* Instructions */}
                <p className="absolute bottom-4 right-4 text-xs text-white/60 bg-black/50 px-2 py-1 rounded pointer-events-none">
                    Use scroll/pinch para zoom • Arraste para mover
                </p>
            </DialogContent>
        </Dialog>
    );
}
