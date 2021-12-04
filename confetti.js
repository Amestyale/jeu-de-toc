function congratulations(msg,time, callback = null){
    modale()
    banner(msg, time)
    // do this for 30 seconds
    var duration = time + 1000;
    var end = Date.now() + duration;

    (function frame() {
      // launch a few confetti from the left edge
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 1 }
      });
      // and launch a few from the right edge
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 1 }
      });
  
      // keep going until we are out of time
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    setTimeout(() => {
        hideBanner(callback)
    }, duration + 1250);

}

function hideBanner(callback = null){
    let filter = document.querySelector(".filter")
    let banner = document.querySelector("#banner")
    filter.style.opacity = 0
    banner.style.opacity = 0
    setTimeout(() => {
        filter.classList.remove("light")
        filter.style.display = "none"
        filter.style.opacity = 1
        banner.style.display = "none"
        banner.style.transition = "opacity 1s ease-in-out"
        if(callback) callback();
    }, 1000);
}
function banner(msg, time){
    let filter = document.querySelector(".filter")
    let banner = document.querySelector("#banner")
    filter.classList.add("light")
    filter.style.display = "block"
    banner.innerHTML = ""
    banner.style.display = "block"
    banner.style.transition = "none"
    banner.style.opacity = "1"
    let letters = [];
    for (let i = 0; i < msg.length; i++) {
        let letter = document.createElement("span")
        letter.innerHTML = msg[i]
        letter.classList.add("letter")
        letter.style.fontSize = "2em"
        letter.style.visibility = "hidden"
        banner.append(letter)
        letters.push(letter)
    }
    letters.forEach((letter,i) => {
        setTimeout(() => {
            letter.style.fontSize = "1em"
            letter.style.visibility = "unset"
        }, (time/msg.length)*i+1);
    });
}
