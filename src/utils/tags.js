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
  'self-hosted': 'Self Hosted',
  'systemd-resolved': 'systemd-resolved',
  'vs-code': 'VS Code',
  ai: 'AI',
  api: 'API',
  arp: 'ARP',
  buildah: 'buildah',
  cli: 'CLI',
  cors: 'CORS',
  devops: 'DevOps',
  dig: 'dig',
  dns: 'DNS',
  docker: 'Docker',
  drm: 'DRM',
  git: 'Git',
  gpg: 'GPG',
  grpc: 'gRPC',
  http: 'HTTP',
  ios: 'iOS',
  iostat: 'iostat',
  iotop: 'iotop',
  ipc: 'IPC',
  iproute2: 'iproute2',
  javascript: 'JavaScript',
  jwt: 'JWT',
  llm: 'LLM',
  macos: 'MacOS',
  mpd: 'mpd',
  nixos: 'NixOS',
  nodejs: 'NodeJS',
  npm: 'NPM',
  oci: 'OCI',
  pki: 'PKI',
  postgres: 'Postgres',
  sop: 'SOP',
  sql: 'SQL',
  ssh: 'SSH',
  sudo: 'sudo',
  tcp: 'TCP',
  tls: 'TLS',
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
