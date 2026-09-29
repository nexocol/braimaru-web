import { useEffect, useState, type FormEvent } from 'react';
import type { ApiCategory, ApiProduct } from '../lib/api/types';
import type { AdminProductPayload } from './api';
import { parseCopInput, priceToInput } from './priceInput';

const RITUAL_OPTIONS = [
  ['hidratar', 'Hidratar'],
  ['nutrir', 'Nutrir'],
  ['exfoliar', 'Exfoliar'],
  ['cuidado-corporal', 'Cuidado corporal'],
  ['cuidado-capilar', 'Cuidado capilar'],
] as const;

interface ProductFormProps {
  categories: ApiCategory[];
  product?: ApiProduct | null;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (payload: AdminProductPayload, imageFile: File | null) => Promise<void>;
}

function initialForm(product?: ApiProduct | null): AdminProductPayload {
  return {
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    category_id: product?.category.id ?? '',
    short_description: product?.short_description ?? '',
    description: product?.description ?? null,
    benefits: product?.benefits.length ? product.benefits : [''],
    price_cop: product?.price_cop ?? null,
    image_key: product?.image_key ?? null,
    ritual_tags: product?.ritual_tags ?? [],
    featured: product?.featured ?? false,
    active: product?.active ?? true,
    sort_order: product?.sort_order ?? 0,
  };
}

export function ProductForm({
  categories,
  product,
  submitting,
  onCancel,
  onSubmit,
}: ProductFormProps) {
  const [form, setForm] = useState(() => initialForm(product));
  const [priceInput, setPriceInput] = useState(() => priceToInput(product?.price_cop ?? null));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  useEffect(() => {
    setForm(initialForm(product));
    setPriceInput(priceToInput(product?.price_cop ?? null));
    setImageFile(null);
    setClientError(null);
  }, [product]);

  const updateBenefit = (index: number, value: string) => {
    setForm((current) => ({
      ...current,
      benefits: current.benefits.map((benefit, benefitIndex) =>
        benefitIndex === index ? value : benefit,
      ),
    }));
  };

  const toggleRitual = (tag: string) => {
    setForm((current) => ({
      ...current,
      ritual_tags: current.ritual_tags.includes(tag)
        ? current.ritual_tags.filter((item) => item !== tag)
        : [...current.ritual_tags, tag],
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setClientError(null);

    if (!form.name.trim() || !form.slug.trim() || !form.category_id || !form.short_description.trim()) {
      setClientError('Completa nombre, slug, categoría y descripción corta.');
      return;
    }

    if (imageFile) {
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
      if (!allowed.includes(imageFile.type)) {
        setClientError('La imagen debe ser JPG, PNG, WebP o AVIF.');
        return;
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        setClientError('La imagen no puede superar 5 MB.');
        return;
      }
    }

    const priceCop = priceInput.trim() ? parseCopInput(priceInput) : null;
    if (priceInput.trim() && priceCop === null) {
      setClientError('Ingresa un precio COP válido.');
      return;
    }

    await onSubmit(
      {
        ...form,
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
        short_description: form.short_description.trim(),
        description: form.description?.trim() || null,
        benefits: form.benefits.map((benefit) => benefit.trim()).filter(Boolean),
        price_cop: priceCop,
      },
      imageFile,
    );
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-heading">
        <div>
          <p className="admin-kicker">{product ? 'Editar producto' : 'Nuevo producto'}</p>
          <h2>{product?.name ?? 'Crear producto'}</h2>
        </div>
        <button className="admin-button admin-button--quiet" type="button" onClick={onCancel}>
          Cerrar
        </button>
      </div>

      {clientError ? <p className="admin-message admin-message--error" role="alert">{clientError}</p> : null}

      <div className="admin-form-grid">
        <label>
          <span>Nombre</span>
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>

        <label>
          <span>Slug</span>
          <input
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            value={form.slug}
            onChange={(event) => setForm({ ...form, slug: event.target.value })}
          />
        </label>

        <label>
          <span>Categoría</span>
          <select
            required
            value={form.category_id}
            onChange={(event) => setForm({ ...form, category_id: event.target.value })}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Precio COP</span>
          <input
            inputMode="numeric"
            placeholder="49.900"
            value={priceInput}
            onChange={(event) => setPriceInput(event.target.value)}
          />
        </label>

        <label className="admin-field--wide">
          <span>Descripción corta</span>
          <input
            required
            maxLength={280}
            value={form.short_description}
            onChange={(event) => setForm({ ...form, short_description: event.target.value })}
          />
        </label>

        <label className="admin-field--wide">
          <span>Descripción</span>
          <textarea
            rows={4}
            maxLength={3000}
            value={form.description ?? ''}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
        </label>

        <fieldset className="admin-field--wide">
          <legend>Beneficios</legend>
          <div className="admin-benefits">
            {form.benefits.map((benefit, index) => (
              <div className="admin-inline-field" key={index}>
                <input
                  aria-label={`Beneficio ${index + 1}`}
                  maxLength={160}
                  value={benefit}
                  onChange={(event) => updateBenefit(index, event.target.value)}
                />
                {form.benefits.length > 1 ? (
                  <button
                    className="admin-icon-button"
                    type="button"
                    aria-label={`Eliminar beneficio ${index + 1}`}
                    onClick={() =>
                      setForm({
                        ...form,
                        benefits: form.benefits.filter((_, benefitIndex) => benefitIndex !== index),
                      })
                    }
                  >
                    ×
                  </button>
                ) : null}
              </div>
            ))}
            <button
              className="admin-button admin-button--quiet"
              type="button"
              onClick={() => setForm({ ...form, benefits: [...form.benefits, ''] })}
            >
              Agregar beneficio
            </button>
          </div>
        </fieldset>

        <fieldset className="admin-field--wide">
          <legend>Rituales</legend>
          <div className="admin-check-grid">
            {RITUAL_OPTIONS.map(([id, label]) => (
              <label className="admin-check" key={id}>
                <input
                  type="checkbox"
                  checked={form.ritual_tags.includes(id)}
                  onChange={() => toggleRitual(id)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label>
          <span>Orden</span>
          <input
            type="number"
            min={0}
            step={1}
            value={form.sort_order}
            onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) })}
          />
        </label>

        <label>
          <span>Imagen</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
          />
        </label>

        <div className="admin-check-grid admin-field--wide">
          <label className="admin-check">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => setForm({ ...form, featured: event.target.checked })}
            />
            <span>Destacado</span>
          </label>
          <label className="admin-check">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => setForm({ ...form, active: event.target.checked })}
            />
            <span>Activo</span>
          </label>
        </div>
      </div>

      <div className="admin-form-actions">
        <button className="admin-button admin-button--primary" type="submit" disabled={submitting}>
          {submitting ? 'Guardando…' : product ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </form>
  );
}
