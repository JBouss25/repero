import { redirect } from 'next/navigation';
import { readSession } from '@/lib/oidc/session';

export default async function LoginPage() {
  const session = await readSession();
  if (session) redirect('/dashboard');

  return (
    <main style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', padding: 24 }}>
      <div style={{ maxWidth: 420, textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>Repero</h1>
        <p style={{ color: '#555', marginBottom: 24 }}>
          15 minutes par jour pour consolider durablement.
        </p>
        <a
          href="/api/auth/login"
          style={{
            display: 'inline-block',
            padding: '12px 20px',
            background: '#0f172a',
            color: '#fff',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Se connecter avec OoStudy
        </a>
        <p style={{ marginTop: 24, fontSize: 12, color: '#888' }}>
          Repero est un produit OoStudy. Vous serez redirige vers l authentification OoStudy.
        </p>
      </div>
    </main>
  );
}