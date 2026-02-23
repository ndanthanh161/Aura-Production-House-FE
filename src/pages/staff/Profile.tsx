import { Camera, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const StaffProfile: React.FC = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '800px' }}>
            <header>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Profile</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Manage your personal information and studio preferences.</p>
            </header>

            <section style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
                            alt="Profile"
                            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <button style={{ position: 'absolute', bottom: 0, right: 0, padding: '8px', backgroundColor: 'var(--color-accent)', borderRadius: '50%', color: 'var(--color-bg)' }}>
                            <Camera size={16} />
                        </button>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem' }}>Marcus Valerius</h3>
                        <p style={{ color: 'var(--color-accent)', fontSize: '0.875rem' }}>Lead Creative Director</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>First Name</label>
                        <input type="text" defaultValue="Marcus" style={{ padding: '0.75rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', color: '#fff' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Last Name</label>
                        <input type="text" defaultValue="Valerius" style={{ padding: '0.75rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', color: '#fff' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Email</label>
                        <input type="email" defaultValue="marcur@auraproduction.com" style={{ padding: '0.75rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', color: '#fff' }} />
                    </div>
                </div>

                <Button style={{ alignSelf: 'flex-start' }}>
                    <Save size={18} style={{ marginRight: '10px' }} /> Save Changes
                </Button>
            </section>
        </div>
    );
};

export default StaffProfile;
