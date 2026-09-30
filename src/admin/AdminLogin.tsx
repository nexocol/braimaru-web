import { useState, type FormEvent } from 'react';
import { AdminAuthError, loginAdmin } from './auth';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await loginAdmin(username.trim(), password);
      window.location.assign('/admin');
    } catch (loginError) {
      if (loginError instanceof AdminAuthError && loginError.status === 401) {
        setError('Usuario o contraseña incorrectos.');
      } else if (
        loginError instanceof AdminAuthError &&
        loginError.code === 'auth_not_configured'
      ) {
        setError('El acceso administrativo todavía no está configurado.');
      } else {
        setError('No fue posible iniciar sesión. Intenta nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <div className="admin-login-brand">
          <p className="admin-kicker">BRAIMARÚ Admin</p>
          <h1 id="admin-login-title">Iniciar sesión</h1>
          <p>Acceso exclusivo para administración del catálogo.</p>
        </div>

        <form className="admin-login-form" onSubmit={submit}>
          <label>
            <span>Usuario</span>
            <input
              autoComplete="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

          <label>
            <span>Contraseña</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? (
            <p className="admin-message admin-message--error" role="alert">
              {error}
            </p>
          ) : null}

          <button
            className="admin-button admin-button--primary admin-login-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  );
}
