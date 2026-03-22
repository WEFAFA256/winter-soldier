import React from 'react';
import Image from 'next/image';

const ImageModal = ({ isOpen, onClose, imageSrc, title }) => {
    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                cursor: 'pointer',
                backdropFilter: 'blur(5px)'
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: '90vw',
                    height: '80vh',
                    maxWidth: '1200px',
                    cursor: 'default',
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '-50px',
                        right: '0',
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '2.5rem',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        zIndex: 10
                    }}
                >
                    &times;
                </button>
                <Image quality={100} src={imageSrc}
                    alt={title || "Full size image"}
                    fill
                    sizes="90vw"
                    priority
                    style={{
                        objectFit: 'contain',
                        borderRadius: '10px',
                    }}
                />
            </div>
        </div>
    );
};

export default ImageModal;
