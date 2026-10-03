import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { validatePassword } from '../utils/validation';
import { Key, Lock, CheckCircle } from 'lucide-react';

const ChangePassword = () => {
    const { changePassword } = useAuth();

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!formData.currentPassword) {
            setErrorMsg('Current password is required.');
            return;
        }

        const newPassErr = validatePassword(formData.newPassword);
        if (newPassErr) {
            setErrorMsg(newPassErr);
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMsg('New password and confirm password do not match.');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await changePassword(formData.currentPassword, formData.newPassword);
            if (res.success) {
                setSuccessMsg('Your password has been changed successfully!');
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (err) {
            setErrorMsg(err.message || 'Failed to change password.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: '600px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="page-title">Change Password</h1>
                <p className="page-subtitle">Update your account password to maintain maximum security</p>
            </div>

            <div className="glass-card">
                {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
                {successMsg && (
                    <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={18} />
                        <span>{successMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Current Password</label>
                        <div style={{ position: 'relative' }}>
                            <Key size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter current password"
                                className="form-control"
                                style={{ paddingLeft: '2.75rem' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">New Password (8-16 chars, 1 Uppercase, 1 Special Char)</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                className="form-control"
                                style={{ paddingLeft: '2.75rem' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm New Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter new password"
                                className="form-control"
                                style={{ paddingLeft: '2.75rem' }}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                        style={{ marginTop: '1rem' }}
                    >
                        {isSubmitting ? <div className="spinner"></div> : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
