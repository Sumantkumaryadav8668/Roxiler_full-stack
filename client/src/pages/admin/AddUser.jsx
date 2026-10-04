import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { validateName, validateEmail, validatePassword, validateAddress } from '../../utils/validation';
import PasswordInput from '../../components/PasswordInput';
import { User, Mail, MapPin, Shield, CheckCircle } from 'lucide-react';

const AddUser = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        password: '',
        role: 'USER'
    });

    const [errorMsg, setErrorMsg] = useState('');
    const [errorsList, setErrorsList] = useState([]);
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (fieldErrors && fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
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
            const res = await adminAPI.addUser(formData);
            if (res.success) {
                setSuccessMsg(`User '${formData.name}' created successfully with role ${formData.role}!`);
                setFormData({ name: '', email: '', address: '', password: '', role: 'USER' });
                setTimeout(() => navigate('/admin/users'), 1500);
            }
        } catch (err) {
            setErrorMsg(err.message || 'Failed to add user.');
            if (err.errors && Array.isArray(err.errors)) {
                setErrorsList(err.errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: '640px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="page-title">Add New User</h1>
                <p className="page-subtitle">Create system administrators, normal users, or store owners</p>
            </div>

            <div className="glass-card">
                {errorMsg && (
                    <div className="alert alert-danger" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: 700 }}>{errorMsg}</span>
                        {errorsList.length > 0 && (
                            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
                                {errorsList.map((err, idx) => <li key={idx}>{err}</li>)}
                            </ul>
                        )}
                    </div>
                )}

                {successMsg && (
                    <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={18} />
                        <span>{successMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label className="form-label">User Role</label>
                        <div style={{ position: 'relative' }}>
                            <Shield size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="form-control"
                                style={{ paddingLeft: '2.75rem' }}
                            >
                                <option value="USER">USER (Normal Customer)</option>
                                <option value="ADMIN">ADMIN (System Administrator)</option>
                                <option value="STORE_OWNER">STORE_OWNER (Store Owner)</option>
                            </select>
                        </div>
                    </div>

                    
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
                                placeholder="Enter address..."
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

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                        <button type="button" onClick={() => navigate('/admin/users')} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                            {isSubmitting ? <div className="spinner"></div> : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
