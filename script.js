(() => {
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Navegación en móvil
  const boton = document.getElementById('abrirNav');
  const nav = document.getElementById('nav');
  const cerrarNav = () => {
    nav.classList.remove('abierta');
    boton.setAttribute('aria-expanded', 'false');
    boton.querySelector('use').setAttribute('href', '#i-menu');
  };
  boton.addEventListener('click', () => {
    const abierta = nav.classList.toggle('abierta');
    boton.setAttribute('aria-expanded', String(abierta));
    boton.querySelector('use').setAttribute('href', abierta ? '#i-cerrar' : '#i-menu');
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) cerrarNav(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarNav(); });

  // Portada: partir el lema en palabras para que suban una tras otra
  const lema = document.getElementById('lema');
  lema.innerHTML = lema.textContent.trim().split(/\s+/)
    .map((p, i) => `<span class="palabra"><span style="--w:${i}">${p}</span></span>`).join(' ');
  lema.setAttribute('aria-label', lema.textContent);
  lema.classList.add('partido');

  // La pared: piezas acomodadas como en charola, en filas alternadas
  const pared = document.getElementById('pared');
  for (let i = 0; i < 24; i++) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 120 80');
    svg.style.setProperty('--i', String(Math.floor(i / 4) + (i % 4) * 0.6 + 4));
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#pata');
    svg.appendChild(use);
    pared.appendChild(svg);
  }
  requestAnimationFrame(() => pared.classList.add('lista'));

  // Revelados al hacer scroll: se marcan aquí para que sin JS todo se vea completo
  const marcar = (selector, tipo) => document.querySelectorAll(selector).forEach((el) => { el.dataset.r = tipo; });
  marcar('.temporada-cabeza > *, .menu-cabeza > *, .casa-historia > *, .muerto-texto > h3, .muerto-texto > p, .pasadas > h3, .pared-texto > *, .manos > h3, .visita-datos > h2, .visita-estado, .pie-gracias, .pie-redes, .menu-pdf, .carta-mas, .corte-nota, .encargo, .casa-equipo figcaption, .visita-datos .acciones', 'texto');
  marcar('.corte-foto img, .muerto > img, .equipo-marco, .pared-fotos img:first-child, .visita-fachada, .visita-mapa', 'foto');
  marcar('.pasadas ul, .manos ul, .carta, .corte-capas, .sabores, .datos', 'lista');

  // Hermanos de texto entran 90ms uno tras otro
  document.querySelectorAll('[data-r="texto"]').forEach((el) => {
    const hermanos = [...el.parentElement.children].filter((h) => h.dataset.r === 'texto');
    el.style.setProperty('--d', `${hermanos.indexOf(el) * 130}ms`);
  });
  document.querySelectorAll('[data-r="lista"]').forEach((lista) => {
    [...lista.children].forEach((hijo, i) => hijo.style.setProperty('--n', String(i)));
  });

  // El corte: la base (última capa) cae primero
  const armar = (pieza) => {
    pieza.classList.remove('armada');
    const capas = [...pieza.querySelectorAll('.capa')];
    capas.forEach((c, i) => c.style.setProperty('--k', String(capas.length - 1 - i)));
    pieza.classList.add('visto');
    clearTimeout(pieza._t);
    pieza._t = setTimeout(() => pieza.classList.add('armada'), capas.length * 160 + 1200);
  };

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      if (e.target.classList.contains('corte-pieza')) armar(e.target);
      else e.target.classList.add('visto');
      observador.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('[data-r], .corte-pieza').forEach((el) => observador.observe(el));

  // Volver a reproducir los revelados de un panel recién mostrado
  const repetir = (panel) => {
    panel.classList.remove('entrando');
    void panel.offsetWidth;
    panel.classList.add('entrando');
    panel.querySelectorAll('[data-r="lista"]').forEach((el) => {
      el.classList.remove('visto');
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visto')));
    });
    panel.querySelectorAll('.corte-pieza').forEach((pieza) => {
      pieza.classList.remove('visto', 'armada');
      requestAnimationFrame(() => requestAnimationFrame(() => armar(pieza)));
    });
    panel.querySelectorAll('[data-r="texto"], [data-r="foto"]').forEach((el) => el.classList.add('visto'));
  };

  // Pestañas accesibles (temporada y menú) con indicador que se desliza
  document.querySelectorAll('[role="tablist"]').forEach((lista) => {
    const tabs = [...lista.querySelectorAll('[role="tab"]')];
    const indicador = document.createElement('span');
    indicador.className = 'indicador';
    indicador.setAttribute('aria-hidden', 'true');
    lista.appendChild(indicador);
    const mover = (tab) => {
      indicador.style.transform = `translateX(${tab.offsetLeft}px) scaleX(${tab.offsetWidth})`;
    };
    const activar = (tab, enfocar) => {
      if (tab.getAttribute('aria-selected') === 'true') return;
      tabs.forEach((t) => {
        const activa = t === tab;
        t.setAttribute('aria-selected', String(activa));
        t.tabIndex = activa ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !activa;
      });
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (enfocar) {
        // Con teclado el cambio es instantáneo: sin animación en acciones repetidas
        [lista, panel].forEach((el) => el.classList.add('sin-mov'));
        mover(tab);
        panel.querySelectorAll('[data-r]').forEach((el) => el.classList.add('visto'));
        panel.querySelectorAll('.corte-pieza').forEach((p) => p.classList.add('visto', 'armada'));
        requestAnimationFrame(() => requestAnimationFrame(() => [lista, panel].forEach((el) => el.classList.remove('sin-mov'))));
        tab.focus();
      } else {
        mover(tab);
        repetir(panel);
      }
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activar(tab));
      tab.addEventListener('keydown', (e) => {
        const paso = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (paso) activar(tabs[(i + paso + tabs.length) % tabs.length], true);
        if (e.key === 'Home') activar(tabs[0], true);
        if (e.key === 'End') activar(tabs[tabs.length - 1], true);
      });
    });
    const colocar = () => mover(tabs.find((t) => t.getAttribute('aria-selected') === 'true'));
    colocar();
    document.fonts.ready.then(colocar);
    addEventListener('resize', colocar);
  });

  // Corte de temporada: cada ingrediente resalta su capa
  document.querySelectorAll('.corte').forEach((corte) => {
    const pieza = corte.querySelector('.corte-pieza');
    const capas = [...pieza.querySelectorAll('.capa')];
    const items = [...corte.querySelectorAll('.corte-capas li')];
    items.forEach((li) => {
      const capa = capas.find((c) => c.dataset.capa === li.dataset.capa);
      li.style.setProperty('--color', capa.style.getPropertyValue('--color'));
    });
    const resaltar = (n) => {
      pieza.classList.toggle('enfocada', n !== null);
      [...capas, ...items].forEach((el) => el.classList.toggle('activa', el.dataset.capa === n));
    };
    [...items, ...capas].forEach((el) => {
      el.addEventListener('pointerenter', () => resaltar(el.dataset.capa));
      el.addEventListener('pointerleave', () => resaltar(null));
    });
    items.forEach((li) => {
      li.addEventListener('focus', () => resaltar(li.dataset.capa));
      li.addEventListener('blur', () => resaltar(null));
    });
  });

  // Carrusel de fotos: se duplica la tira para que el desfile no tenga corte
  const tira = document.getElementById('tira');
  if (!reducido) {
    const ul = tira.querySelector('ul');
    [...ul.children].forEach((li) => {
      const copia = li.cloneNode(true);
      copia.setAttribute('aria-hidden', 'true');
      copia.querySelector('img').alt = '';
      copia.querySelector('img').loading = 'lazy';
      ul.appendChild(copia);
    });
    const ajustar = () => {
      // ~45px por segundo, sin importar el ancho de pantalla
      tira.style.setProperty('--duracion', `${Math.round(ul.scrollWidth / 2 / 45)}s`);
    };
    ajustar();
    addEventListener('resize', ajustar);
    tira.classList.add('desfila');
    // Sin pantalla no hay desfile: se pausa fuera de vista
    new IntersectionObserver(([e]) => tira.classList.toggle('fuera', !e.isIntersecting)).observe(tira);
  }

  // ¿Abierto ahora? Hora del centro de México, todos los días de 8:30 a 21:00
  const ABRE = 8 * 60 + 30;
  const CIERRA = 21 * 60;
  const estado = () => {
    const partes = new Intl.DateTimeFormat('es-MX', {
      timeZone: 'America/Mexico_City', hour: 'numeric', minute: 'numeric', hourCycle: 'h23'
    }).formatToParts(new Date());
    const h = Number(partes.find((p) => p.type === 'hour').value);
    const m = Number(partes.find((p) => p.type === 'minute').value);
    const ahora = h * 60 + m;
    if (ahora >= ABRE && ahora < CIERRA - 30) return { abierto: 'si', texto: 'Abierto ahora, cerramos a las 9 pm' };
    if (ahora >= CIERRA - 30 && ahora < CIERRA) return { abierto: 'pronto', texto: 'Abierto, cerramos a las 9 pm' };
    if (ahora < ABRE) return { abierto: 'no', texto: 'Cerrado, abrimos hoy a las 8:30 am' };
    return { abierto: 'no', texto: 'Cerrado, abrimos mañana a las 8:30 am' };
  };
  const pintarEstado = () => {
    const { abierto, texto } = estado();
    document.querySelectorAll('[data-estado]').forEach((el) => { el.textContent = texto; });
    document.querySelectorAll('[data-estado-punto]').forEach((el) => { el.dataset.abierto = abierto; });
  };
  pintarEstado();
  setInterval(pintarEstado, 60 * 1000);
})();
