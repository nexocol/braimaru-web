import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { formatCopPrice } from '../lib/format/price';
import type { ApiCategory, ApiProduct, SiteSettings } from '../lib/api/types';
import {
  AdminApiError,
  createAdminProduct,
  deleteAdminImage,
  deleteAdminProduct,
  fetchAdminCategories,
  fetchAdminProducts,
  fetchAdminSiteSettings,
  productToPayload,
  updateAdminProduct,
  updateAdminSiteSettings,
  uploadAdminImage,
  type AdminProductPayload,
} from './api';
import { AdminAuthError, fetchAdminSession, logoutAdmin } from './auth';
import { ProductForm } from './ProductForm';

export function AdminApp() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    whatsapp_phone: null,
    instagram_url: null,
    brand_email: null,
  });
  const [siteDraft, setSiteDraft] = useState<SiteSettings>({
    whatsapp_phone: null,
    instagram_url: null,
    brand_email: null,
  });
  const [savingSite, setSavingSite] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<ApiProduct | null | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiProduct | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const redirectToLogin = useCallback(() => {
    window.location.assign('/admin/login');
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage(null);

    try {
      const [productResponse, categoryResponse, siteResponse] = await Promise.all([
        fetchAdminProducts(),
        fetchAdminCategories(),
        fetchAdminSiteSettings(),
      ]);
      setProducts(productResponse.products);
      setCategories(categoryResponse.categories);
      setSiteSettings(siteResponse.settings);
      setSiteDraft(siteResponse.settings);
    } catch (error) {
      if (error instanceof AdminApiError && error.status === 401) {
        redirectToLogin();
        return;
      }

      setMessage({ type: 'error', text: 'No se pudo cargar el panel de productos.' });
    } finally {
      setLoading(false);
    }
  }, [redirectToLogin]);

  useEffect(() => {
    let cancelled = false;

    fetchAdminSession()
      .then((session) => {
        if (cancelled) return;
        if (!session.authenticated) {
          redirectToLogin();
          return;
        }

        setUsername(session.username ?? null);
        setSessionLoading(false);
        void load();
      })
      .catch((error) => {
        if (cancelled) return;
        if (error instanceof AdminAuthError && error.status === 401) {
          redirectToLogin();
          return;
        }

        setMessage({ type: 'error', text: 'No se pudo validar la sesión administrativa.' });
        setSessionLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [load, redirectToLogin]);

  const saveSiteSettings = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingSite(true);
    setMessage(null);

    try {
      const response = await updateAdminSiteSettings(siteDraft);
      setSiteSettings(response.settings);
      setSiteDraft(response.settings);
      setMessage({ type: 'success', text: 'Información del sitio actualizada.' });
    } catch (error) {
      if (error instanceof AdminApiError && error.status === 401) {
        redirectToLogin();
        return;
      }

      setMessage({
        type: 'error',
        text: error instanceof AdminApiError ? error.message : 'No se pudo actualizar la información del sitio.',
      });
    } finally {
      setSavingSite(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    setMessage(null);

    try {
      await logoutAdmin();
      redirectToLogin();
    } catch {
      setMessage({ type: 'error', text: 'No se pudo cerrar la sesión. Intenta nuevamente.' });
      setLoggingOut(false);
    }
  };

  const saveProduct = async (payload: AdminProductPayload, imageFile: File | null) => {
    setSubmitting(true);
    setMessage(null);
    let uploadedKey: string | null = null;

    try {
      let nextPayload = payload;

      if (imageFile) {
        const uploaded = await uploadAdminImage(imageFile);
        uploadedKey = uploaded.key;
        nextPayload = { ...payload, image_key: uploaded.key };
      }

      if (editing) {
        await updateAdminProduct(editing.id, nextPayload);
        setMessage({ type: 'success', text: 'Producto actualizado.' });
      } else {
        await createAdminProduct(nextPayload);
        setMessage({ type: 'success', text: 'Producto creado.' });
      }

      setEditing(undefined);
      await load();
    } catch (error) {
      if (uploadedKey) {
        await deleteAdminImage(uploadedKey).catch(() => undefined);
      }

      if (error instanceof AdminApiError && error.status === 401) {
        redirectToLogin();
        return;
      }

      const text = error instanceof AdminApiError ? error.message : 'No se pudo guardar el producto.';
      setMessage({ type: 'error', text });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleVisibility = async (product: ApiProduct) => {
    setMessage(null);
    try {
      await updateAdminProduct(product.id, productToPayload(product, { active: !product.active }));
      await load();
    } catch (error) {
      if (error instanceof AdminApiError && error.status === 401) {
        redirectToLogin();
        return;
      }

      setMessage({
        type: 'error',
        text: error instanceof AdminApiError ? error.message : 'No se pudo cambiar la visibilidad.',
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setSubmitting(true);
    setMessage(null);
    try {
      await deleteAdminProduct(deleteTarget.id);
      setDeleteTarget(null);
      setMessage({ type: 'success', text: 'Producto eliminado.' });
      await load();
    } catch (error) {
      if (error instanceof AdminApiError && error.status === 401) {
        redirectToLogin();
        return;
      }

      setMessage({
        type: 'error',
        text: error instanceof AdminApiError ? error.message : 'No se pudo eliminar el producto.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (sessionLoading) {
    return (
      <main className="admin-shell">
        <p className="admin-empty" aria-live="polite">Validando sesión…</p>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="admin-kicker">BRAIMARÚ Admin</p>
          <h1>Productos</h1>
          {username ? <p className="admin-session-user">Sesión: {username}</p> : null}
        </div>
        <div className="admin-header-actions">
          <a className="admin-button admin-button--quiet" href="/">Ver sitio</a>
          <button
            className="admin-button admin-button--quiet"
            type="button"
            disabled={loggingOut}
            onClick={() => void handleLogout()}
          >
            {loggingOut ? 'Saliendo…' : 'Cerrar sesión'}
          </button>
          <button className="admin-button admin-button--primary" type="button" onClick={() => setEditing(null)}>
            Nuevo producto
          </button>
        </div>
      </header>

      {message ? (
        <p
          className={`admin-message admin-message--${message.type}`}
          role={message.type === 'error' ? 'alert' : 'status'}
        >
          {message.text}
        </p>
      ) : null}

      <section className="admin-site-card" aria-labelledby="site-settings-title">
        <div className="admin-site-card__intro">
          <p className="admin-kicker">Información del sitio</p>
          <h2 id="site-settings-title">Contacto y canales</h2>
          <p>
            Estos datos alimentan los botones de WhatsApp y los enlaces de contacto del sitio público.
          </p>
        </div>

        <form className="admin-site-form" onSubmit={(event) => void saveSiteSettings(event)}>
          <label>
            <span>WhatsApp</span>
            <input
              type="tel"
              inputMode="tel"
              value={siteDraft.whatsapp_phone ?? ''}
              onChange={(event) => setSiteDraft((current) => ({ ...current, whatsapp_phone: event.target.value || null }))}
              placeholder="57 + número, sin espacios"
              autoComplete="tel"
            />
            <small>Incluye el código de país. Ejemplo de formato: 57XXXXXXXXXX.</small>
          </label>

          <label>
            <span>Instagram</span>
            <input
              type="url"
              value={siteDraft.instagram_url ?? ''}
              onChange={(event) => setSiteDraft((current) => ({ ...current, instagram_url: event.target.value || null }))}
              placeholder="https://instagram.com/..."
              autoComplete="url"
            />
          </label>

          <label>
            <span>Correo de la marca</span>
            <input
              type="email"
              value={siteDraft.brand_email ?? ''}
              onChange={(event) => setSiteDraft((current) => ({ ...current, brand_email: event.target.value || null }))}
              placeholder="correo@marca.com"
              autoComplete="email"
            />
          </label>

          <div className="admin-site-form__actions">
            <button
              className="admin-button admin-button--primary"
              type="submit"
              disabled={savingSite}
            >
              {savingSite ? 'Guardando…' : 'Guardar información'}
            </button>
            {siteSettings.whatsapp_phone || siteSettings.instagram_url || siteSettings.brand_email ? (
              <span>Configuración activa en Production después del guardado.</span>
            ) : (
              <span>Aún no hay datos de contacto configurados.</span>
            )}
          </div>
        </form>
      </section>

      <AnimatePresence>
        {editing !== undefined ? (
          <motion.section
            className="admin-editor-panel"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <ProductForm
              categories={categories}
              product={editing}
              submitting={submitting}
              onCancel={() => setEditing(undefined)}
              onSubmit={saveProduct}
            />
          </motion.section>
        ) : null}
      </AnimatePresence>

      {deleteTarget ? (
        <section className="admin-confirm" role="alertdialog" aria-labelledby="delete-title">
          <div>
            <p className="admin-kicker">Confirmación</p>
            <h2 id="delete-title">¿Eliminar {deleteTarget.name}?</h2>
            <p>Esta acción eliminará el producto del catálogo.</p>
          </div>
          <div className="admin-confirm-actions">
            <button className="admin-button admin-button--quiet" type="button" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </button>
            <button className="admin-button admin-button--danger" type="button" disabled={submitting} onClick={() => void confirmDelete()}>
              Eliminar
            </button>
          </div>
        </section>
      ) : null}

      <section className="admin-table-card" aria-busy={loading}>
        {loading ? <p className="admin-empty">Cargando productos…</p> : null}

        {!loading && products.length === 0 && !message ? (
          <div className="admin-empty">
            <h2>Aún no hay productos.</h2>
            <p>Crea el primero para comenzar a administrar el catálogo.</p>
          </div>
        ) : null}

        {products.length > 0 ? (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Destacado</th>
                  <th>Orden</th>
                  <th><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-product-cell">
                        <div className="admin-thumb">
                          {product.image_url ? <img src={product.image_url} alt="" /> : <span>B</span>}
                        </div>
                        <div>
                          <strong>{product.name}</strong>
                          <span>{product.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td>{product.category.name}</td>
                    <td>{formatCopPrice(product.price_cop) ?? 'Sin configurar'}</td>
                    <td>
                      <span className={product.active ? 'admin-status is-active' : 'admin-status'}>
                        {product.active ? 'Activo' : 'Oculto'}
                      </span>
                    </td>
                    <td>{product.featured ? 'Sí' : 'No'}</td>
                    <td>{product.sort_order}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button type="button" onClick={() => setEditing(product)}>Editar</button>
                        <button type="button" onClick={() => void toggleVisibility(product)}>
                          {product.active ? 'Ocultar' : 'Activar'}
                        </button>
                        <button type="button" onClick={() => setDeleteTarget(product)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </main>
  );
}
