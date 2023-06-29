// global variables
let timerIntervalId;
let milliseconds = 0;
let seconds = 0;
let minutes = 0;

let lapMilliseconds = 0;
let lapSeconds = 0;
let lapMinutes = 0;

let lapOrReset = false;
const lapTimes = [];

// html elements
const stopwatchTextElement = document.querySelector('.js-stopwatch-text');
const lapStopwatchTextElement = document.querySelector('.js-lap-stopwatch-text');
const startContinueStopButtonElement = document.querySelector('.js-start-continue-button');
const lapResetButtonElement = document.querySelector('.js-lap-reset-button');
lapResetButtonElement.disabled = true;
const lapGridTitlesElement = document.querySelector('.js-lap-grid-titles');
lapGridTitlesElement.style.display = 'none';

// event listeners
startContinueStopButtonElement
  .addEventListener('click', () => {
    startContinueStopTimer();
  });

lapResetButtonElement
  .addEventListener('click', () => {
    lapResetTimer();
  });

// functions
function startContinueStopTimer() {
  if (startContinueStopButtonElement.innerHTML === 'Start' || 
  startContinueStopButtonElement.innerHTML === 'Continue') {
    console.log('timer started');
    timerIntervalId = setInterval(() => {
      milliseconds++;
      if (milliseconds === 100) {
        milliseconds = 0;
        seconds++;
        if(seconds === 60){
          seconds = 0;
          minutes++;
        }
      }
      setStopwatch();

      if(lapOrReset) {
        lapMilliseconds++;
        if (lapMilliseconds === 100) {
          lapMilliseconds = 0;
          lapSeconds++;
          if(lapSeconds === 60){
            lapSeconds = 0;
            lapMinutes++;
          }
        }
        setLapStopWatch();
      }

    }, 10);
    startContinueStopButtonElement.classList.add('stop-button');
    startContinueStopButtonElement.innerHTML = 'Stop';
    lapResetButtonElement.innerHTML = 'Lap';
    lapResetButtonElement.classList.remove('lap-reset-button-disabled');
    lapResetButtonElement.disabled = false;

  } else if(startContinueStopButtonElement.innerHTML === 'Stop') {
    console.log('timer stoped');
    clearInterval(timerIntervalId);
    timerIntervalId = undefined;
    startContinueStopButtonElement.classList.remove('stop-button');
    startContinueStopButtonElement.innerHTML = 'Continue';
    lapResetButtonElement.innerHTML = 'Reset';

  }
}

function lapResetTimer() {
  if(lapResetButtonElement.innerHTML === 'Lap') {
    console.log('lap saved');
    lapGridTitlesElement.style.display = 'grid';
    addLapTime();
    
  } else if (lapResetButtonElement.innerHTML === 'Reset') {
    console.log('timer reset');

    milliseconds = 0;
    seconds = 0;
    minutes = 0;
    lapMilliseconds = 0;
    lapSeconds = 0;
    lapMinutes = 0;
    setStopwatch();
  
    startContinueStopButtonElement.innerHTML = 'Start';
    lapResetButtonElement.innerHTML = 'Lap';
    lapResetButtonElement.classList.add('lap-reset-button-disabled');
    lapResetButtonElement.disabled = true;
  
    lapStopwatchTextElement.innerHTML = '';

    lapGridTitlesElement.style.display = 'none';
    lapTimes.splice(0,lapTimes.length);
    document.querySelector('.js-lap-grid').innerHTML = '';

    lapOrReset = false;

  }
}

function setStopwatch() {
  stopwatchTextElement.innerHTML = `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
}

function setLapStopWatch() {
  lapStopwatchTextElement.innerHTML = `${pad(lapMinutes)}:${pad(lapSeconds)}.${pad(lapMilliseconds)}`;
}

function pad(num) {
  num = num.toString();
  if (num.length === 1)
    num = "0" + num;
  return num;
}

function displayLapTimes() {
  let lapTimesHTML = '';
  let revLapTimes = lapTimes.slice();
  revLapTimes.reverse();
  revLapTimes.forEach((lapTimeObject) => {
    const {lap, lapTime, totalTime} = lapTimeObject;
    const html = `
      <div>${lap}</div>
      <div>${lapTime}</div>
      <div>${totalTime}</div>`;
      lapTimesHTML += html;
  });

  document.querySelector('.js-lap-grid')
  .innerHTML = lapTimesHTML;
}

function addLapTime() {
  let lap = lapTimes.length + 1;
  let lapTime;

  lapMilliseconds = 0;
  lapSeconds = 0;
  lapMinutes = 0;
  setLapStopWatch();

  if (lap === 1) {
    lapTime = `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
    lapOrReset = true;
  } else {
    const lastTotalTime = lapTimes[lapTimes.length - 1].totalTime;

    const lastMinutes = Number(lastTotalTime.substring(0,2));
    const lastSeconds = Number(lastTotalTime.substring(3,5));
    const lastMilliseconds = Number(lastTotalTime.substring(6,8));
    
    const currentTotalMilliseconds = lapTimeTotalMilliseconds(minutes, seconds, milliseconds);
    const lastTotalMilliseconds = lapTimeTotalMilliseconds(lastMinutes, lastSeconds, lastMilliseconds);
    const currentLapTimelMilliseconds = currentTotalMilliseconds - lastTotalMilliseconds;

    lapTime = millisecondsToLapTime(currentLapTimelMilliseconds);

  }
  const totalTime = `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
  lap = pad(lap);
  lapTimes.push({lap, lapTime, totalTime});
  displayLapTimes();

}

function lapTimeTotalMilliseconds(min, sec, mill) {
  return ((min * 60) + sec) * 100 + mill;
}

function millisecondsToLapTime(totalMilliseconds) {
  const mill = totalMilliseconds % 100;
  totalMilliseconds = Math.floor(totalMilliseconds / 100);
  const sec = totalMilliseconds % 60;
  totalMilliseconds =  Math.floor(totalMilliseconds / 60);
  const min = totalMilliseconds;

  return `${pad(min)}:${pad(sec)}.${pad(mill)}`;
}