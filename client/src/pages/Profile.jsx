import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Field from '../components/common/Field.jsx';
import Toast from '../components/common/Toast.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { getProfile, updateProfile } from '../services/authService.js';

import styles from './Profile.module.css';
import formStyles from '../components/forms/Form.module.css';
import alertStyles from '../components/common/Alert.module.css';

const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

const formatDate = (value) =>
  new Date(value).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

// Mismas reglas que backend/src/validators/userValidator.js (validateUpdateProfile).
function validate({ name, phone }) {
  const errors = {};
  if (name.trim().length < 2) errors.name = 'El nombre debe tener al menos 2 caracteres.';
  else if (name.trim().length > 100) errors.name = 'El nombre no puede superar los 100 caracteres.';
  if (phone.trim().length > 30) errors.phone = 'El teléfono no puede superar los 30 caracteres.';
  return errors;
}

function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // Se muestra el usuario del contexto y se refresca con GET /users/profile.
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let ignore = false;
    getProfile()
      .then((profile) => {
        if (!ignore) updateUser(profile);
      })
      .catch(() => {
        // Si falla, se sigue mostrando el usuario que ya estaba en el contexto.
      })
      .finally(() => {
        if (!ignore) setIsRefreshing(false);
      });
    return () => {
      ignore = true;
    };
  }, [updateUser]);

  const closeToast = useCallback(() => setToast(null), []);

  if (!user) return null; // ProtectedRoute ya garantiza sesión; esto es solo por seguridad.

  const startEditing = () => {
    setForm({ name: user.name ?? '', phone: user.phone ?? '' });
    setErrors({});
    setSaveError(null);
    setIsEditing(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaveError(null);

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);
    try {
      const updated = await updateProfile({ name: form.name.trim(), phone: form.phone.trim() });
      updateUser(updated);
      setIsEditing(false);
      setToast('Datos actualizados');
    } catch (err) {
      setSaveError(err.message || 'No pudimos guardar los cambios.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fieldProps = (name) => ({ name, value: form[name], onChange: handleChange, disabled: isSaving });

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Mi cuenta</h1>

      <div className={isRefreshing ? `${styles.layout} ${styles.loading}` : styles.layout} aria-busy={isRefreshing}>
        <aside className={styles.summary}>
          <div className={styles.avatar} aria-hidden="true">
            {initials(user.name)}
          </div>
          <div>
            <p className={styles.name}>{user.name}</p>
            <p className={styles.email}>{user.email}</p>
          </div>
        </aside>

        <div className={styles.content}>
          <section className={styles.section} aria-labelledby="profile-data">
            <h2 id="profile-data" className={styles.sectionTitle}>
              Mis datos
            </h2>

            {isEditing ? (
              <form className={formStyles.form} onSubmit={handleSave} noValidate>
                <Field id="profile-name" label="Nombre" required error={errors.name}>
                  <input type="text" autoComplete="name" {...fieldProps('name')} />
                </Field>
                <Field id="profile-phone" label="Teléfono" hint="Opcional" error={errors.phone}>
                  <input type="tel" autoComplete="tel" {...fieldProps('phone')} />
                </Field>

                {saveError && (
                  <p className={`${formStyles.formAlert} ${alertStyles.alert} ${alertStyles.error}`} role="alert">
                    {saveError}
                  </p>
                )}

                <div className={styles.actions}>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className={styles.infoGrid}>
                  <div className={styles.infoCard}>
                    <span className={styles.infoLabel}>Nombre</span>
                    <span className={styles.infoValue}>{user.name}</span>
                  </div>
                  <div className={styles.infoCard}>
                    <span className={styles.infoLabel}>Email</span>
                    <span className={styles.infoValue}>{user.email}</span>
                  </div>
                  <div className={styles.infoCard}>
                    <span className={styles.infoLabel}>Teléfono</span>
                    {user.phone ? (
                      <span className={styles.infoValue}>{user.phone}</span>
                    ) : (
                      <span className={styles.infoEmpty}>Sin teléfono cargado</span>
                    )}
                  </div>
                  {user.createdAt && (
                    <div className={styles.infoCard}>
                      <span className={styles.infoLabel}>Cliente desde</span>
                      <span className={styles.infoValue}>{formatDate(user.createdAt)}</span>
                    </div>
                  )}
                </div>

                <div className={styles.actions}>
                  <Button onClick={startEditing}>Editar datos</Button>
                  <Button variant="outline" to="/mis-pedidos">
                    Mis pedidos
                  </Button>
                  <Button variant="ghost" onClick={handleLogout}>
                    Cerrar sesión
                  </Button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      <Toast message={toast} type="success" onClose={closeToast} />
    </section>
  );
}

export default Profile;
