import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { geoMercator, geoPath } from 'd3-geo';

// Keep the source out of static/: browsers receive only these preprojected paths.
// Mapshaper simplifies shared borders together; gj2008 retains D3's clockwise outer rings.
const root = fileURLToPath(new URL('../', import.meta.url));
const temporary = mkdtempSync(join(tmpdir(), 'nepal-map-'));

try {
  const simplified = join(temporary, 'districts.json');
  execFileSync(process.execPath, [
    join(root, 'node_modules/mapshaper/bin/mapshaper'),
    join(root, 'data/nepal-districts.geojson'),
    '-simplify',
    'weighted',
    '1%',
    'keep-shapes',
    '-o',
    simplified,
    'format=geojson',
    'gj2008',
  ]);
  const geography = JSON.parse(readFileSync(simplified, 'utf8'));
  const projection = geoMercator().fitExtent(
    [
      [16, 16],
      [984, 484],
    ],
    geography
  );
  const path = geoPath(projection).digits(1);
  const districts = geography.features
    .map((feature) => ({
      name: feature.properties.DIST_EN,
      path: path(feature),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'));

  if (districts.length !== 77 || new Set(districts.map((d) => d.name)).size !== 77 || districts.some((d) => !d.path)) {
    throw new Error('Expected 77 uniquely named, nonempty district paths');
  }
  const output = JSON.stringify(districts) + '\n';
  writeFileSync(join(root, 'src/components/NepalMap/districts.json'), output);
  console.log(`Generated ${districts.length} districts: ${Buffer.byteLength(output)} bytes`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
