import { useState } from 'react';
import './ContactForm.css';

export default function ContactForm() {
  // Estado controlado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tipoConsulta: 'encargo',
    mensaje: ''
  });

  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [enviadoExito, setEnviadoExito] = useState(false);

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo modificado
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validación del lado del cliente (RF5)
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre completo es obligatorio.';
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = 'Ingrese un formato de correo electrónico válido.';
    }

    if (!formData.mensaje.trim()) {
      nuevosErrores.mensaje = 'Por favor, detalla tu mensaje o consulta.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Simulación de envío
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setEnviando(true);

    // Simulación de envío asíncrono
    setTimeout(() => {
      setEnviando(false);
      setEnviadoExito(true);
      // Reiniciar formulario
      setFormData({
        nombre: '',
        email: '',
        tipoConsulta: 'encargo',
        mensaje: ''
      });
    }, 1000);
  };

  return (
    <form className="contact-form-card" onSubmit={handleSubmit}>
      {/* Nombre Completo */}
      <div className="form-group">
        <label className="form-label" htmlFor="nombre">
          Nombre Completo *
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          className="form-input"
          placeholder="Ej. Victoria Soler"
          value={formData.nombre}
          onChange={handleChange}
        />
        {errores.nombre && <span className="form-error-msg">{errores.nombre}</span>}
      </div>

      {/* Correo Electrónico */}
      <div className="form-group">
        <label className="form-label" htmlFor="email">
          Correo Electrónico *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-input"
          placeholder="victoria@ejemplo.com"
          value={formData.email}
          onChange={handleChange}
        />
        {errores.email && <span className="form-error-msg">{errores.email}</span>}
      </div>

      {/* Tipo de Consulta */}
      <div className="form-group">
        <label className="form-label" htmlFor="tipoConsulta">
          Tipo de Proyecto / Consulta
        </label>
        <select
          id="tipoConsulta"
          name="tipoConsulta"
          className="form-select"
          value={formData.tipoConsulta}
          onChange={handleChange}
        >
          <option value="encargo">Mueble a Medida</option>
          <option value="interiorismo">Asesoría de Interiorismo</option>
          <option value="muestrario">Solicitud de Muestrario de Maderas</option>
          <option value="pedido">Consulta de Pedido</option>
        </select>
      </div>

      {/* Mensaje */}
      <div className="form-group">
        <label className="form-label" htmlFor="mensaje">
          Mensaje / Detalles del Espacio *
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows="4"
          className="form-textarea"
          placeholder="Cuéntanos sobre las dimensiones, ambientes o requerimientos específicos..."
          value={formData.mensaje}
          onChange={handleChange}
        />
        {errores.mensaje && <span className="form-error-msg">{errores.mensaje}</span>}
      </div>

      {/* Botón de Envío */}
      <button type="submit" className="btn-submit" disabled={enviando}>
        {enviando ? 'Enviando Mensaje...' : 'Enviar Mensaje'}
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
          arrow_forward
        </span>
      </button>

      {/* Banner de Éxito */}
      {enviadoExito && (
        <div className="success-banner">
          <span className="material-symbols-outlined">check_circle</span>
          <span>¡Mensaje enviado con éxito! Un maestro ebanista te responderá a la brevedad.</span>
        </div>
      )}
    </form>
  );
}