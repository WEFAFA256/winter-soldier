import React from 'react';

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
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    maxWidth: '90%',
                    maxHeight: '90%',
                    cursor: 'default',
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '-40px',
                        right: '0',
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '2rem',
                        cursor: 'pointer',
                        padding: '0.5rem',
                    }}
                >
                    ✕
                </button>
                <img
                    src={imageSrc}
                    alt={title}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '90vh',
                        objectFit: 'contain',
                        borderRadius: '10px',
                    }}
                />
            </div>
        </div>
    );
};

export default ImageModal;
