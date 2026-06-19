import * as THREE from "three";

const PENTAGON_DIRS: THREE.Vector3[] = (() => {
  const ico = new THREE.IcosahedronGeometry(1, 0);
  const pos = ico.attributes.position;
  const dirs: THREE.Vector3[] = [];
  for (let i = 0; i < pos.count; i++) {
    dirs.push(
      new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize()
    );
  }
  return dirs;
})();

function isNearPentagon(dir: THREE.Vector3): boolean {
  return PENTAGON_DIRS.some((pd) => dir.dot(pd) > 0.88);
}

/**
 * Faceted truncated-icosahedron-style mesh — black pentagons, white hex panels.
 * Uses flat shading for a crisp broadcast / product-render look.
 */
export function createFacetedBallGeometry(
  radius: number,
  detail: number
): THREE.BufferGeometry {
  const indexed = new THREE.IcosahedronGeometry(radius, detail);
  const geometry = indexed.toNonIndexed();
  const positions = geometry.attributes.position;
  const colors = new Float32Array(positions.count * 3);
  const white = new THREE.Color("#F5F5F0");
  const black = new THREE.Color("#161616");

  for (let i = 0; i < positions.count; i += 3) {
    const cx =
      (positions.getX(i) +
        positions.getX(i + 1) +
        positions.getX(i + 2)) /
      3;
    const cy =
      (positions.getY(i) +
        positions.getY(i + 1) +
        positions.getY(i + 2)) /
      3;
    const cz =
      (positions.getZ(i) +
        positions.getZ(i + 1) +
        positions.getZ(i + 2)) /
      3;
    const dir = new THREE.Vector3(cx, cy, cz).normalize();
    const c = isNearPentagon(dir) ? black : white;

    for (let j = 0; j < 3; j++) {
      const idx = i + j;
      colors[idx * 3] = c.r;
      colors[idx * 3 + 1] = c.g;
      colors[idx * 3 + 2] = c.b;
    }
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}
