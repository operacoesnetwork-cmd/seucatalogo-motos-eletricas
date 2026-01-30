"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Share2, Check, Copy, Facebook, Twitter, Linkedin, MessageCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ShareButtonProps extends ButtonProps {
    url: string;
    title?: string;
    text?: string;
    iconOnly?: boolean;
}

export function ShareButton({
    url,
    title = "Minha Loja",
    text = "Confira esta loja incrível!",
    variant = "outline",
    size,
    className,
    children,
    iconOnly = false,
    ...props
}: ShareButtonProps) {
    const { showToast } = useToast();
    const [hasShareApi, setHasShareApi] = React.useState(false);
    const [copied, setCopied] = React.useState(false);

    React.useEffect(() => {
        setHasShareApi(typeof navigator !== "undefined" && !!navigator.share);
    }, []);

    const handleNativeShare = async () => {
        try {
            await navigator.share({
                title,
                text,
                url,
            });
        } catch (error) {
            console.log("Error sharing:", error);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        showToast("Link copiado para a área de transferência!", "success");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSocialShare = (platform: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin') => {
        let shareUrl = '';
        const encodedUrl = encodeURIComponent(url);
        const encodedText = encodeURIComponent(text);

        switch (platform) {
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodeURIComponent(title)}&summary=${encodedText}`;
                break;
        }

        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    const ShareIcon = <Share2 className={iconOnly ? "h-4 w-4" : "h-4 w-4 mr-2"} />;
    const ButtonContent = iconOnly ? ShareIcon : (
        <>
            {ShareIcon}
            {children || "Compartilhar"}
        </>
    );

    if (hasShareApi) {
        return (
            <Button
                variant={variant}
                size={iconOnly ? "icon" : size}
                className={className}
                onClick={handleNativeShare}
                {...props}
            >
                {ButtonContent}
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={variant}
                    size={iconOnly ? "icon" : size}
                    className={className}
                    {...props}
                >
                    {ButtonContent}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Compartilhar via</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => handleSocialShare('whatsapp')} className="cursor-pointer">
                    <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
                    WhatsApp
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleSocialShare('facebook')} className="cursor-pointer">
                    <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                    Facebook
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleSocialShare('twitter')} className="cursor-pointer">
                    <Twitter className="h-4 w-4 mr-2 text-sky-500" />
                    Twitter
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleSocialShare('linkedin')} className="cursor-pointer">
                    <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                    LinkedIn
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                    {copied ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copiado!" : "Copiar Link"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
