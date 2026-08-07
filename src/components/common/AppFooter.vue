<template>
  <footer class="footer">
    <div class="footer__inner">
      <p class="footer__copy">© 2026 SensoryPath – TE08 · Monash University</p>
      <p class="footer__note">
        Data: <a href="https://data.melbourne.vic.gov.au" target="_blank" rel="noopener">City of Melbourne Open Data Portal</a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  padding: 20px 24px;
  text-align: center;
}
.footer__inner { display: flex; flex-direction: column; gap: 4px; }
.footer__copy, .footer__note { margin: 0; font-size: 0.8rem; color: #6b7280; }
.footer__note a { color: #1d4ed8; text-decoration: none; }
.footer__note a:hover { text-decoration: underline; }
</style>
