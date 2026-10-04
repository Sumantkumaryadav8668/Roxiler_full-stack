import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validation';
import PasswordInput from '../components/PasswordInput';
import { Store, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errorMsg, setErrorMsg] = useState('');
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
        setFieldErrors({});

        
        const emailErr = validateEmail(formData.email);
        if (emailErr) {
            setFieldErrors({ email: emailErr });
            return;
        }

        if (!formData.password) {
            setFieldErrors({ password: 'Password is required.' });
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await login(formData.email, formData.password);
            if (res.success && res.data) {
                const userRole = res.data.user.role;
                if (userRole === 'ADMIN') navigate('/admin/dashboard');
                else if (userRole === 'STORE_OWNER') navigate('/owner/dashboard');
                else navigate('/user/dashboard');
            }
        } catch (err) {
            setErrorMsg(err.message || 'Login failed. Please check your credentials.');
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
            <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: '#6366f1',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem auto'
                    }}>
                        <Store size={28} color="#ffffff" />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome Back</h2>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                        Sign in to access your store portal account
                    </p>
                </div>

                {errorMsg && (
                    <div className="alert alert-danger">
                        <span>{errorMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
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
                        <label className="form-label">Password</label>
                        <PasswordInput
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
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
                                <span>Sign In</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #334155' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>
                            Sign Up
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
