# ✦ mathescha

**EPM-Vorbereitung ohne Stress – Aufgabensammlung und Prüfungssimulation.**

`mathescha` ist eine leichte Single-Page-Webanwendung (SPA), die Studierenden bei der Vorbereitung auf die Ergänzungsprüfung Mathematik (EPM) hilft. Die Plattform bietet eine strukturierte Aufgabensammlung mit Hinweisen, Ergebnissen und detaillierten Musterlösungen.

---

## Features

* **Strukturierte Themenübersicht:** Unterteilt in **Teil A** (Planimetrie, Wahrscheinlichkeitsrechnung, analytische Geometrie) und **Teil B** (Funktionen, Differential- & Integralrechnung, Wachstumsprozesse, Folgen & Reihen, Textaufgaben).
* **Interaktive Aufgabenkarten:** Jede Aufgabe enthält den Schwierigkeitsgrad, optionale Formel-Hinweise sowie aufklappbare Bereiche für das Endergebnis und die schrittweise Musterlösung.
* **Mathematische Darstellung:** Sauberes Rendering von Formeln und Gleichungen mithilfe von **KaTeX**.
* **Dynamisches Maskottchen:** Ein interaktiver Kater auf der Startseite wechselt je nach Tageszeit sein Aussehen und motiviert (oder leidet mit) mit passenden Sprüchen.
* **Dark / Light Mode:** Umschaltbares Farbschema für angenehmes Lernen zu jeder Tages- und Nachtzeit.
* **Prüfungssimulation & Login:** *(In Entwicklung)* Simulation realer Prüfungsbedingungen und Benutzerkonten.

---

## Tech Stack

* **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+) mit eigenem Hash-Router (`router.js`)
* **Datenbank & Backend-as-a-Service:** [Supabase](https://supabase.com/) (`topics` & `problems` Tabellen)
* **Mathe-Rendering:** [KaTeX](https://katex.org/)
* **Schriftarten:** Google Fonts (`Modak` & `Space Mono`)

---

## Projektstruktur

```text
├── index.html          # Haupt-Entry-Point & Navigation
├── css/
│   └── style.css       # Styling & Dark-Theme-Variablen
├── pages/
│   ├── home.html       # Startseite mit Hero-Section & Maskottchen
│   ├── exercises.html  # Themenübersicht (Teil A & Teil B)
│   └── tasks.html      # Dynamische Ansicht für Aufgaben eines Themas
├── src/
│   ├── db.js           # Supabase-Client-Konfiguration
│   ├── router.js       # Client-seitiges Hash-Routing
│   └── main.js         # UI-Logik, Theme-Toggle, Kater-Logik & Aufgaben-Rendering
└── assets/
    ├── icons/          # SVG-Icons (Logo, Social Media)
    ├── images/         # Tageszeitabhängige Maskottchen-Illustrationen
    └── graphen/        # SVG-Grapfen der Dichtfunktion
