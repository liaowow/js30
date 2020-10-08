let countdown;
const timerDisplay = document.querySelector('.display__time-left')
const endTime = document.querySelector('.display__end-time')

function timer(seconds) {
  const now = Date.now()
  const then = now + (seconds * 1000)
  displayTimeLeft(seconds)
  displayEndTime(then)

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000)
    // check if second goes below zero
    if (secondsLeft < 0) {
      clearInterval(countdown)
      return
    }

    // display time
    displayTimeLeft(secondsLeft)

  }, 1000)
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSecs = seconds % 60
  // console.log({minutes, remainingSecs})
  const display = `${minutes}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`
  timerDisplay.textContent = display
  document.title = display
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp)
  const hour = end.getHours()
  const adjustedHour = hour > 12 ? hour - 12 : hour
  const minutes = end.getMinutes()

  endTime.textContent = `Be Back At ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`
}