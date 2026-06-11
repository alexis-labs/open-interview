export function AmbientOverlay() {
  return (
    <div className="ambient-overlay" aria-hidden="true">
      <div className="ambient-overlay__vignette" />
      <div className="ambient-overlay__grain" />
      <div className="ambient-overlay__scanlines" />
      <div className="ambient-overlay__fluoro" />
    </div>
  );
}
