export async function loadImage(imgUrl) {
  if (!imgUrl)
    throw new Error('Image url is not provided!')

  const promise = new Promise((resolve, reject) => {
    const img = new Image()
    img.src = imgUrl
    img.onload = () => resolve(img)
    img.onerror = err => reject(new Error('Could not load the image'), err)
  })

  return promise
}
