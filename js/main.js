// main.js - dynamic loader, search, dark mode, smooth scroll, nav highlight
document.addEventListener('DOMContentLoaded', () => {
  // --- Theme: remember with localStorage
  const btn = document.getElementById('mode-toggle');
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.body.classList.add('dark');
  if (btn) btn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });

  // --- Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'});
    });
  });

  // --- Highlight current nav link
  const navLinks = document.querySelectorAll('#nav-links a');
  navLinks.forEach(a=>{
    if (location.pathname.endsWith(a.getAttribute('href'))) {
      a.classList.add('active');
    }
  });

  // --- Dynamic posts loader
  const postsIndex = [
    {file:'first-post.html', title:'My First Blog Post', preview:'Starting my developer journey. HTML/CSS/JS.', tags:['personal','coding'], date:'2025-10-06'},
    // add more posts here
  ];
  const postList = document.getElementById('post-list');
  function createCard(p){
    const card = document.createElement('article');
    card.className = 'post-card';
    card.dataset.title = p.title.toLowerCase();
    card.dataset.tags = p.tags.join(' ').toLowerCase();
    card.innerHTML = `<div class="meta">${p.date} • ${p.tags.join(', ')}</div>
      <h3>${p.title}</h3>
      <p>${p.preview}</p>
      <a class="button" href="post.html?file=${p.file}">Read More →</a>`;
    return card;
  }
  if (postList) {
    postsIndex.forEach(p=> postList.appendChild(createCard(p)));
  }

  // --- Simple search by title or tag (works on blog.html)
  const search = document.getElementById('search');
  if (search) {
    search.addEventListener('input', ()=> {
      const q = search.value.trim().toLowerCase();
      document.querySelectorAll('.post-card').forEach(card=>{
        const match = card.dataset.title.includes(q) || card.dataset.tags.includes(q);
        card.style.display = match ? '' : 'none';
      });
    });
  }

  // --- Load single post (post.html?file=...)
  const postContent = document.getElementById('post-content');
  if (postContent) {
    const params = new URLSearchParams(location.search);
    const file = params.get('file');
    if (file) {
      fetch('posts/' + file).then(r=> {
        if (!r.ok) throw new Error('Not found');
        return r.text();
      }).then(html => postContent.innerHTML = html)
      .catch(()=> postContent.innerHTML = '<p>Post not found.</p>');
    } else {
      postContent.innerHTML = '<p>No post specified.</p>';
    }
  }

});
