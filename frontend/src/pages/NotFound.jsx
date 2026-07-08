import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <ShieldAlert size={64} color="var(--accent-urgent)" />
        </div>
        <h1 style={styles.title}>404 - Page Not Found</h1>
        <p style={styles.text}>
          The requested government advisory page or resource could not be located in the KrishiMitraaz system. 
          The link may be broken, or the page may have been moved.
        </p>
        <Link to="/" style={styles.button}>
          <ArrowLeft size={18} />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, var(--primary-green-dark), var(--primary-green))',
    padding: '20px',
  },
  card: {
    background: 'white',
    padding: '3rem 2rem',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },
  iconWrapper: {
    background: '#FFF3F3',
    padding: '20px',
    borderRadius: '50%',
    marginBottom: '10px',
  },
  title: {
    color: '#333',
    fontSize: '2rem',
    margin: 0,
    fontWeight: '800',
  },
  text: {
    color: 'var(--text-muted)',
    fontSize: '1.1rem',
    lineHeight: 1.6,
    margin: 0,
  },
  button: {
    marginTop: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: 'var(--primary-green)',
    color: 'white',
    textDecoration: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
  }
};
