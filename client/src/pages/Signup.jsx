import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    validateName,
    validateEmail,
    validatePassword,
    validateAddress
} from '../utils/validation';
import PasswordInput from '../components/PasswordInput';
import { User, Mail, MapPin, ArrowRight } from 'lucide-react';

const Signup = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        password: ''
    });

    const [errorMsg, setErrorMsg] = useState('');
    const [errorsList, setErrorsList] = useState([]);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (fieldErrors && fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setErrorsList([]);

        const nameErr = validateName(formData.name);
        const emailErr = validateEmail(formData.email);
        const addressErr = validateAddress(formData.address);
        const passErr = validatePassword(formData.password);

        if (nameErr || emailErr || addressErr || passErr) {
            setFieldErrors({
                name: nameErr,
                email: emailErr,
                address: addressErr,
                password: passErr
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await signup(formData);
            if (res.success) {
                navigate('/user/dashboard');
            }
        } catch (err) {
            setErrorMsg(err.message || 'Signup failed.');
            if (err.errors && Array.isArray(err.errors)) {
                setErrorsList(err.errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 80px)',
            padding: '2rem 1rem'
        }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create an Account</h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                        Join Roxiler Stores to discover and rate registered stores
                    </p>
                </div>

                {errorMsg && (
                    <div className="alert alert-danger" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: 700 }}>{errorMsg}</span>
                        {errorsList.length > 0 && (
                            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
                                {errorsList.map((err, idx) => (
                                    <li key={idx}>{err}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label className="form-label">Full Name (20 - 60 Characters)</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Johnathan Alexander Developer"
                                className="form-control"
                                style={{ paddingLeft: '2.75rem' }}
                                required
                            />
                        </div>
                        {fieldErrors?.name && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.name}</span>}
                    </div>

                    
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@domain.com"
                                className="form-control"
                                style={{ paddingLeft: '2.75rem' }}
                                required
                            />
                        </div>
                        {fieldErrors?.email && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.email}</span>}
                    </div>

                    
                    <div className="form-group">
                        <label className="form-label">Address (Max 400 Characters)</label>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your complete street address..."
                                className="form-control"
                                style={{ paddingLeft: '2.75rem' }}
                                required
                            />
                        </div>
                        {fieldErrors?.address && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.address}</span>}
                    </div>

                    
                    <div className="form-group">
                        <label className="form-label">Password (8-16 chars, 1 Uppercase, 1 Special Char)</label>
                        <PasswordInput
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="e.g. Password@123"
                            required
                        />
                        {fieldErrors?.password && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.password}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
                    >
                        {isSubmitting ? (
                            <div className="spinner"></div>
                        ) : (
                            <>
                                <span>Create Account</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #334155' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>
                            Log In
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Signup;
