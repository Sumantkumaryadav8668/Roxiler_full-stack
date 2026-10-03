import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const DataTable = ({
    columns = [],
    data = [],
    sortBy = '',
    sortOrder = 'ASC',
    onSort = () => {},
    emptyMessage = 'No records found.',
    loading = false
}) => {
    const handleHeaderClick = (col) => {
        if (!col.sortable) return;
        const newOrder = sortBy === col.key && sortOrder === 'ASC' ? 'DESC' : 'ASC';
        onSort(col.key, newOrder);
    };

    if (loading) {
        return (
            <div style={{
                padding: '3rem',
                textAlign: 'center',
                backgroundColor: '#1e293b',
                borderRadius: '12px',
                border: '1px solid #334155'
            }}>
                <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
                <span style={{ color: '#94a3b8' }}>Loading records...</span>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((col) => {
                            const isSorted = sortBy === col.key;
                            return (
                                <th
                                    key={col.key}
                                    onClick={() => handleHeaderClick(col)}
                                    className={col.sortable ? 'sortable' : ''}
                                    style={{ width: col.width || 'auto' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <span>{col.label}</span>
                                        {col.sortable && (
                                            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                {isSorted ? (
                                                    sortOrder === 'ASC' ? (
                                                        <ArrowUp size={14} color="#6366f1" />
                                                    ) : (
                                                        <ArrowDown size={14} color="#6366f1" />
                                                    )
                                                ) : (
                                                    <ArrowUpDown size={14} color="#64748b" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr key={row.id || rowIndex}>
                                {columns.map((col) => (
                                    <td key={col.key}>
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
