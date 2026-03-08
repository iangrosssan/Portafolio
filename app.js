let lastRepo = null;

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
    "Montaje_PLD.pdf": {
        title: "Montaje Experimental para Deposición por Láser Pulsado",
        text: "Montaje experimental Pulsed Laser Deposition para la síntesis de películas delgadas ferromagnéticas. Se realizó la alineación y caracterización de láser infrarrojo, junto con la puesta en funcionamiento de una cámara de vacío. Se llevó a cabo una deposición preliminar de YIG sobre sustratos sólidos con respuesta magnética, verificada mediante mediciones MOKE."
    },
    "Análisis_Vibracional_y_Rotacional_del_Hidrógeno_Diatómico.pdf": {
        title: "Análisis Vibracional y Rotacional del Hidrógeno Diatómico",
        text: "Modelo de enlace para la molécula de hidrógeno mediante simulaciones de Density Functional Theory basados en mecánica cuántica. Se describen los estados de vibración y rotación, mostrando buena concordancia con la literatura y destacando su utilidad como marco introductorio para sistemas moleculares simples."
    },
    "Chasis_CubeSat.pdf": {
        title: "Diseño Estructural para Chasis CubeSat 3U",
        text: "Diseño estructural de un chasis CubeSat 3U mediante optimización topológica y fabricado mediante manufactura aditiva Selective Laser Melting. Compatible con estándares internacionales de lanzamiento, sistemas deployer y condiciones de operación en ambiente orbital."
    },
    "Simulacion_Chasis_CubeSat.pdf": {
        title: "Simulación de carga para Chasis CubeSat",
        text: "Análisis estructural de un chasis CubeSat 3U considerando aceleraciones lineales, expansión térmica y respuesta vibracional, incluyendo vibraciones inducidas por el lanzamiento y excitaciones aleatorias representativas del entorno dinámico del cohete. Los resultados validan la integridad mecánica bajo condiciones operacionales realistas."
    },
    "Prediccion_Afinacion_de_Parches_de_Tambor.pdf": {
        title: "Predicción de Afinación en Parches de Tambor",
        text: "Desarrollo de un modelo de red neuronal que relaciona la tensión de los pernos de afinación con el perfil acústico de un tambor. Se estudia un floor tom con un parche superior uniformemente tenso, estableciendo la base para un sistema de afinación de batería."
    }
};

function showPDF(id, filename) {
    if (isMobile()) {
        window.open(filename, '_blank');
        return;
    }

    const viewer = document.getElementById('viewer');
    if (viewer) viewer.src = filename;

    document.querySelectorAll('.nav-item')
        .forEach(b => b.classList.remove('active'));
    
    const btn = document.getElementById(id);
    if (btn) btn.classList.add('active');

    const s = summaries[filename];
    if (s && document.getElementById('doc-title')) {
        document.getElementById('doc-title').textContent = s.title;
        document.getElementById('doc-text').textContent = s.text;
    }

    location.hash = encodeURIComponent(id);
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
        title: 'Herramientas de Mecánico',
        text: 'Suite de herramientas para el diseño y análisis de elementos de máquinas. Incluye módulos para el dimensionamiento de sistemas de frenos, cálculo de resistencia de engranajes (rectos y helicoidales) y análisis de vigas bajo cargas complejas.',
        repo: 'iangrosssan/Herramientas_de_Mecanico'
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

    const viewer = document.getElementById('viewer');
    const cacheBuster = Date.now();

    if (viewer) {
        viewer.src = `../repo-viewer.html#${encodeURIComponent(r.repo)}&v=${cacheBuster}`;
    }

    history.replaceState(null, '', `#${repoId}`);
}

/* -------------------------
   Restore state on reload
-------------------------- */
window.addEventListener('load', () => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) return;

    if (summaries[h + ".pdf"]) {
        showPDF(h, h + ".pdf");
        return;
    }

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