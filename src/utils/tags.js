const tagSlug = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const tagPath = (value = '') => `/tags/${tagSlug(value)}/`;

const TAG_DISPLAY_OVERRIDES = {
  ai: 'AI',
  'ai-agents': 'AI Agents',
  llm: 'LLM',
  api: 'API',
  ipc: 'IPC',
  nixos: 'NixOS',
  ssh: 'SSH',
  gpg: 'GPG',
  git: 'Git',
  npm: 'NPM',
  nodejs: 'Node JS',
  cli: 'CLI',
  cors: 'CORS',
  http: 'HTTP',
  javascript: 'JavaScript',
  jwt: 'JWT',
  macos: 'MacOS',
  postgres: 'Postgres',
  sql: 'SQL',
  tcp: 'TCP',
  sop: 'SOP',
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
