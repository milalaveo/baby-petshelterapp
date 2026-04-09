import './preview-only-notice.css'

export function PreviewOnlyNotice() {
  return (
    <div className="preview-only-shell">
      <section className="preview-only-card">
        <p className="preview-only-eyebrow">Preview-only prototype</p>
        <h1>This story is live on the PR preview first.</h1>
        <p className="preview-only-copy">
          Use this page as a simple smoke test for the publishing flow. In a pull
          request it appears in the Chromatic preview, and it becomes part of the
          final Storybook only after the branch is merged into <strong>main</strong>.
        </p>
        <div className="preview-only-panels">
          <div className="preview-panel">
            <span className="panel-tag">On PR</span>
            <p>Available in Chromatic preview for review and comments.</p>
          </div>
          <div className="preview-panel">
            <span className="panel-tag final">After merge</span>
            <p>Included in the deployed GitHub Pages Storybook from main.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
