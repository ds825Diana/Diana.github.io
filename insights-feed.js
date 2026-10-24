const insightsList = document.getElementById('insightsList');

if (insightsList) {
  fetch('https://api.github.com/repos/ds825Diana/Diana.github.io/issues?state=open&per_page=30', {
    headers: { Accept: 'application/vnd.github+json' }
  })
    .then(response => {
      if (!response.ok) throw new Error('Insights unavailable');
      return response.json();
    })
    .then(items => {
      const insights = items
        .filter(item => !item.pull_request && /^\[Insight\]/i.test(item.title))
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      if (!insights.length) return;
      insightsList.innerHTML = '';
      insights.forEach((item, index) => {
        const title = item.title.replace(/^\[Insight\]\s*/i, '');
        const excerpt = (item.body || '').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/[#>*_`~\[\]()-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150);
        const date = new Intl.DateTimeFormat(document.documentElement.lang.startsWith('zh') ? 'zh-CN' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(item.updated_at));
        const article = document.createElement('a');
        article.className = 'insight-card';
        article.href = item.html_url;
        article.target = '_blank';
        article.rel = 'noreferrer';
        article.innerHTML = `<div class="insight-meta"><span>${String(index + 1).padStart(2, '0')}</span><time>${date}</time></div><h3></h3><p></p><b>READ ↗</b>`;
        article.querySelector('h3').textContent = title;
        article.querySelector('p').textContent = excerpt || 'Open this field note on GitHub.';
        insightsList.appendChild(article);
      });
    })
    .catch(() => insightsList.classList.add('offline'));
}
