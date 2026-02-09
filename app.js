let lastRepo = null;

/* -------------------------
   Section navigation
-------------------------- */
function showSection(id) {
    document.querySelectorAll('.section-item')
        .forEach(b => b.classList.remove('active'));

    document.querySelectorAll('.subnav')
        .forEach(s => s.style.display = 'none');

    const section = document.getElementById(id);
    if (!section) return;

    // Remove inline display style to let CSS class handle it (which is display: flex)
    section.style.removeProperty('display');

    // Explicitly add a class if needed, but 'subnav' is already flex. 
    // Just removing 'display: none' is enough if the default CSS is correct.
    // However, specifically for the toggle logic:
    section.style.display = '';
    if (getComputedStyle(section).display === 'none') {
        section.style.display = 'flex'; // Fallback if CSS hidden
    }

    const sectionBtn = document.querySelector(
        `.section-item[data-section="${id}"]`
    );
    if (sectionBtn) sectionBtn.classList.add('active');

    if (id === 'codigo' && lastRepo) {
        const btn = document.querySelector(
            `#codigo button[data-repo="${lastRepo}"]`
        );
        if (btn) showCode(lastRepo, { currentTarget: btn });
    }
}


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
    "academico/Montaje_PLD.pdf": {
        title: "Montaje Experimental para Deposición por Láser Pulsado",
        text: "Montaje experimental Pulsed Laser Deposition para la síntesis de películas delgadas ferromagnéticas. Se realizó la alineación y caracterización de láser infrarrojo, junto con la puesta en funcionamiento de una cámara de vacío. Se llevó a cabo una deposición preliminar de YIG sobre sustratos sólidos con respuesta magnética, verificada mediante mediciones MOKE."
    },
    "academico/Análisis_Vibracional_y_Rotacional_del_Hidrógeno_Diatómico.pdf": {
        title: "Análisis Vibracional y Rotacional del Hidrógeno Diatómico",
        text: "Modelo de enlace para la molécula de hidrógeno mediante simulaciones de Density Functional Theory basados en mecánica cuántica. Se describen los estados de vibración y rotación, mostrando buena concordancia con la literatura y destacando su utilidad como marco introductorio para sistemas moleculares simples."
    },
    "academico/Chasis_CubeSat.pdf": {
        title: "Diseño Estructural para Chasis CubeSat 3U",
        text: "Diseño estructural de un chasis CubeSat 3U mediante optimización topológica y fabricado mediante manufactura aditiva Selective Laser Melting. Compatible con estándares internacionales de lanzamiento, sistemas deployer y condiciones de operación en ambiente orbital."
    },
    "academico/Simulacion_Chasis_CubeSat.pdf": {
        title: "Simulación de carga para Chasis CubeSat",
        text: "Análisis estructural de un chasis CubeSat 3U considerando aceleraciones lineales, expansión térmica y respuesta vibracional, incluyendo vibraciones inducidas por el lanzamiento y excitaciones aleatorias representativas del entorno dinámico del cohete. Los resultados validan la integridad mecánica bajo condiciones operacionales realistas."
    },
    "academico/Prediccion_Afinacion_de_Parches_de_Tambor.pdf": {
        title: "Predicción de Afinación en Parches de Tambor",
        text: "Desarrollo de un modelo de red neuronal que relaciona la tensión de los pernos de afinación con el perfil acústico de un tambor. Se estudia un floor tom con un parche superior uniformemente tenso, estableciendo la base para un sistema de afinación de batería."
    }
};

function showPDF(btn, filename) {

    if (isMobile()) {
        window.open(filename, '_blank');
        return;
    }

    const viewer = document.getElementById('viewer');
    viewer.src = filename;

    document.querySelectorAll('.nav-item')
        .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const s = summaries[filename];
    if (s) {
        document.getElementById('doc-title').textContent = s.title;
        document.getElementById('doc-text').textContent = s.text;
    }

    location.hash = encodeURIComponent(filename);
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

function showCode(repoId, event) {
    const r = repos[repoId];
    if (!r) return;

    document.querySelectorAll('#codigo .nav-item')
        .forEach(b => b.classList.remove('active'));

    event.currentTarget.classList.add('active');
    lastRepo = repoId;

    document.getElementById('doc-title').textContent = r.title;
    document.getElementById('doc-text').textContent = r.text;

    const viewer = document.getElementById('viewer');
    const cacheBuster = Date.now();

    viewer.src =
        `repo-viewer.html#${encodeURIComponent(r.repo)}&v=${cacheBuster}`;

    history.replaceState(null, '', `#${repoId}`);
}


/* -------------------------
   Restore state on reload
-------------------------- */
(function restoreFromHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) return;

    if (summaries[h]) {
        const btn = document.querySelector(
            `button[data-pdf="${h}"]`
        );
        if (btn) showPDF(btn, h);
        return;
    }

    if (repos[h]) {
        showSection('codigo');
        const btn = document.querySelector(
            `#codigo button[data-repo="${h}"]`
        );
        if (btn) showCode(h, { currentTarget: btn });
        return;
    }
})();

/* -------------------------
   Init Default State
-------------------------- */
window.addEventListener('load', () => {
    // If no hash, ensure Academico is visible
    if (!location.hash) {
        showSection('academico');
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
        const d = new Date(data.pushed_at); // Use pushed_at from GitHub

        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();

        el.textContent = `Última actualización: ${hh}:${min} ${dd}/${mm}/${yyyy}`;
    } catch (error) {
        console.error('Error fetching repo date:', error);
        // Fallback to current date or hide if preferred, keeping simple fallback
        const d = new Date();
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        el.textContent = `Última actualización: ${dd}/${mm}/${yyyy}`;
    }
});