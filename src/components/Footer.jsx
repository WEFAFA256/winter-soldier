import React from 'react';

const Footer = ({ mode }) => {
    const currentYear = new Date().getFullYear();

    if (mode === 'hotel') {
        return (
            <footer style={{ backgroundColor: '#8B4513', color: '#ffffff', padding: '2rem 0', textAlign: 'center' }}>
                <div className="container">
                    <p>&copy; {currentYear} Serenity Spa & The Marina Stays. All rights reserved.</p>
                </div>
            </footer>
        );
    }

    // Spa Mode (Default)
    return (
        <footer style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-white)', padding: '2rem 0', textAlign: 'center' }}>
            <div className="container">
                <p>&copy; {currentYear} Serenity Spa & The Marina Stays. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
