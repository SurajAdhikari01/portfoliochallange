// Image preloading hook for smoother transitions
import { useState, useEffect } from 'react'

export function useImagePreloader(imageList: string[]): boolean {
  const [imagesPreloaded, setImagesPreloaded] = useState(false)
  
  useEffect(() => {
    let isMounted = true
    const preloadImages = async () => {
      const promises = imageList.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.src = src
          img.onload = resolve
          img.onerror = reject
        })
      })
      
      try {
        await Promise.all(promises)
        if (isMounted) {
          setImagesPreloaded(true)
        }
      } catch (error) {
        console.error('Failed to preload images:', error)
      }
    }
    
    preloadImages()
    return () => { isMounted = false }
  }, [imageList])
  
  return imagesPreloaded
}
