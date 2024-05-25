function main () {
  if (!document.querySelector('ytd-active-account-header-renderer')) {
    // Click twice on the avatar button to force load current channel info
    document.querySelector('#avatar-btn').click()
    document.querySelector('#avatar-btn').click()
  }

  // The preview on hover, we want to hide it
  const videoPreview = document.querySelector('#video-preview')
  videoPreview.style.display = 'none'

  const videos = document.querySelectorAll('ytd-rich-grid-media')

  for (const video of videos) {
    const link = video.querySelector('#video-title-link')
    const title = link.querySelector('#video-title')
    const h3 = title.closest('h3')

    h3.appendChild(title)
    link.parentNode.removeChild(link)

    title.contentEditable = true
    title.spellcheck = false

    h3.style.cursor = 'auto'

    h3.addEventListener('click', e => {
      e.preventDefault()
      e.stopImmediatePropagation()
    })

    const thumbDiv = video.querySelector('div#thumbnail')

    thumbDiv.addEventListener('hover', e => {
      e.preventDefault()
    })

    // Need to target the `a` since there's a `div` with same ID above, and the
    // `a` has border radius
    const thumbLink = video.querySelector('a#thumbnail')
    const thumbImg = thumbLink.querySelector('img')

    const avatarImg = video.querySelector('#avatar-link img')
    const channelName = video.querySelector('ytd-channel-name #text')

    let droppedFiles = []
    let current = 0

    thumbDiv.addEventListener('dragover', e => {
      e.preventDefault()
      thumbLink.style.outline = '2px dashed red'
    })

    thumbDiv.addEventListener('dragleave', e => {
      e.preventDefault()
      thumbLink.style.outline = ''
    })

    thumbDiv.addEventListener('drop', e => {
      e.preventDefault()
      thumbLink.style.outline = ''

      const activeAccount = document.querySelector('ytd-active-account-header-renderer')
      const accountName = activeAccount.querySelector('#account-name').textContent
      // const handle = activeAccount.querySelector('#channel-handle').textContent
      const avatar = activeAccount.querySelector('#avatar img').src

      avatarImg.src = avatar
      channelName.textContent = accountName

      Promise.all(Array.from(e.dataTransfer.files).map(file => new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => resolve(reader.result)
      })))
        .then(files => {
          droppedFiles = files
          current = 0
          thumbImg.src = droppedFiles[current]
        })
    })

    thumbDiv.addEventListener('click', e => {
      e.preventDefault()
      e.stopImmediatePropagation()

      current = (current + 1) % droppedFiles.length
      thumbImg.src = droppedFiles[current]
    })
  }
}

try {
  main()
} catch (e) {
  // Bug with Firefox where the top-level exceptions from content script are not logged out of the box?
  console.log(e)
}
