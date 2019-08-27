let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
    const now = Date.now();
    const expectedTime = now + seconds * 1000;
    displayTimeLeft(seconds);
    displayEndTime(expectedTime);

    clearInterval(countdown);
    countdown = setInterval(() => {
        const secondsLeft = Math.round((expectedTime - Date.now()) / 1000);
        if (secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }

        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;

    const display = `${minutes}:${secondsLeft  < 10 ? '0' : ''}${secondsLeft}`;
    timerDisplay.textContent = display;

    document.title = `Time remaining - ${display}`;
}

function displayEndTime(timestamp) {
    const end = new Date(timestamp);

    const hours = end.getHours();
    const mins = end.getMinutes();

    const display = `Be back at ${hours}:${mins  < 10 ? '0' : ''}${mins}`;
    endTime.textContent = display;
}

buttons.forEach(btn => btn.addEventListener('click', startTimer));

function startTimer() {
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
}

document.customForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const seconds = parseInt(this.minutes.value) * 60;
    timer(seconds);
    this.reset();
})
