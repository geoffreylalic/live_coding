import '../lib/webaudio-controls.js';

const getBaseUrl = () => {
    return "https://dorian-chapoulie.github.io/tp_webcomponents/components";
}
const template = document.createElement("template");
template.innerHTML = /*html*/`
  <webaudio-knob 
  id="balance" 
  src="https://raw.githubusercontent.com/g200kg/webaudio-controls/master/knobs/SimpleFlat3.png" 
  value="0" max="1" min='-1' step="0.1" diameter="50" sprites="100" 
  valuetip="0" tooltip="Left - Right">
</webaudio-knob>
  `;

class BalanceComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.initAudio()
        this.getElements()


    }
    getElements() {
        this.balance = this.shadowRoot.querySelector('#balance')
    }

    defineListenners() {
        this.balance.addEventListener('input', (evt) => {
            this.pannerNode.pan.value = evt.target.value;
        });
    }

    initAudio() {
        setTimeout(() => {
            this.sourceNode.connect(this.pannerNode)
            this.pannerNode.connect(this.audioContext.destination);
            this.defineListenners()
        })

    }




}

customElements.define("balance-component", BalanceComponent);