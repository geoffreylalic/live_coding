import '../lib/webaudio-controls.js'

const getBaseUrl = () => {
  // console.log(`${window.location.host}/`)
  // console.log(`http://${window.location.host}/assets/knobs/vsliderbody.png`)
  // return `http://${window.location.host}/`;
  console.log(new URL('.', import.meta.url))
  return new URL('.', import.meta.url);
}
const template = document.createElement("template");
template.innerHTML = /*html*/`
<style>
  .filter {
    width : 250px; 
    display: inline-flex !important;
    flex-direction: row !important;
    justify-content: space-between;
  }
  .filter-freq {
  }
</style>
<div class='filter'>
  <webaudio-slider
    class='filter-freq'
    id="gain0"
    src="https://raw.githubusercontent.com/g200kg/webaudio-controls/master/knobs/vsliderbody.png" 
    src="https://raw.githubusercontent.com/g200kg/webaudio-controls/master/knobs/vsliderknob.png"
    value=1
    min=-30
    max=30
    step=0.1
    basewidth=24
    baseheight=128
    knobwidth=24
    knobheight=24
    ditchlength=100
    tooltip="60Hz"
  ></webaudio-slider>
  <webaudio-slider
   class='filter-freq'
    id="gain1"
    src="https://raw.githubusercontent.com/g200kg/webaudio-controls/master/knobs/vsliderbody.png" 
    src="https://raw.githubusercontent.com/g200kg/webaudio-controls/master/knobs/vsliderknob.png"
    value=1
    min=-30
    max=30
    step=0.1
    basewidth=24
    baseheight=128
    knobwidth=24
    knobheight=24
    ditchlength=100
    tooltip="170Hz"
  ></webaudio-slider>
  <webaudio-slider
    class='filter-freq'
    id="gain2"
    src="https://raw.githubusercontent.com/g200kg/webaudio-controls/master/knobs/vsliderbody.png" 
    src="https://raw.githubusercontent.com/g200kg/webaudio-controls/master/knobs/vsliderknob.png"
    value=1
    min=-30
    max=30
    step=0.1
    basewidth=24
    baseheight=128
    knobwidth=24
    knobheight=24
    ditchlength=100
    tooltip="350Hz"
  ></webaudio-slider>

  <webaudio-slider
    class='filter-freq'
    id="gain3"
    src="https://raw.githubusercontent.com/g200kg/webaudio-controls/master/knobs/vsliderbody.png" 
    src="https://raw.githubusercontent.com/g200kg/webaudio-controls/master/knobs/vsliderknob.png"
    value=1
    min=-30
    max=30
    step=0.1
    basewidth=24
    baseheight=128
    knobwidth=24
    knobheight=24
    ditchlength=100
    tooltip="1000Hz"
  ></webaudio-slider>
  <webaudio-slider
    class='filter-freq'
    id="gain4"
    src="https://raw.githubusercontent.com/g200kg/webaudio-controls/master/knobs/vsliderbody.png" 
    src="https://raw.githubusercontent.com/g200kg/webaudio-controls/master/knobs/vsliderknob.png"
    value=1
    min=-30
    max=30
    step=0.1
    basewidth=24
    baseheight=128
    knobwidth=24
    knobheight=24
    ditchlength=100
    tooltip="3500Hz"
  ></webaudio-slider>
  <webaudio-slider
    class='filter-freq'
    id="gain5"
    src="https://raw.githubusercontent.com/g200kg/webaudio-controls/master/knobs/vsliderbody.png" 
    src="https://raw.githubusercontent.com/g200kg/webaudio-controls/master/knobs/vsliderknob.png"
    value=1
    min=-30
    max=30
    step=0.1
    basewidth=24
    baseheight=128
    knobwidth=24
    knobheight=24
    ditchlength=100
    tooltip="10000Hz"
  ></webaudio-slider>
</div>

`;

class FilterComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.initAudio()
    this.getElements()
    this.defineListenners()

  }
  getElements() {
    this.gain0 = this.shadowRoot.querySelector('#gain0')
    this.gain1 = this.shadowRoot.querySelector('#gain1')
    this.gain2 = this.shadowRoot.querySelector('#gain2')
    this.gain3 = this.shadowRoot.querySelector('#gain3')
    this.gain4 = this.shadowRoot.querySelector('#gain4')
    this.gain5 = this.shadowRoot.querySelector('#gain5')

    this.outputGain0 = this.shadowRoot.querySelector('#outputGain0')
    this.outputGain1 = this.shadowRoot.querySelector('#outputGain1')
    this.outputGain2 = this.shadowRoot.querySelector('#outputGain2')
    this.outputGain3 = this.shadowRoot.querySelector('#outputGain3')
    this.outputGain4 = this.shadowRoot.querySelector('#outputGain4')
    this.outputGain5 = this.shadowRoot.querySelector('#outputGain5')
  }

  changeGain(sliderVal, nbFilter) {
    var value = parseFloat(sliderVal);
    this.filters[nbFilter].gain.value = value;

    // update output labels
    // var output = this.shadowRoot.querySelector("#outputGain" + nbFilter);
    // output.value = value + " dB";
  }

  defineListenners() {
    this.gain0.addEventListener('input', (evt) => {
      this.changeGain(evt.target.value, 0)
    })
    this.gain1.addEventListener('input', (evt) => {
      this.changeGain(evt.target.value, 1)
    })
    this.gain2.addEventListener('input', (evt) => {
      this.changeGain(evt.target.value, 2)
    })
    this.gain3.addEventListener('input', (evt) => {
      this.changeGain(evt.target.value, 3)
    })
    this.gain4.addEventListener('input', (evt) => {
      this.changeGain(evt.target.value, 4)
    })
    this.gain5.addEventListener('input', (evt) => {
      this.changeGain(evt.target.value, 5)
    })
  }

  initAudio() {
    setTimeout(() => {
      this.filters = [];
      // Set filters
      [60, 170, 350, 1000, 3500, 10000].forEach((freq, i) => {
        let eq = this.audioContext.createBiquadFilter();
        eq.frequency.value = freq;
        eq.type = "peaking";
        eq.gain.value = 0;
        this.filters.push(eq);
      });

      // Connect filters in serie
      this.sourceNode.connect(this.filters[0]);
      for (let i = 0; i < this.filters.length - 1; i++) {
        this.filters[i].connect(this.filters[i + 1]);
      }

      // connect the last filter to the speakers
      this.filters[this.filters.length - 1].connect(this.audioContext.destination);
    })

  }




}

customElements.define("filter-component", FilterComponent);