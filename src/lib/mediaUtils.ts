/**
 * Returns the public URL for an artifact file.
 * Usage: artifactPath('solo_1.jpeg') → '/artifacts/solo_1.jpeg'
 */
export function artifactPath(filename: string): string {
  return `/artifacts/${filename}`
}
