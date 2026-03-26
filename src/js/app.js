/* -------------------------
   Mobile detection
-------------------------- */
function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/* -------------------------
   PDF summaries
-------------------------- */
const summaries = {
    "/assets/repo_academico/Montaje_PLD.pdf": {
        title: "Montaje Experimental para Deposición por Láser Pulsado",
        text: "Montaje experimental Pulsed Laser Deposition para la síntesis de películas delgadas ferromagnéticas. Se realizó la alineación y caracterización de láser infrarrojo, junto con la puesta en funcionamiento de una cámara de vacío. Se llevó a cabo una deposición preliminar de YIG sobre sustratos sólidos con respuesta magnética, verificada mediante mediciones MOKE."
    },
    "/assets/repo_academico/Análisis_Vibracional_y_Rotacional_del_Hidrógeno_Diatómico.pdf": {
        title: "Análisis Vibracional y Rotacional del Hidrógeno Diatómico",
        text: "Modelo de enlace para la molécula de hidrógeno mediante simulaciones de Density Functional Theory basados en mecánica cuántica. Se describen los estados de vibración y rotación, mostrando buena concordancia con la literatura y destacando su utilidad como marco introductorio para sistemas moleculares simples."
    },
    "/assets/repo_academico/Chasis_CubeSat.pdf": {
        title: "Diseño Estructural para Chasis CubeSat 3U",
        text: "Diseño estructural de un chasis CubeSat 3U mediante optimización topológica y fabricado mediante manufactura aditiva Selective Laser Melting. Compatible con estándares internacionales de lanzamiento, sistemas deployer y condiciones de operación en ambiente orbital."
    },
    "/assets/repo_academico/Simulacion_Chasis_CubeSat.pdf": {
        title: "Simulación de carga para Chasis CubeSat",
        text: "Análisis estructural de un chasis CubeSat 3U considerando aceleraciones lineales, expansión térmica y respuesta vibracional, incluyendo vibraciones inducidas por el lanzamiento y excitaciones aleatorias representativas del entorno dinámico del cohete. Los resultados validan la integridad mecánica bajo condiciones operacionales realistas."
    },
    "/assets/repo_academico/Prediccion_Afinacion_de_Parches_de_Tambor.pdf": {
        title: "Predicción de Afinación en Parches de Tambor",
        text: "Desarrollo de un modelo de red neuronal que relaciona la tensión de los pernos de afinación con el perfil acústico de un tambor. Se estudia un floor tom con un parche superior uniformemente tenso, estableciendo la base para un sistema de afinación de batería."
    }
};

function showPDF(id, filename) {
    document.querySelectorAll('.nav-item')
        .forEach(b => b.classList.remove('active'));

    const btn = document.getElementById(id);
    if (btn) btn.classList.add('active');

    // Find the summary by matching the filename. Since filename could have base path prepended,
    // we match it against the raw static keys in `summaries`.
    const base = window.SITE_BASE_URL && window.SITE_BASE_URL !== '/' ? window.SITE_BASE_URL : '';
    let summaryKey = filename;
    if (base && filename.startsWith(base)) {
        summaryKey = '/' + filename.substring(base.length);
    }

    const s = summaries[summaryKey];
    if (s && document.getElementById('doc-title')) {
        document.getElementById('doc-title').textContent = s.title;
        document.getElementById('doc-text').textContent = s.text;
    }

    // Update mobile dropdown summary and close it
    const summaryEl = document.getElementById('mobile-summary-academico');
    if (summaryEl && s) {
        summaryEl.textContent = s.title;
    }
    const detailsWrap = document.querySelector('.mobile-dropdown');
    if (detailsWrap) {
        detailsWrap.removeAttribute('open');
    }

    location.hash = encodeURIComponent(id);

    // Ensure the filename actually points to the correct GitHub Pages subdirectory
    const baseUrl = window.SITE_BASE_URL && window.SITE_BASE_URL !== '/' ? window.SITE_BASE_URL : '';
    // if baseUrl is "/Portafolio/" and filename is "/assets/...", properly format it:
    const safeFilename = baseUrl ? (baseUrl + filename.substring(1)) : filename;

    if (isMobile()) {
        window.open(safeFilename, '_blank');
        return;
    }

    const viewer = document.getElementById('viewer');
    if (viewer) viewer.src = safeFilename;
}

/* -------------------------
   Repository viewer
-------------------------- */
const repos = {
    Repo1: {
        title: 'Spotify Sorter',
        text: 'Aplicación de escritorio con arquitectura modular (Frontend PyQt / Backend) para la gestión automatizada de playlists mediante la API de Spotify. Incluye autenticación OAuth y compilación a ejecutable.',
        repo: 'iangrosssan/Sorter-Spotify'
    },
    Repo2: {
        title: 'Herramientas Mecánicas',
        text: 'Suite de herramientas para el diseño y análisis de elementos de máquinas. Incluye módulos para el dimensionamiento de sistemas de frenos, cálculo de resistencia de engranajes (rectos y helicoidales) y análisis de vigas bajo cargas complejas.',
        repo: 'iangrosssan/Herramientas_Mecanicas'
    },
    Repo3: {
        title: 'Controlador para Deposición por Láser Pulsado',
        text: 'Sistema de control paramétrico para Deposición por Láser Pulsado. Regula un sistema de doble motor paso a paso para ajustar los ángulos de inclinación de un espejo y cubrir de manera uniforme la superficie de un sustrato.',
        repo: 'iangrosssan/Controlador_Montaje_PLD'
    }
};

function showCode(repoId) {
    const r = repos[repoId];
    if (!r) return;

    document.querySelectorAll('.nav-item')
        .forEach(b => b.classList.remove('active'));

    const btn = document.getElementById(repoId);
    if (btn) btn.classList.add('active');

    if (document.getElementById('doc-title')) {
        document.getElementById('doc-title').textContent = r.title;
        document.getElementById('doc-text').textContent = r.text;
    }

    // Update mobile dropdown summary and close it
    const summaryEl = document.getElementById('mobile-summary-codigo');
    if (summaryEl && r) {
        summaryEl.textContent = r.title;
    }
    const detailsWrap = document.querySelector('.mobile-dropdown');
    if (detailsWrap) {
        detailsWrap.removeAttribute('open');
    }

    const viewer = document.getElementById('viewer');
    const cacheBuster = Date.now();
    const base = window.SITE_BASE_URL || '/';

    if (viewer) {
        viewer.src = `${base}repo-viewer.html#${encodeURIComponent(r.repo)}&v=${cacheBuster}`;
    }

    history.replaceState(null, '', `#${repoId}`);
}

/* -------------------------
   Restore state on reload
-------------------------- */
window.addEventListener('load', () => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) return;

    // Try as PDF id — look up with full asset path relative to domain root
    const rawPath = `/assets/repo_academico/${h}.pdf`;
    if (summaries[rawPath]) {
        const base = window.SITE_BASE_URL || '';
        // If base is '/', rawPath is already correct. If base is '/Portafolio/', avoid double slash
        const fullPath = base === '/' ? rawPath : base + rawPath.substring(1);
        showPDF(h, fullPath);
        return;
    }

    // Check if it's a code repo ID
    if (repos[h]) {
        showCode(h);
        return;
    }
});

/* -------------------------
   Footer timestamp (GitHub API)
-------------------------- */
window.addEventListener('DOMContentLoaded', async () => {
    const el = document.getElementById('last-update');
    if (!el) return;

    try {
        const response = await fetch('https://api.github.com/repos/iangrosssan/github_pages');
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        const d = new Date(data.pushed_at);

        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();

        el.textContent = `Última actualización: ${hh}:${min} ${dd}/${mm}/${yyyy}`;
    } catch (error) {
        console.error('Error fetching repo date:', error);
        const d = new Date();
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        el.textContent = `Última actualización: ${dd}/${mm}/${yyyy}`;
    }
});

// Initialize mobile UI on load
window.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 900) {
        document.querySelectorAll('.mobile-dropdown').forEach(d => {
            d.removeAttribute('open');
        });
    }
});