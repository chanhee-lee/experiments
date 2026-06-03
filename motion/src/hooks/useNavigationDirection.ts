import { useLocation, useNavigate } from 'react-router-dom'

export function useNavigationDirection() {
  const navigate = useNavigate()
  const location = useLocation()
  const direction: 1 | -1 =
    (location.state as { direction?: 1 | -1 } | null)?.direction ?? 1

  function go(path: string, dir: 1 | -1) {
    navigate(path, { state: { direction: dir } })
  }

  return { go, direction }
}
