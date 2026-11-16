document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');

            if (document.body.classList.contains('dark-theme')) {
                themeToggleBtn.textContent = '☼';
            } else {
                themeToggleBtn.textContent = '☾';
            }
        });
    }
});

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

