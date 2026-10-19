// Shared look of the SVG panels: same palette as marcoarnulfo.dev (graphite, cream, terracotta).
export const W = 880;
export const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
export const mono = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";

export const styles = `
    .k { font: 500 11px ${mono}; letter-spacing: 2px; fill: #b5b2a8; }
    .big { font: 700 30px ${sans}; fill: #f0eee6; }
    .acc { fill: #e08b6d; }
    .sub { font: 400 14px ${sans}; fill: #8f8b81; }
    .name { font: 500 13px ${mono}; fill: #f0eee6; }
    .num { font: 600 12px ${mono}; fill: #e08b6d; }
    .dim { font: 400 12px ${mono}; fill: #8f8b81; }
    .stat { font: 700 40px ${sans}; fill: #f0eee6; }
    .chip { font: 400 12px ${mono}; fill: #d6d3ca; }
    .group { font: 600 11px ${mono}; letter-spacing: 1.5px; fill: #e08b6d; }`;

/** Panel frame with the small square and the uppercase heading used across the site. */
export function panel(h, heading, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}">
  <style>${styles}
  </style>
  <rect width="${W}" height="${h}" rx="6" fill="#1f1e1d"/>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${h - 1}" rx="6" fill="none" stroke="#3a3833"/>
  <rect x="40" y="34" width="8" height="8" fill="#d97757"/>
  <text x="58" y="42" class="k">${heading}</text>
  ${body}
</svg>
`;
}

export const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
