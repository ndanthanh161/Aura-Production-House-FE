import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const packages = [
    { id: 1, name: 'Essential', price: '$1,200', active: true },
    { id: 2, name: 'Premium', price: '$2,500', active: true },
    { id: 3, name: 'Executive', price: '$5,000', active: true },
];

const AdminPackages: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '2rem', color: '#fff' }}>Package Management</h1>
                <Button size="sm"><Plus size={18} style={{ marginRight: '8px' }} /> Create Package</Button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {packages.map(pkg => (
                    <div key={pkg.id} style={{ backgroundColor: '#0a0a0a', padding: '1.5rem', border: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>{pkg.name}</h3>
                            <p style={{ color: 'var(--color-accent)', fontWeight: '600' }}>{pkg.price}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button style={{ padding: '8px', color: 'rgba(255,255,255,0.5)' }}><Edit2 size={16} /></button>
                            <button style={{ padding: '8px', color: '#ef4444' }}><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPackages;
