import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getProfile, updateProfile } from '../services/authService.js';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import styles from './Profile.module.css';

function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(user);
  const [values, setValues] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      try {
        setLoading(true);
        setError('');

        const result = await getProfile();

        if (!ignore) {
          setProfile(result);
          setValues({
            name: result.name || '',
            phone: result.phone || '',
          });
          updateUser(result);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'No pudimos cargar tu perfil.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [updateUser]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (values.name.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres.');
      return;
    }

    if (values.name.trim().length > 100) {
      setError('El nombre no puede superar los 100 caracteres.');
      return;
    }

    if (values.phone.trim().length > 30) {
      setError('El teléfono no puede superar los 30 caracteres.');
      return;
    }

    setSaving(true);

    try {
      const updated = await updateProfile({
        name: values.name.trim(),
        phone: values.phone.trim(),
      });

      setProfile(updated);
      setValues({
        name: updated.name || '',
        phone: updated.phone || '',
      });
      updateUser(updated);
      setMessage('Tus datos se actualizaron correctamente.');
    } catch (err) {
      setError(err.message || 'No pudimos actualizar tu perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <section className={styles.page}>
        <p className={styles.loading} role="status">
          Cargando tu perfil...
        </p>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Mi perfil</h1>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      <div className={styles.layout}>
        <aside className={styles.summary}>
          <div className={styles.avatar} aria-hidden="true">
            {getInitials(profile?.name)}
          </div>

          <div>
            <p className={styles.name}>
              {profile?.name || 'Usuario'}
            </p>
            <p className={styles.email}>
              {profile?.email || ''}
            </p>
          </div>
        </aside>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Datos personales
            </h2>

            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <span className={styles.infoLabel}>
                  Correo electrónico
                </span>
                <span className={styles.infoValue}>
                  {profile?.email || 'No disponible'}
                </span>
              </div>

              <div className={styles.infoCard}>
                <span className={styles.infoLabel}>
                  Tipo de cuenta
                </span>
                <span className={styles.infoValue}>
                  {profile?.role === 'admin' ? 'Administrador' : 'Cliente'}
                </span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Editar mis datos
            </h2>

            <form onSubmit={handleSubmit} noValidate>
              <Input
                label="Nombre"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={values.name}
                onChange={handleChange}
                disabled={saving}
              />

              <Input
                label="Teléfono"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={handleChange}
                disabled={saving}
              />

              {message && (
                <p role="status">
                  {message}
                </p>
              )}

              <div className={styles.actions}>
                <Button
                  type="submit"
                  loading={saving}
                  disabled={saving}
                >
                  Guardar cambios
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </section>
  );
}

export default Profile;