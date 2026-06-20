import { useEffect, useRef, useState } from 'react'

interface ElementSize {
  width: number
  height: number
}

/**
 * Mide el tamaño de un elemento y se actualiza con ResizeObserver.
 * Usado para dimensionar el Stage de react-konva según su contenedor responsivo.
 */
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })

    observer.observe(el)
    return () => { observer.disconnect() }
  }, [])

  return { ref, size }
}
