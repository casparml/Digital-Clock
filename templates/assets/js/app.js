function clock() {
    let secDots = document.getElementById('secDots');
    let minDots = document.getElementById('minDots');
    let hourDots = document.getElementById('hrDots');

    let date = new Date(); // get current date
    let hours = date.getHours() % 12; // convert to 12 hour format
    let daytime = date.getHours() >= 12 ? 'PM' : 'AM';
    hours = hours === 0 ? 12 : hours; // handle midnight (0 hours)
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let secondsDots = generateDots(60, seconds, 6, true);
    let minutesDots = generateDots(60, minutes, 6, false);
    let hoursDots = generateDots(12, hours, 30, false);

    secDots.innerHTML = secondsDots + '<h2>' + zero(seconds) + '<br><span>Seconds</span></h2>';
    minDots.innerHTML = minutesDots + '<h2>' + zero(minutes) + '<br><span>Minutes</span></h2>';
    hourDots.innerHTML = hoursDots + '<b>' + daytime + '</b>' + '<h2>' + zero(hours) + '<br><span>Hours</span></h2>';
}

function generateDots(total, current, degree, isSeconds) {
    let dots = '';
    for (let i = 1; i <= total; i++) {
        let rotation = i * degree;
        if (isSeconds) {
            dots += '<div class="dot' + (i === current ? ' active' : '') + '" style="transform: rotate(' + rotation + 'deg)"></div>';
        } else {
            dots += '<div class="dot' + (i === current ? ' active' : '') + '" style="transform: rotate(' + rotation + 'deg)' + (current === 0 ? '; background: #555;' : '') + '"></div>';
        }
    }
    return dots;
}

// Add zero to single digit numbers
function zero(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

setInterval(clock, 1000);