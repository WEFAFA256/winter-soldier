import { useEffect } from 'react';

/**
 * Scroll reveal hook - triggers animations when elements scroll into view
 * Uses Intersection Observer API for performance
 */
export const useScrollReveal = (options = {}) => {
    useEffect(() => {
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px',
            ...options
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Optionally un observe after revealing
                    if (!options.repeat) {
                        observer.unobserve(entry.target);
                    }
                } else if (options.repeat) {
                    entry.target.classList.remove('revealed');
                }
            });
        }, defaultOptions);

        // Observe all elements with scroll-reveal classes
        const elements = document.querySelectorAll(
            '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-float'
        );

        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [options]);
};

/**
 * 3D Card tilt effect based on mouse position
 * Call this hook in a component and attach the ref to the card element
 */
export const use3DCardTilt = () => {
    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * 10; // Max 10deg tilt
        const rotateY = ((centerX - x) / centerX) * 10;

        card.style.setProperty('--rotate-x', `${rotateX}deg`);
        card.style.setProperty('--rotate-y', `${rotateY}deg`);
    };

    const handleMouseLeave = (e) => {
        const card = e.currentTarget;
        card.style.setProperty('--rotate-x', '0deg');
        card.style.setProperty('--rotate-y', '0deg');
    };

    return { handleMouseMove, handleMouseLeave };
};

/**
 * Parallax effect hook for images
 * Returns handlers to attach to parallax containers
 */
export const useParallax = (intensity = 0.3) => {
    const handleMouseMove = (e) => {
        const container = e.currentTarget;
        const image = container.querySelector('.parallax-image');
        if (!image) return;

        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const moveX = (x / rect.width - 0.5) * intensity * 100;
        const moveY = (y / rect.height - 0.5) * intensity * 100;

        image.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
    };

    const handleMouseLeave = (e) => {
        const container = e.currentTarget;
        const image = container.querySelector('.parallax-image');
        if (!image) return;

        image.style.transform = 'translate(0, 0) scale(1)';
    };

    return { handleMouseMove, handleMouseLeave };
};

/**
 * Magnetic element effect - elements move toward cursor
 */
export const useMagneticEffect = (strength = 0.3) => {
    const handleMouseMove = (e) => {
        const element = e.currentTarget;
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };

    const handleMouseLeave = (e) => {
        const element = e.currentTarget;
        element.style.transform = 'translate(0, 0)';
    };

    return { handleMouseMove, handleMouseLeave };
};
