document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');

    if (themeToggleBtn) {
        if (document.body.classList.contains('dark-theme')) {
            themeToggleBtn.textContent = '☼';
        }

        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');

            if (document.body.classList.contains('dark-theme')) {
                themeToggleBtn.textContent = '☼';
                localStorage.setItem('theme', 'dark');
            } else {
                themeToggleBtn.textContent = '☾';
                localStorage.setItem('theme', 'light');
            }
        });
    }
});

// Kater-Image und Sprechblase aktualisieren
function UpdateBuildDate() {
    const katerPhrases = {
        frueh: ["ich brauche Monster Energie...", "Warum...", "Omg, ich will schlaffen", "Wer mag Mathe?"],
        spaeter: ["Guten Morgen!", "EPM wartet nicht", "let's go."],
        traurig: ["Help me", "Mathe ist so schwer", "zu viele Aufgaben"],
        nach_traurig: ["o-okay, ich versuch's...", "Schritt für Schritt", "Lass uns das machen"],
        entspannt: ["Gar nicht so schlecht!", "Läuft bei mir", "Pause tut gut"],
        lernen: ["Fokus!", "Ich bin ein Mathe-Genie", "hahahahahaha"],
        insta: ["Nur kurz checken...", "Wer hat geliked?", "Brain off"],
        nacht: ["Zzz...", "Schlafen...", "Gute Nacht, Mathe"]
    }


    const ImgHero = document.getElementById('hero-image');
    const bubble = document.getElementById('cat-bubble');

    if (!ImgHero || ! bubble) return;

    const currentHour = new Date().getHours();
    let phrasenTime = '';

    if (currentHour >= 4 && currentHour < 7) {
        ImgHero.src = './assets/images/kater_Morgen_frueh.PNG';
        phrasenTime = 'frueh';
    } else if (currentHour >= 7 && currentHour < 10) {
        ImgHero.src = './assets/images/kater_Morgen_spaeter.PNG';
        phrasenTime = 'spaeter';
    } else if (currentHour >= 10 && currentHour < 11) {
        ImgHero.src = './assets/images/kater_traurig.PNG';
        phrasenTime = 'traurig';
    } else if (currentHour >= 11 && currentHour < 13) {
        ImgHero.src = './assets/images/nach_traurig.PNG';
        phrasenTime = 'nach_traurig'
    } else if (currentHour >= 13 && currentHour < 17) {
        ImgHero.src = './assets/images/kater_schon_entspannt.PNG';
        phrasenTime = 'entspannt'
    } else if (currentHour >= 17 && currentHour < 20) {
        ImgHero.src = './assets/images/kater_unter_lernen.PNG';
        phrasenTime = 'lernen'
    } else if (currentHour >= 20 && currentHour < 22) {
        ImgHero.src = './assets/images/kater_insta.PNG';
        phrasenTime = 'insta'
    } else if (currentHour >= 22 || currentHour < 4) {
        ImgHero.src = './assets/images/nachInsta.PNG';
        phrasenTime = 'nacht'
    }

    const phrases = katerPhrases[phrasenTime];
    if (phrases && phrases.length > 0) {
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        bubble.textContent = randomPhrase;
    }

}

document.addEventListener('DOMContentLoaded', UpdateBuildDate);

//MINITEST und weiter Pruefungen starten
function startTrial() {
    window.location.href = '#mini-test';
}

async function renderMiniTest() {
    const container = document.getElementById('tasks-container');

    if (!container) return;

    container.innerHTML = '<p>Lade Aufgaben aus der Datenbank...</p>';

    try {
        const { data: problems, error } = await db
            .from('problems')
            .select(`
                *,
                topics ( title )
            `)
            .eq('is_published', true);

        if (error || !problems || problems.length === 0) {
            container.innerHTML = '<p>Keine Aufgaben gefunden.</p>';
            return;
        }

        const tasksByTopic = {};
        problems.forEach(problem => {
            if (!tasksByTopic[problem.topic_id]) {
                tasksByTopic[problem.topic_id] = [];
            }
            tasksByTopic[problem.topic_id].push(problem);
        });

        // eine randome Aufgabe aus jedem Thema auswählen
        const testTasks = [];
        for (const topicId in tasksByTopic) {
            const topicTasks = tasksByTopic[topicId];
            const randomTask = topicTasks[Math.floor(Math.random() * topicTasks.length)];
            testTasks.push(randomTask);
        }

        // rendere die ausgewählten Aufgaben
        container.innerHTML = testTasks.map((p, index) => {
            let answersContent = '<p>Keine Antworten verfügbar</p>';
            if (p.answers && p.answers.length > 0) {
                answersContent = `<p>${p.answers}</p>`;
            }
            
            const topicTitle = p.topics ? p.topics.title : `Thema ${p.topic_id}`;

            return `
                <div class="task-card">
                    <div class="task-meta">
                        Aufgabe #${index + 1} • ${topicTitle} • Niveau: ${p.difficulty}
                    </div>
            
                    <div class="task-text">
                        ${p.task_text}
                    </div>

                    ${p.formula_hints ? `
                        <div class="task-hint">
                            <em>Hinweis: ${p.formula_hints}</em>
                        </div>
                    ` : ''}

                    <details class="task-solution">
                        <summary>Ergebnis anzeigen</summary>
                        <div class="solution-content result-content">
                            ${answersContent}
                        </div>
                    </details>

                    <details class="task-solution">
                        <summary>Musterlösung anzeigen</summary>
                        <div class="solution-content">
                            ${p.solution_steps ? `<p>${p.solution_steps.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>` : '<p>Keine Lösung hinterlegt</p>'}
                        </div>
                    </details>
                </div>
            `;
        }).join('');

        if (window.renderMathInElement) {
            renderMathInElement(container, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false }
                ],
                throwOnError: false,
                output: 'html'
            });
        }

    } catch (e) {
        console.error(e);
        container.innerHTML = '<p>Fehler beim Laden des Mini-Tests.</p>';
    }
}

//AUFGABEN RENDERN

async function renderTopicTasks(slug) {
    const titleEl = document.getElementById('topic-title');
    const container = document.getElementById('tasks-container');

    try {
        // 1. Suchen nach Thema mit slug
        const { data: topic, error: topicErr } = await db
            .from('topics')
            .select('id, title')
            .eq('slug', slug)
            .maybeSingle();

        if (topicErr || !topic) {
            titleEl.textContent = '<p>Thema nicht gefunden</p>';
            container.innerHTML = '<p>Zu diesem Thema gibt es noch keine Aufgaben.</p>';
            return;
        }

        titleEl.textContent = topic.title;

        // Aufgaben aus der Datenbank abrufen
        const { data: problems, error: probErr } = await db
            .from('problems')
            .select('*')
            .eq('topic_id', topic.id)
            .eq('is_published', true);

        if (probErr || !problems || problems.length === 0) {
            container.innerHTML = '<p>Noch keine Aufgaben in dieser Kategorie eingetragen.</p>';
            return;
        }

        // Aufgaben rendern
        container.innerHTML = problems.map((p, index) => {

            let answersContent = '<p>Keine Antworten verfügbar</p>';
            
            if (p.answers && p.answers.length > 0) {
                answersContent = `<p>${p.answers}</p>`;
            }

            return `
                <div class="task-card">
                    <div class="task-meta">
                        Aufgabe #${index + 1} • Niveau: ${p.difficulty}
                    </div>
            
                    <div class="task-text">
                        ${p.task_text}
                    </div>

                    ${p.formula_hints ? `
                        <div class="task-hint">
                            <em>Hinweis: ${p.formula_hints}</em>
                        </div>
                    ` : ''}

                    <!--toggle1  ANTWORT -->
                    <details class="task-solution">
                        <summary>Ergebnis anzeigen</summary>
                        <div class="solution-content result-content">
                            ${answersContent}
                        </div>
                    </details>

                    <!-- toggle 2 Musterlösung -->
                    <details class="task-solution">
                        <summary>Musterlösung anzeigen</summary>
                        <div class="solution-content">
                            ${p.solution_steps ? `<p>${p.solution_steps.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>` : '<p>Keine Lösung hinterlegt</p>'}
                        </div>
                    </details>
                </div>
            `; 

        }).join('');


    } catch (e) {
        console.error(e);
        container.innerHTML = '<p>Fehler beim Laden der Aufgaben.</p>';
    }

    if (window.renderMathInElement) {
        renderMathInElement(container, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false }
            ],
            throwOnError: false,
            output: 'html'
        });
    }
}


async function trackVisitor() {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return; // Don't track on localhost
    if (sessionStorage.getItem('visited')) return; // Already tracked in this session

    const { error } = await db 
        .from('page_views')
        .insert({ path: window.location.pathname });

    if (!error) {
        sessionStorage.setItem('visited', 'true');
    } else {
        console.error('Ошибка записи визита:', error);
    }
}
document.addEventListener('DOMContentLoaded', trackVisitor);

//Mobile menü
document.addEventListener('DOMContentLoaded', () => {
    const burgerBtn = document.getElementById('burger-btn');
    const line3 = burgerBtn?.querySelector('.line-3');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const topPaw = document.getElementById('top-paw');
    const bottomPaw = document.getElementById('bottom-paw');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links');

    if (!burgerBtn || !line3 || !closeMenuBtn || !mobileMenu || !topPaw || !bottomPaw) return;
    
    let isMenuAnimating = false;

    function alignPaws() {
        if (window.innerWidth > 950) return;
        const burgerRect = burgerBtn.getBoundingClientRect();
        topPaw.style.left = `${burgerRect.left - 35}px`;
        bottomPaw.style.left = `${window.innerWidth / 2 - 55}px`;
    }

    window.addEventListener('resize', alignPaws);
    alignPaws();

    function openMenu() {
        if (isMenuAnimating || mobileMenu.classList.contains('is-open')) return;
        isMenuAnimating = true;
        alignPaws();

        const bottomOfBurger = line3.getBoundingClientRect().bottom;
        mobileMenu.style.setProperty('--menu-start-y', `${bottomOfBurger}px`);

        burgerBtn.classList.remove('is-restored', 'is-restored-fast');
        mobileMenu.classList.remove('is-closing', 'is-closing-fast');
        bottomPaw.classList.remove('is-striking');

        topPaw.classList.add('is-striking');
        burgerBtn.classList.add('is-smashed');
        mobileMenu.classList.add('is-open');

        setTimeout(() => {
            topPaw.classList.remove('is-striking');
            isMenuAnimating = false;
        }, 900);
    }

    function closeMenu(withSlap = true) {
        if (isMenuAnimating || !mobileMenu.classList.contains('is-open')) return;
        isMenuAnimating = true;

        if (withSlap) {
            const closeRect = closeMenuBtn.getBoundingClientRect();
            const menuRect = mobileMenu.getBoundingClientRect();
            const bottomOffset = Math.max(0, menuRect.bottom - closeRect.bottom);
            
            mobileMenu.style.clipPath = `inset(0 0 ${bottomOffset}px 0)`;
            mobileMenu.offsetHeight;
            mobileMenu.style.clipPath = '';

            mobileMenu.classList.remove('is-open');
            bottomPaw.classList.add('is-striking');
            mobileMenu.classList.add('is-closing');
            burgerBtn.classList.remove('is-smashed');
            burgerBtn.classList.add('is-restored');

            setTimeout(() => {
                mobileMenu.classList.remove('is-closing');
                bottomPaw.classList.remove('is-striking');
                isMenuAnimating = false;
            }, 950);
        } else {
            mobileMenu.classList.remove('is-open');
            mobileMenu.classList.add('is-closing-fast');
            burgerBtn.classList.remove('is-smashed');
            burgerBtn.classList.add('is-restored-fast');

            setTimeout(() => {
                mobileMenu.classList.remove('is-closing-fast');
                isMenuAnimating = false;
            }, 550);
        }
    }

    burgerBtn.addEventListener('click', openMenu);
    closeMenuBtn.addEventListener('click', () => closeMenu(true));

    mobileLinks.forEach(link => {
        if (!link.classList.contains('disabled-link')) {
            link.addEventListener('click', () => closeMenu(false));
        }
    });
});

        
