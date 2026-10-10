'use strict';

const header = document.getElementById('site-header');
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');

function setMenuOpen(isOpen) {
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  mobileNav.hidden = !isOpen;
  document.body.classList.toggle('menu-open', isOpen);
}

menuToggle.addEventListener('click', () => setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenuOpen(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuOpen(false);
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 920 && !mobileNav.hidden) setMenuOpen(false);
});
window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 16), { passive: true });

const animatedElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px -30px 0px' });
  animatedElements.forEach((el) => revealObserver.observe(el));
} else {
  animatedElements.forEach((el) => el.classList.add('is-visible'));
}

document.getElementById('copyright-year').textContent = String(new Date().getFullYear());

const inquiryForm = document.getElementById('inquiry-form');
const inquiryOutput = document.getElementById('inquiry-output');
const inquiryText = document.getElementById('inquiry-text');
const copyStatus = document.getElementById('copy-status');
const formError = document.getElementById('form-error');

function buildInquiry(fields) {
  const shop = fields.shop.trim();
  const person = fields.person.trim();
  const contact = fields.contact.trim();
  const url = fields.url.trim();
  const message = fields.message.trim();
  return [
    '[FIT ID 초기 PoC 제휴 문의]',
    '',
    `쇼핑몰/브랜드명: ${shop}`,
    `담당자명: ${person}`,
    `회신 연락처: ${contact}`,
    ...(url ? [`쇼핑몰 주소: ${url}`] : []),
    '',
    '안녕하세요. FIT ID 초기 PoC 파트너십에 대해 문의드립니다.',
    ...(message ? ['', '협업 희망 내용:', message] : []),
    '',
    '관련하여 검토 가능한 협업 범위와 절차를 안내받고 싶습니다.',
    '감사합니다.'
  ].join('\n');
}

async function copyText(text) {
  // Clipboard API may be unavailable on file:// or insecure origins.
  if (navigator.clipboard && window.isSecureContext) {
    try { await navigator.clipboard.writeText(text); return true; } catch (error) { /* Manual selection fallback */ }
  }
  inquiryText.focus();
  inquiryText.select();
  try { return document.execCommand('copy'); } catch (error) { return false; }
}

inquiryForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = new FormData(inquiryForm);
  const fields = Object.fromEntries(form.entries());
  const requiredNames = ['shop', 'person', 'contact'];
  let invalid = false;
  for (const name of requiredNames) {
    const input = inquiryForm.elements.namedItem(name);
    const missing = !String(fields[name] || '').trim();
    input.classList.toggle('is-invalid', missing);
    input.setAttribute('aria-invalid', String(missing));
    if (missing) invalid = true;
  }
  formError.hidden = !invalid;
  if (invalid) {
    const missing = requiredNames.find((key) => !String(fields[key] || '').trim());
    inquiryForm.elements.namedItem(missing).focus();
    return;
  }
  inquiryText.value = buildInquiry(fields);
  inquiryOutput.hidden = false;
  const copied = await copyText(inquiryText.value);
  copyStatus.textContent = copied ? '문의 문안을 복사했습니다. 원하는 공식 연락 채널에 붙여넣어 전달해 주세요.' : '문안 복사를 지원하지 않는 브라우저입니다. 위 내용을 직접 선택해 복사해 주세요.';
  inquiryOutput.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
});

document.getElementById('copy-again').addEventListener('click', async () => {
  const copied = await copyText(inquiryText.value);
  copyStatus.textContent = copied ? '문의 문안을 다시 복사했습니다.' : '위 내용을 직접 선택해 복사해 주세요.';
});

inquiryForm.querySelectorAll('input[required]').forEach((input) => input.addEventListener('input', () => {
  input.classList.remove('is-invalid');
  input.removeAttribute('aria-invalid');
  formError.hidden = true;
}));