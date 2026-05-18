import { useState } from 'react';

function Header() {
    
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: '#111827',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                padding: '1rem 1rem'
            }}
        >
            <h1
                style={{
                    margin: 0,
                    color: '#00ffff',
                    fontSize: '2rem',
                    fontFamily:
                        'Inter, Roboto, -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 700,
                    letterSpacing: '0.2px',
                }}
            >
                Snapbook
            </h1>
        </div>
    );
}

export default Header;
