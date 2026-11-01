"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import next from "next";

type ProductGalleryProps = {
    images: {
        src: string;
        alt: string;
    }[];
};

export default function ProductGallery({ images }: ProductGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [imageSize, setImageSize] = useState({
        width: 0,
        height: 0,
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const touchStartX = useRef<number | null>(null);

    const previousImage = useCallback(() => {
        setCurrentIndex((current) =>
            current === 0 ? images.length - 1 : current - 1
        );
    }, [images.length]);

    const nextImage = useCallback(() => {
        setCurrentIndex((current) =>
            current === images.length - 1 ? 0 : current + 1
        );
    }, [images.length]);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if(event.pointerType === "mouse") return;

        touchStartX.current = event.clientX;
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        if(touchStartX.current === null) return;

        const difference = event.clientX - touchStartX.current;
        const minimumSwipeDistance = 50;

        if(difference > minimumSwipeDistance){
            previousImage();
        } else if(difference < -minimumSwipeDistance){
            nextImage();
        }

        touchStartX.current = null;
    }

    useEffect(() => {
        const updateImageSize = () => {
            const container = containerRef.current;
            const image = imageRef.current;

            if(!container || !image || !image.naturalWidth) return;

            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            const scale = Math.min(
                containerWidth / image.naturalWidth,
                containerHeight / image.naturalHeight
            );

            setImageSize({
                width: image.naturalWidth * scale,
                height: image.naturalHeight * scale,
            });
        };

        updateImageSize();

        window.addEventListener("resize", updateImageSize);

        return () => window.removeEventListener("resize", updateImageSize);
    }, [currentIndex, isExpanded]);

    useEffect(() => {
        if(!isExpanded) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if(event.key === "Escape"){
                setIsExpanded(false);
            }

            if(event.key === "ArrowLeft") {
                previousImage();
            }

            if(event.key === "ArrowRight"){
                nextImage();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isExpanded, previousImage, nextImage]);

    if(!images || images.length === 0){
        return <p>Imagens do produto indisponíveis.</p>;
    }

    return (
        <div className="product-gallery">
            <div 
                className="product-gallery-main"
                onClick={() => setIsExpanded(true)}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => {
                    touchStartX.current = null;
                }}
                role="button"
                tabIndex={0}
                aria-label="Ampliar imagem do produto"
                onKeyDown={(event) => {
                    if(event.key === "Enter" || event.key === " "){
                        event.preventDefault();
                        setIsExpanded(true);
                    }
                }}
            >
                <div
                    className="product-gallery-track"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {images.map((image, index) => (
                        <div className="product-gallery-slide" key={image.src}>
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                priority={index === 0}
                                sizes="(max-width: 700px) 100vw, 50vw"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {images.length > 1 && (
                <div className="product-gallery-thumbnails">
                    {images.map((image, index) => (
                        <button
                            key={image.src}
                            className={`product-gallery-thumbnail ${
                                currentIndex === index ? "active" : ""
                            }`}
                            onMouseEnter={() => setCurrentIndex(index)}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Ver foto ${index + 1}`}
                            aria-pressed={currentIndex === index}
                        >
                            <Image
                                src={image.src}
                                alt=""
                                fill
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}

            {isExpanded && (
                <div
                    className="product-gallery-lightbox"
                    onClick={() => setIsExpanded(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Imagem ampliada do produto"
                >
                    <button
                        className="product-gallery-close"
                        onClick={() => setIsExpanded(false)}
                        aria-label="Fechar imagem ampliada"
                    >
                        ×
                    </button>

                    <div
                        className="product-gallery-expanded-image"
                        ref={containerRef}
                    >
                        <Image
                            ref={imageRef}
                            src={images[currentIndex].src}
                            alt={images[currentIndex].alt}
                            fill
                            sizes="100vw"
                            onClick={() => setIsExpanded(false)}
                        />

                        <div
                            className="product-gallery-image-hitbox"
                            style={{
                                width: `${imageSize.width}px`,
                                height: `${imageSize.height}px`,
                            }}
                            onClick={() => setIsExpanded(false)}
                        />
                    </div>

                    {images.length > 1 && (
                        <>
                            <button
                                className="product-gallery-arrow product-gallery-previous"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    previousImage();
                                }}
                                aria-label="Foto anterior"
                            >
                                ‹
                            </button>

                            <button
                                className="product-gallery-arrow product-gallery-next"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    previousImage();
                                }}
                                aria-label="Próxima foto"
                            >
                                ›
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}