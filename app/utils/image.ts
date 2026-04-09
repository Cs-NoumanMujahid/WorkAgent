/**
 * Compresses and resizes a base64 image string to keep storage usage low.
 */
export async function compressImage(base64Str: string, maxWidth = 300, maxHeight = 300): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = base64Str
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      // Calculate new dimensions maintain aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(base64Str) // Fallback if canvas fails
        return
      }

      ctx.drawImage(img, 0, 0, width, height)
      
      // Convert to JPEG with 0.7 quality for significant space savings
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }

    img.onerror = (err) => {
      reject(err)
    }
  })
}
