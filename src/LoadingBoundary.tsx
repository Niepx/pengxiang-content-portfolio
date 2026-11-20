import { Component, ReactNode } from 'react';

export default class LoadingBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <main role="alert" style={{ minHeight: '100svh', padding: 'clamp(24px, 8vw, 96px)', background: '#0c0c0c', color: '#d7e2ea', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 'clamp(28px, 6vw, 64px)', marginBottom: 24 }}>页面暂时未能加载</h1>
      <p style={{ maxWidth: 560, lineHeight: 1.7 }}>请重新加载页面。如果仍无法打开，可以通过邮件联系我。</p>
      <div style={{ display: 'flex', gap: 24, marginTop: 32 }}>
        <button type="button" onClick={() => window.location.reload()} style={{ color: 'inherit', padding: '12px 20px', border: '1px solid currentColor', borderRadius: 12 }}>重新加载</button>
        <a href="mailto:Joji679@163.com" style={{ color: 'inherit', padding: 12 }}>联系我</a>
      </div>
    </main>;
  }
}
