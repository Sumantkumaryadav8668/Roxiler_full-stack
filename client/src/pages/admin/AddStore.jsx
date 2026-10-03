import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { validateEmail, validateAddress } from '../../utils/validation';
import { Store, Mail, MapPin, User, CheckCircle } from 'lucide-react';

const AddStore = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        owner_id: ''
    });

    const [storeOwners, setStoreOwners] = useState([]);
    const [loadingOwners, setLoadingOwners] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [errorsList, setErrorsList] = useState([]);
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const res = await adminAPI.getUsers({ role: 'STORE_OWNER' });
                if (res.success && res.data) {
                    setStoreOwners(res.data);
                }
            } catch (err) {
                console.error('Failed to load store owners:', err);
            } finally {
                setLoadingOwners(false);
            }
        };

        fetchOwners();
    }, []);

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

        
        if (!formData.name || formData.name.trim().length < 20 || formData.name.trim().length > 60) {
            setFieldErrors({ name: 'Store Name must be between 20 and 60 characters.' });
            return;
        }

        const emailErr = validateEmail(formData.email);
        const addressErr = validateAddress(formData.address);

        if (emailErr || addressErr) {
            setFieldErrors({ email: emailErr, address: addressErr });
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await adminAPI.addStore({
                name: formData.name.trim(),
                email: formData.email.trim(),
                address: formData.address.trim(),
                owner_id: formData.owner_id ? parseInt(formData.owner_id, 10) : null
            });

            if (res.success) {
                setSuccessMsg(`Store '${formData.name}' created successfully!`);
                setFormData({ name: '', email: '', address: '', owner_id: '' });
                setTimeout(() => navigate('/admin/stores'), 1500);
            }
        } catch (err) {
            setErrorMsg(err.message || 'Failed to add store.');
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
                <h1 className="page-title">Add New Store</h1>
                <p className="page-subtitle">Register a new store into the database and assign a store owner</p>
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
                        <label className="form-label">Store Name (20 - 60 Characters)</label>
                        <div style={{ position: 'relative' }}>
                            <Store size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. SuperTech Electronics Store Outlet"
                                className="form-control"
                                style={{ paddingLeft: '2.75rem' }}
                                required
                            />
                        </div>
                        {fieldErrors?.name && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.name}</span>}
                    </div>

                    
                    <div className="form-group">
                        <label className="form-label">Store Contact Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="store@domain.com"
                                className="form-control"
                                style={{ paddingLeft: '2.75rem' }}
                                required
                            />
                        </div>
                        {fieldErrors?.email && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.email}</span>}
                    </div>

                    
                    <div className="form-group">
                        <label className="form-label">Store Physical Address (Max 400 Characters)</label>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter physical street address..."
                                className="form-control"
                                style={{ paddingLeft: '2.75rem' }}
                                required
                            />
                        </div>
                        {fieldErrors?.address && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{fieldErrors.address}</span>}
                    </div>

                    
                    <div className="form-group">
                        <label className="form-label">Assign Store Owner (Optional)</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <select
                                name="owner_id"
                                value={formData.owner_id}
                                onChange={handleChange}
                                className="form-control"
                                style={{ paddingLeft: '2.75rem' }}
                            >
                                <option value="">-- No Owner Assigned --</option>
                                {storeOwners.map((owner) => (
                                    <option key={owner.id} value={owner.id}>
                                        {owner.name} ({owner.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        {loadingOwners && <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>Loading store owners list...</span>}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                        <button type="button" onClick={() => navigate('/admin/stores')} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                            {isSubmitting ? <div className="spinner"></div> : 'Create Store'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStore;
