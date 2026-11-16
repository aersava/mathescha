async function loadPage() {
    const app = document.getElementById('app');

    let page = window.location.hash.replace('#', '')|| 'home';

    let pageToFetch = page;
    let topicSlug = null;
    
    if (page.startsWith('tasks-')) {
        pageToFetch = 'tasks';
        topicSlug = page.replace('tasks-', '');
    }

    try {
        const response = await fetch(`./pages/${pageToFetch}.html`);
        if (!response.ok) {
            throw new Error('Page not found');
        }
        const html = await response.text();
        app.innerHTML = html;

        if (typeof UpdateBuildDate === 'function') { UpdateBuildDate(); } //für Builder

        if (topicSlug && typeof renderTopicTasks === 'function') {
            renderTopicTasks(topicSlug);
        }

    } catch (error) {
        console.error(error);
        app.innerHTML = '<h1>404 - Page Not Found</h1>';
    }
}

window.addEventListener('load', loadPage);
window.addEventListener('hashchange', loadPage);

