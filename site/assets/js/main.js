/* ============================================================
   FLASH – Metalúrgica & Portas Automáticas
   main.js — Comportamentos globais
   ============================================================ */

(function () {
  'use strict';

  /* -------- Header scroll -------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* -------- Mobile menu -------- */
  const hamburger = document.querySelector('.hamburger');
  const mainNav   = document.querySelector('.main-nav');
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mainNav.classList.toggle('open');
      document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
    });
    mainNav.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mainNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('click', e => {
      if (!header.contains(e.target)) {
        hamburger.classList.remove('open');
        mainNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* -------- Active nav link -------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop() || 'index.html';
    if (href === currentPath) a.classList.add('active');
  });

  /* -------- Fade-up on scroll -------- */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => io.observe(el));
  }

  /* -------- Contact form → WhatsApp redirect -------- */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const nome    = contactForm.querySelector('[name="nome"]')?.value || '';
      const servico = contactForm.querySelector('[name="servico"]')?.value || '';
      const msg     = contactForm.querySelector('[name="mensagem"]')?.value || '';
      const text = encodeURIComponent(
        `Olá, FLASH! Me chamo *${nome}*. Tenho interesse em: *${servico}*.\n\n${msg}\n\nAguardo o contato. Obrigado!`
      );
      window.open(`https://wa.me/5527996586744?text=${text}`, '_blank');
    });
  }

  /* -------- Portfolio filter -------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portItems  = document.querySelectorAll('.port-item-filterable');
  if (filterBtns.length && portItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        portItems.forEach(item => {
          const show = cat === 'all' || item.dataset.cat === cat;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* -------- Smooth anchor scroll -------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = (header ? header.offsetHeight : 80) + 12;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });

  /* -------- Admin sidebar mobile toggle -------- */
  const admToggle = document.querySelector('#adm-menu-toggle');
  const admSidebar = document.querySelector('.adm-sidebar');
  if (admToggle && admSidebar) {
    admToggle.addEventListener('click', () => admSidebar.classList.toggle('open'));
  }

})();
