const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// get video piped into the player/video element
function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false})
    .then(localMediaStream => {
      // console.log(localMediaStream)
      // updated solution after getting TypeError: https://stackoverflow.com/questions/27120757/failed-to-execute-createobjecturl-on-url
      video.srcObject = localMediaStream
      video.play()
    })
    .catch(err => console.error('Uh-oh...', err))
}

function paintToCanvas() {
  const width = video.videoWidth
  const height = video.videoHeight
  canvas.width = width
  canvas.height = height

  // take image from webcam and put on canvas
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height)
    /* take pixels out */
    let pixels = ctx.getImageData(0, 0, width, height)

    /* mess with them (add filters) */
    // pixels = redEffect(pixels)
    // pixels = rgbSplit(pixels)
    // ctx.globalAlpha = 0.1
    pixels = greenScreen(pixels)
    /* put them back */
    ctx.putImageData(pixels, 0, 0)
  }, 16)
}

function takePhoto() {
  // play the sound
  snap.currentTime = 0
  snap.play()

  // take the data out of canvas
  const data = canvas.toDataURL('image/jpeg')
  const link = document.createElement('a')
  link.href = data
  link.setAttribute('download', 'webcam-selfie')
  link.innerHTML = `<img src="${data}" alt="cutePic" />`
  strip.insertBefore(link, strip.firstChild)
}

/* adding filters */
function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] += 100 // red
    pixels.data[i + 1] -= 50 // green
    pixels.data[i + 2] *= 0.5 // blue
  }

  return pixels
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {}

  document.querySelectorAll('.rgb input')
    .forEach(input => levels[input.name] = input.value)
  
  for (let i = 0; i < pixels.data.length; i+=4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }
}


getVideo()
video.addEventListener('canplay', paintToCanvas)