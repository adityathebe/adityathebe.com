const tagSlug = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const tagPath = (value = '') => `/tags/${tagSlug(value)}/`;

const TAG_DISPLAY_OVERRIDES = {
  'ai-agents': 'AI Agents',
  'api-design': 'API Design',
  'codex-cli': 'Codex CLI',
  ai: 'AI',
  iproute2: 'iproute2',
  api: 'API',
  arp: 'ARP',
  cli: 'CLI',
  cors: 'CORS',
  devops: 'DevOps',
  dig: 'dig',
  dns: 'DNS',
  docker: 'Docker',
  drm: 'DRM',
  git: 'Git',
  iotop: 'iotop',
  iostat: 'iostat',
  gpg: 'GPG',
  http: 'HTTP',
  ipc: 'IPC',
  javascript: 'JavaScript',
  jwt: 'JWT',
  llm: 'LLM',
  macos: 'MacOS',
  nixos: 'NixOS',
  nodejs: 'Node JS',
  npm: 'NPM',
  postgres: 'Postgres',
  sop: 'SOP',
  sql: 'SQL',
  ssh: 'SSH',
  tls: 'TLS',
  sudo: 'sudo',
  'systemd-resolved': 'systemd-resolved',
  tcp: 'TCP',
};

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

const formatTagLabel = (value = '') => {
  const slug = tagSlug(value);
  if (!slug) {
    return '';
  }

  if (TAG_DISPLAY_OVERRIDES[slug]) {
    return TAG_DISPLAY_OVERRIDES[slug];
  }

  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => capitalize(word))
    .join(' ');
};

module.exports = {
  tagSlug,
  tagPath,
  formatTagLabel,
};
