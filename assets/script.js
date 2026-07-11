// Alternância de modo claro/escuro, com preferência salva no navegador
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

function currentTheme(){
  return htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

themeToggle.setAttribute('aria-pressed', String(currentTheme() === 'dark'));

themeToggle.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.setAttribute('aria-pressed', String(next === 'dark'));
  themeToggle.setAttribute('aria-label', next === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro');
});

// Anima as barras de comparação quando o cartão entra em vista
const card = document.getElementById('timeCard');
const fills = card.querySelectorAll('.bar-fill');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function playBars(){
  fills.forEach(f => { f.style.width = f.dataset.w; });
}

if(prefersReduced){
  playBars();
} else {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        playBars();
        io.disconnect();
      }
    });
  }, {threshold:0.4});
  io.observe(card);
}

// Envio do formulário de contato via Formspree (AJAX, sem sair da página)
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  status.className = 'form-status';
  status.textContent = 'Enviando...';

  try{
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if(response.ok){
      status.className = 'form-status success';
      status.textContent = 'Mensagem enviada! Retorno em breve.';
      form.reset();
    } else {
      status.className = 'form-status error';
      status.textContent = 'Não foi possível enviar agora. Tente pelo WhatsApp ao lado.';
    }
  } catch(err){
    status.className = 'form-status error';
    status.textContent = 'Falha de conexão. Tente pelo WhatsApp ao lado.';
  } finally {
    submitBtn.disabled = false;
  }
});
