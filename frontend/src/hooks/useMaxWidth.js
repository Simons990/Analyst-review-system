import { useSyncExternalStore } from 'react'

// Returns true while the browser window is `px` pixels wide or narrower.
// It updates by itself when the window is resized, so a component can
// switch layouts without any CSS file:
//
//   const isNarrow = useMaxWidth(820)
//   {!isNarrow && <SidePanel />}
export function useMaxWidth(px) {
  const query = `(max-width: ${px}px)`

  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches, // current value in the browser
    () => false,                            // value when not in a browser
  )
}