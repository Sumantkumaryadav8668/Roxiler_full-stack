import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({
    name = 'password',
    value,
    onChange,
    placeholder = '••••••••',
    className = 'form-control',
    style = {},
    required = false,
    icon: LeftIcon = Lock,
    id,
    autoComplete
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            {LeftIcon && (
                <LeftIcon
                    size={18}
                    color="#94a3b8"
                    style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        zIndex: 1
                    }}
                />
            )}
            <input
                type={showPassword ? 'text' : 'password'}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={className}
                required={required}
                autoComplete={autoComplete}
                style={{
                    paddingLeft: LeftIcon ? '2.75rem' : '1rem',
                    paddingRight: '2.75rem',
                    width: '100%',
                    ...style
                }}
            />
            <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    padding: '0.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    outline: 'none',
                    transition: 'color 0.2s ease',
                    zIndex: 2
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
};

export default PasswordInput;
