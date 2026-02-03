/**
 * AddedToCartModal - Modal shown after adding product to cart
 * 
 * Offers two options:
 * - Finalizar compra: redirects to Shopify checkout
 * - Continuar comprando: closes modal, stays on current page
 */

import { CheckCircle, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useShopifyCheckout } from "@/hooks/useShopifyCheckout";

interface AddedToCartModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productName?: string;
}

export function AddedToCartModal({
    open,
    onOpenChange,
    productName,
}: AddedToCartModalProps) {
    const { isCheckingOut, startCheckout } = useShopifyCheckout();

    const handleFinalizarCompra = async () => {
        await startCheckout();
        // startCheckout will redirect to Shopify, modal will be unmounted
    };

    const handleContinuarComprando = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-center sm:text-center">
                    <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <DialogTitle className="text-xl">
                        Produto adicionado ao carrinho ✅
                    </DialogTitle>
                    <DialogDescription className="text-base pt-2">
                        {productName && (
                            <span className="block font-medium text-foreground mb-2 line-clamp-2">
                                {productName}
                            </span>
                        )}
                        O que você quer fazer agora?
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 mt-4">
                    {/* Primary: Finalizar compra - BWK Yellow */}
                    <Button
                        size="lg"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                        onClick={handleFinalizarCompra}
                        disabled={isCheckingOut}
                        autoFocus
                    >
                        {isCheckingOut ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processando...
                            </>
                        ) : (
                            <>
                                Finalizar compra
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Button>

                    {/* Secondary: Continuar comprando */}
                    <Button
                        size="lg"
                        variant="outline"
                        className="w-full"
                        onClick={handleContinuarComprando}
                        disabled={isCheckingOut}
                    >
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Continuar comprando
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
