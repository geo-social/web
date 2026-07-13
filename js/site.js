(() => {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-site-nav]');
  if (toggle && nav) {
    const closeNav = () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeNav();
    });
  }

  const search = document.querySelector('[data-publication-search]');
  const publications = [...document.querySelectorAll('[data-publication]')];
  const topicButtons = [...document.querySelectorAll('[data-topic-filter]')];
  const yearSections = [...document.querySelectorAll('[data-year-section]')];
  const count = document.querySelector('[data-publication-count]');
  const empty = document.querySelector('[data-empty-state]');

  if (search && publications.length) {
    let activeTopic = 'all';

    const applyFilters = () => {
      const query = search.value.trim().toLowerCase();
      let visible = 0;
      publications.forEach((publication) => {
        const matchesText = !query || publication.textContent.toLowerCase().includes(query);
        const tags = (publication.dataset.tags || '').split(/\s+/);
        const matchesTopic = activeTopic === 'all' || tags.includes(activeTopic);
        const show = matchesText && matchesTopic;
        publication.hidden = !show;
        if (show) visible += 1;
      });
      yearSections.forEach((section) => {
        section.hidden = !section.querySelector('[data-publication]:not([hidden])');
      });
      if (count) count.textContent = `${visible} publication${visible === 1 ? '' : 's'}`;
      if (empty) empty.hidden = visible !== 0;
    };

    topicButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activeTopic = button.dataset.topicFilter || 'all';
        topicButtons.forEach((item) => item.classList.toggle('active', item === button));
        applyFilters();
      });
    });
    search.addEventListener('input', applyFilters);

    const requestedTopic = new URLSearchParams(window.location.search).get('topic');
    const requestedButton = topicButtons.find((button) => button.dataset.topicFilter === requestedTopic);
    if (requestedButton) requestedButton.click();
    else applyFilters();
  }
})();
