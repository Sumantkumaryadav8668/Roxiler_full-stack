import React, { useState } from 'react';
import RatingInput from './RatingInput';
import { Store, MapPin, Star, Edit3 } from 'lucide-react';

const StoreCard = ({ store, onRate = () => {} }) => {
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [selectedRating, setSelectedRating] = useState(store.user_submitted_rating || 5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleRatingSubmit = async () => {
        setIsSubmitting(true);
        setErrorMsg('');
        try {
            await onRate(store, selectedRating);
            setIsRatingModalOpen(false);
        } catch (err) {
            setErrorMsg(err.message || 'Failed to save rating.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const overallRating = Number(store.overall_rating) || 0;
    const userRating = store.user_submitted_rating ? Number(store.user_submitted_rating) : null;

    return (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '1rem' }}>
                    <div style={{
                        backgroundColor: 'rgba(99, 102, 241, 0.15)',
                        padding: '0.65rem',
                        borderRadius: '10px',
                        color: '#6366f1'
                    }}>
                        <Store size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
                            {store.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                            <MapPin size={14} color="#64748b" />
                            <span>{store.address}</span>
                        </div>
                    </div>
                </div>

                
                <div style={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    border: '1px solid #334155'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Overall Rating:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <RatingInput value={overallRating} readOnly size={16} />
                            <span style={{ fontWeight: 800, color: '#f59e0b', fontSize: '0.95rem' }}>
                                {overallRating.toFixed(1)} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>({store.total_ratings || 0})</span>
                            </span>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #1e293b', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Your Submitted Rating:</span>
                        {userRating ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <RatingInput value={userRating} readOnly size={14} />
                                <span style={{ fontWeight: 700, color: '#6366f1', fontSize: '0.85rem' }}>
                                    {userRating} / 5
                                </span>
                            </div>
                        ) : (
                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                                Not rated yet
                            </span>
                        )}
                    </div>
                </div>
            </div>

            
            <button
                onClick={() => {
                    setSelectedRating(userRating || 5);
                    setIsRatingModalOpen(true);
                }}
                className={`btn ${userRating ? 'btn-secondary' : 'btn-primary'}`}
                style={{ width: '100%', marginTop: '0.5rem' }}
            >
                {userRating ? (
                    <>
                        <Edit3 size={16} />
                        <span>Modify Rating</span>
                    </>
                ) : (
                    <>
                        <Star size={16} />
                        <span>Submit Rating</span>
                    </>
                )}
            </button>

            
            {isRatingModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                                {userRating ? 'Modify Your Rating' : 'Submit Rating for Store'}
                            </h3>
                            <button onClick={() => setIsRatingModalOpen(false)} className="modal-close">✕</button>
                        </div>

                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                            Rate <strong style={{ color: '#f8fafc' }}>{store.name}</strong> from 1 to 5 stars.
                        </p>

                        {errorMsg && (
                            <div className="alert alert-danger">{errorMsg}</div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1.5rem 0' }}>
                            <RatingInput
                                value={selectedRating}
                                onChange={(val) => setSelectedRating(val)}
                                size={36}
                            />
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>
                                {selectedRating} / 5 Stars
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                            <button onClick={() => setIsRatingModalOpen(false)} className="btn btn-secondary">
                                Cancel
                            </button>
                            <button
                                onClick={handleRatingSubmit}
                                disabled={isSubmitting}
                                className="btn btn-primary"
                            >
                                {isSubmitting ? <div className="spinner"></div> : 'Save Rating'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreCard;
