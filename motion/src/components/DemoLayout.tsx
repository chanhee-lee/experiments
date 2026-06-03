import { Link } from 'react-router-dom'

interface DemoLayoutProps {
  title: string
  apis: string[]
  accent: string
  children: React.ReactNode
}

export function DemoLayout({ title, apis, accent, children }: DemoLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--surface-base)' }}>
      <header
        className="flex items-center gap-4 px-6 py-3 border-b shrink-0"
        style={{ borderColor: 'var(--surface-border)' }}
      >
        <Link
          to="/"
          className="text-sm transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseOver={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          ← Back
        </Link>
        <span className="font-semibold font-heading" style={{ color: 'var(--text-primary)' }}>
          {title}
        </span>
        <div className="ml-auto flex gap-2">
          {apis.map(api => (
            <span
              key={api}
              className="text-xs font-mono px-2 py-0.5 rounded border"
              style={{
                color: accent,
                borderColor: `${accent}66`,
                background: `${accent}1a`,
              }}
            >
              {api}
            </span>
          ))}
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
