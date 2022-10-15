import './lib/webaudio-controls.js';
import './filter/index.js'
import './visualizer/index.js'
import './balance/index.js'

const getBaseURL = () => {
  return new URL('.', import.meta.url);
};

class myComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    // this.src = this.getAttribute('src');

    // const defaultAudio = 'https://mainline.i3s.unice.fr/mooc/LaSueur.mp3'
    this.queue = [
      'myComponents/assets/audio/Lil Baby - Real Spill.mp3',
      'myComponents/assets/audio/Lil Baby - Perfect Timing.mp3',
      'myComponents/assets/audio/The Game, 50 Cent - Hate It Or Love It (Official Music Video).mp3',
      'myComponents/assets/audio/AUUGHHH Sound Effect [TubeRipper.com].mp3',
      'myComponents/assets/audio/I mean it’s alright overrated as fuck in my opinion..mp3',
      'myComponents/assets/audio/pop smoke acting like a dog.mp3',
      'myComponents/assets/audio/Speed SUI Sound effect.mp3']
    this.currentlyPlaying = 0
    this.loop = false
    this.src = this.queue[this.currentlyPlaying]
  }

  connectedCallback() {
    // Do something
    this.shadowRoot.innerHTML = `
        <style>
            h1 {
                color:red;
            }
            .main-container{
              display: flex;
              margin:auto;
              padding: 15px 0 0 0;
            }
            .center-container{
              width: 500px;
              height: auto;
              displey: flex !important;
              flex-direction: column;
              text-align: center;
              padding: 0 20px;
            }
            #visualizer{
            }
            #controls{
              padding: 5px;
            }
            #filter{
              padding: 5px;
            }
            #volumeKnob{
              padding: 0 0 150 0
            }
        </style>
        <h1>lecteur audio amélioré</h1>
        <div> 
              add an url to add the music in the queue 
              <input id='search'/><span id='searchError'></span>
              <button id='addQueue'> add in queue </button>
          </div>
        <div class='main-container'>
          <audio id="player" src="${this.src}"></audio>
          <balance-component id='balance'> </balance-component>
          <div class='center-container'>
            <visualizer-component id="visualizer"></visualizer-component>
            <div id="controls">
              <button id="play">Play</button>
              <button id="pause">Pause</button>
              <button id="stop">Stop</button>
              <button id="restart">Restart</button>
              <button id="rewind">-10 sec</button>
              <button id="forward">+10 sec</button>
              <button id="next">Next</button>
              <button id="previous">Previous</button>
              <button id="loop">loop</button>
            </div>
            <filter-component id='filter'> </filter-component>
          </div>
          <div>
            <webaudio-knob 
              id="volumeKnob" 
              src="./assets/knobs/LittlePhatty.png" 
              value="0.5" max="1" step="0.1" diameter="50" sprites="100" 
              valuetip="0" tooltip="Volume">
            </webaudio-knob>
            <h1>Tracklist</h1>
            <div id="queue"></div></div>
          </div>

          <h1>fortnite move </h1>
          <video id="video" width="250" src="/myComponents/assets/videos/fortnite_dance.mp4" autoplay loop muted> </video>
    `;

    this.fixRelativeURLs();
    this.defineElements();
    this.initAudio();
    this.definePlaylist();
    this.defineListeners();
  }

  initAudio() {
    this.video.pause()
    let audioCtx = window.AudioContext || window.webkitAudioContext;
    let audioContext = new audioCtx();
    this.player.onplay = () => audioContext.resume()

    // fix for autoplay policy
    this.player.addEventListener('play', () => audioContext.resume());

    let sourceNode = audioContext.createMediaElementSource(this.player);
    let pannerNode = audioContext.createStereoPanner()
    this.visualizer.audioContext = audioContext
    this.visualizer.sourceNode = sourceNode

    this.filter.audioContext = audioContext
    this.filter.sourceNode = sourceNode

    this.balance.audioContext = audioContext
    this.balance.sourceNode = sourceNode
    this.balance.pannerNode = pannerNode

  }

  defineElements() {
    this.player = this.shadowRoot.querySelector('#player');
    this.filter = this.shadowRoot.querySelector('#filter')
    this.visualizer = this.shadowRoot.querySelector("#visualizer")
    this.playlist = this.shadowRoot.querySelector('#queue')
    this.balance = this.shadowRoot.querySelector('#balance')
    this.video = this.shadowRoot.querySelector("#video")
  }

  definePlaylist() {
    this.playlist.innerHTML = this.queue.map((el) => {
      let song = el.split('/')
      let title = song[3]
      return `<div>${title}</div>`
    })
  }

  fixRelativeURLs() {
    const baseURL = getBaseURL();
    // console.log('baseURL', baseURL);

    const knobs = this.shadowRoot.querySelectorAll('webaudio-knob');

    for (const knob of knobs) {
      // console.log("fixing " + knob.getAttribute('src'));

      const src = knob.src;
      knob.src = baseURL + src;

      // console.log("new value : " + knob.src);
    }
  }


  defineListeners() {
    this.shadowRoot.querySelector('#play').addEventListener('click', () => {
      this.player.play();
      this.video.play()
    });
    this.shadowRoot.querySelector('#pause').addEventListener('click', () => {
      this.player.pause();
      this.video.pause()
    });
    this.shadowRoot.querySelector('#stop').addEventListener('click', () => {
      this.player.pause();
      this.player.currentTime = 0;
      this.video.pause();
      this.video.currentTime = 0;
    });
    this.shadowRoot.querySelector('#volumeKnob').addEventListener('input', (evt) => {
      this.player.volume = evt.target.value;
    });
    this.shadowRoot.querySelector('#forward').addEventListener('click', () => {
      this.player.currentTime += 10;
      this.video.currentTime += 10;
    });
    this.shadowRoot.querySelector('#rewind').addEventListener('click', () => {
      this.player.currentTime -= 10;
      this.video.currentTime -= 10;
    });
    this.shadowRoot.querySelector('#restart').addEventListener('click', () => {
      this.player.currentTime = 0;
      this.player.play()
      this.video.play()
      this.video.currentTime = 0
    });
    this.shadowRoot.querySelector('#addQueue').addEventListener('click', () => {
      this.queue.push(this.shadowRoot.querySelector('#search').value)
      this.shadowRoot.querySelector('#search').value = ''
      this.shadowRoot.querySelector('#queue').innerHTML = this.queue.map((el) => {
        return `<div> ${el}</div>`
      })
    });
    this.shadowRoot.querySelector('#next').addEventListener('click', () => {
      if (this.currentlyPlaying < this.queue.length - 1) {
        this.currentlyPlaying++
      }
      this.player.src = this.queue[this.currentlyPlaying]
      this.src = this.queue[this.currentlyPlaying]
      this.player.play()
      this.video.currentTime = 0;
      this.video.play()
    });
    this.shadowRoot.querySelector('#previous').addEventListener('click', () => {
      if (this.currentlyPlaying > 0) {
        this.currentlyPlaying--
      }
      this.player.src = this.queue[this.currentlyPlaying]
      this.src = this.queue[this.currentlyPlaying]
      this.player.play()
      this.video.currentTime = 0;
      this.video.play()
    });
    this.shadowRoot.querySelector('#loop').addEventListener('click', () => {
      this.loop = !this.loop
      this.player.loop = this.loop;
      this.video.loop = this.loop;
    });
    this.player.addEventListener("ended", (evt) => {
      if (!this.loop) {
        this.currentlyPlaying++
      }
    })
  }
}
customElements.define("my-audio", myComponent);
