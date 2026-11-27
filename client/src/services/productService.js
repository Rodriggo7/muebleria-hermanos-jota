import { apiFetch, USE_MOCK } from './api.js';

const MOCK_DELAY_MS = 400;

// PROVISIONAL: price, stock y category son inventados para el mock.
// Los valores reales salen de la base de datos (confirmar con Pablo).
// `specs` es un campo opcional que la API todavía no define.
const MOCK_PRODUCTS = [
  { _id: '1', name: 'Aparador Uspallata', description: 'Aparador de seis puertas fabricado en nogal sostenible con tiradores metálicos en acabado latón. Su silueta minimalista realza el veteado natural de la madera, creando una pieza que combina funcionalidad y elegancia atemporal para espacios contemporáneos.', price: 890000, category: 'comedor', stock: 3, images: ['/images/aparador-uspallata.png'], specs: [{ label: 'Medidas', value: '180 × 45 × 75 cm' }, { label: 'Materiales', value: 'Nogal macizo FSC®, herrajes de latón' }, { label: 'Acabado', value: 'Aceite natural ecológico' }, { label: 'Peso', value: '68 kg' }, { label: 'Capacidad', value: '6 compartimentos interiores' }] },
  { _id: '2', name: 'Butaca Mendoza', description: 'Butaca tapizada en bouclé Dusty Rose con base de madera de guatambú. El respaldo curvo abraza el cuerpo y ofrece máximo confort, mientras que su diseño orgánico aporta calidez y sofisticación a cualquier ambiente contemporáneo.', price: 420000, category: 'living', stock: 6, images: ['/images/butaca-mendoza.png'], specs: [{ label: 'Medidas', value: '80 × 75 × 85 cm' }, { label: 'Materiales', value: 'Guatambú macizo, tela bouclé' }, { label: 'Acabado', value: 'Cera vegetal, tapizado premium' }, { label: 'Tapizado', value: 'Repelente al agua y manchas' }, { label: 'Confort', value: 'Espuma alta densidad' }] },
  { _id: '3', name: 'Sillón Copacabana', description: 'Sillón lounge en cuero cognac con base giratoria en acero Burnt Sienna. Inspirado en la estética brasilera moderna de los 60, combina comodidad excepcional con un diseño icónico que trasciende tendencias y épocas.', price: 780000, category: 'living', stock: 2, images: ['/images/sillon-copacabana.png'], specs: [{ label: 'Medidas', value: '90 × 85 × 95 cm' }, { label: 'Materiales', value: 'Cuero curtido vegetal, acero pintado' }, { label: 'Acabado', value: 'Cuero anilina premium' }, { label: 'Rotación', value: '360° silenciosa y suave' }, { label: 'Garantía', value: '10 años en estructura' }] },
  { _id: '4', name: 'Mesa de Centro Araucaria', description: 'Mesa de centro con sobre circular de mármol Patagonia y base de tres patas en madera de nogal. Su diseño minimalista se convierte en el punto focal perfecto para cualquier sala de estar contemporánea, combinando la frialdad del mármol con la calidez de la madera.', price: 350000, category: 'living', stock: 5, images: ['/images/mesa-de-centro-araucaria.png'], specs: [{ label: 'Medidas', value: '90 × 90 × 45 cm' }, { label: 'Materiales', value: 'Sobre de mármol Patagonia, patas de nogal' }, { label: 'Acabado', value: 'Mármol pulido, aceite natural en madera' }, { label: 'Peso', value: '42 kg' }, { label: 'Carga máxima', value: '25 kg distribuidos' }] },
  { _id: '5', name: 'Mesa de Noche Aconcagua', description: 'Mesa de noche con cajón oculto y repisa inferior en roble certificado FSC®. Su diseño limpio y funcional permite convivir con diferentes estilos de dormitorio, ofreciendo almacenamiento discreto y elegante para objetos personales.', price: 180000, category: 'dormitorio', stock: 8, images: ['/images/mesa-de-noche-aconcagua.png'], specs: [{ label: 'Medidas', value: '45 × 35 × 60 cm' }, { label: 'Materiales', value: 'Roble macizo FSC®, herrajes soft-close' }, { label: 'Acabado', value: 'Barniz mate de poliuretano' }, { label: 'Almacenamiento', value: '1 cajón + repisa inferior' }, { label: 'Características', value: 'Cajón con cierre suave' }] },
  { _id: '6', name: 'Sofá Patagonia', description: 'Sofá de tres cuerpos tapizado en lino Warm Alabaster con patas cónicas de madera. Los cojines combinan espuma de alta resiliencia con plumón reciclado, ofreciendo comodidad duradera y sostenible para el hogar moderno.', price: 950000, category: 'living', stock: 4, images: ['/images/sofa-patagonia.png'], specs: [{ label: 'Medidas', value: '220 × 90 × 80 cm' }, { label: 'Estructura', value: 'Madera de eucalipto certificada FSC®' }, { label: 'Tapizado', value: 'Lino 100% natural premium' }, { label: 'Relleno', value: 'Espuma HR + plumón reciclado' }, { label: 'Sostenibilidad', value: 'Materiales 100% reciclables' }] },
  { _id: '7', name: 'Mesa Comedor Pampa', description: 'Mesa extensible de roble macizo con tablero biselado y sistema de apertura suave. Su diseño robusto y elegante se adapta perfectamente a reuniones íntimas o grandes celebraciones familiares, extendiéndose de 6 a 10 comensales.', price: 720000, category: 'comedor', stock: 3, images: ['/images/mesa-comedor-pampa.png'], specs: [{ label: 'Medidas', value: '160-240 × 90 × 75 cm' }, { label: 'Materiales', value: 'Roble macizo FSC®, mecanismo alemán' }, { label: 'Acabado', value: 'Aceite-cera natural' }, { label: 'Capacidad', value: '6-10 comensales' }, { label: 'Extensión', value: 'Sistema de mariposa central' }] },
  { _id: '8', name: 'Sillas Córdoba', description: 'Set de cuatro sillas apilables en contrachapado moldeado de nogal y estructura tubular pintada en Sage Green. Su diseño ergonómico y materiales de calidad garantizan comodidad y durabilidad en el uso diario, perfectas para comedores contemporáneos.', price: 280000, category: 'comedor', stock: 10, images: ['/images/sillas-cordoba.png'], specs: [{ label: 'Medidas', value: '45 × 52 × 80 cm (cada una)' }, { label: 'Materiales', value: 'Contrachapado nogal, tubo de acero' }, { label: 'Acabado', value: 'Laca mate, pintura epoxi' }, { label: 'Apilables', value: 'Hasta 6 sillas' }, { label: 'Incluye', value: 'Set de 4 sillas' }] },
  { _id: '9', name: 'Escritorio Costa', description: 'Escritorio compacto con cajón organizado y tapa pasacables integrada en bambú laminado. Ideal para espacios de trabajo en casa, combina funcionalidad moderna con estética minimalista y sostenible, perfecto para el trabajo remoto.', price: 310000, category: 'oficina', stock: 0, images: ['/images/escritorio-costa.png'], specs: [{ label: 'Medidas', value: '120 × 60 × 75 cm' }, { label: 'Materiales', value: 'Bambú laminado, herrajes ocultos' }, { label: 'Acabado', value: 'Laca mate resistente' }, { label: 'Almacenamiento', value: '1 cajón con organizador' }, { label: 'Cables', value: 'Pasacables integrado' }] },
  { _id: '10', name: 'Silla de Trabajo Belgrano', description: 'Silla ergonómica regulable en altura con respaldo de malla transpirable y asiento tapizado en tejido reciclado. Diseñada para largas jornadas de trabajo con máximo confort y apoyo lumbar, ideal para oficinas en casa y espacios de coworking.', price: 260000, category: 'oficina', stock: 7, images: ['/images/silla-de-trabajo-belgrano.png'], specs: [{ label: 'Medidas', value: '60 × 60 × 90-100 cm' }, { label: 'Materiales', value: 'Malla técnica, tejido reciclado' }, { label: 'Acabado', value: 'Base cromada, tapizado premium' }, { label: 'Regulación', value: 'Altura + inclinación respaldo' }, { label: 'Certificación', value: 'Ergonomía europea EN 1335' }] },
  { _id: '11', name: 'Biblioteca Recoleta', description: 'Sistema modular de estantes abierto que combina estructura de acero Sage Green y repisas en roble claro. Perfecta para colecciones y objetos de diseño, su diseño versátil se adapta a cualquier espacio contemporáneo con elegancia funcional.', price: 410000, category: 'living', stock: 4, images: ['/images/biblioteca-recoleta.png'], specs: [{ label: 'Medidas', value: '100 × 35 × 200 cm' }, { label: 'Materiales', value: 'Estructura de acero, estantes de roble' }, { label: 'Acabado', value: 'Laca mate ecológica' }, { label: 'Capacidad', value: '45 kg por estante' }, { label: 'Modulares', value: '5 estantes ajustables' }] },
];

// Mismo formato que GET /products/categories (backend/src/constants/productCategories.js).
const MOCK_CATEGORIES = [
  { value: 'living', label: 'Living' },
  { value: 'comedor', label: 'Comedor' },
  { value: 'dormitorio', label: 'Dormitorio' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'exterior', label: 'Exterior' },
  { value: 'decoracion', label: 'Decoración' },
];

const delay = (ms = MOCK_DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProducts({ category, search } = {}) {
  if (USE_MOCK) {
    await delay();
    const term = search?.trim().toLowerCase();

    return MOCK_PRODUCTS.filter((product) => {
      if (category && product.category !== category) return false;
      if (term) {
        const haystack = `${product.name} ${product.description}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }

  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (search) params.set('search', search);

  const query = params.toString();
  return apiFetch(`/products${query ? `?${query}` : ''}`);
}

export async function getProductById(id) {
  if (USE_MOCK) {
    await delay();
    const product = MOCK_PRODUCTS.find((p) => p._id === id);
    if (!product) throw new Error('Producto no encontrado');
    return product;
  }

  return apiFetch(`/products/${encodeURIComponent(id)}`);
}

// Devuelve [{ value, label }].
export async function getCategories() {
  if (USE_MOCK) {
    await delay();
    return MOCK_CATEGORIES;
  }

  return apiFetch('/products/categories');
}

