// const template = document.createElement("template");
// template.innerHTML = /*html*/`
//     <div>
//         <canvas id="myCanvas" width=300 height=100></canvas>
//         <h1>visualizer</h1>
//     </div>
// `;


const template = document.createElement("template");
template.innerHTML = /*html*/`
  <canvas id="canvas" width=500 height=210 style="border: 1px solid"></canvas> 
`;

class VisualizerComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        
    }

    connectedCallback() {
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.getElements();
        this.initVisualizerAudio()
    }

    initVisualizerAudio(){
        setTimeout(() => {
            if (this.audioContext !== null) {
                this.analyser = this.audioContext.createAnalyser();
                // Try changing for lower values: 512, 256, 128, 64...
                this.analyser.fftSize = 256;
                this.bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(this.bufferLength);
                this.sourceNode.connect(this.analyser)
                this.analyser.connect(this.audioContext.destination);
                this.canvasContext = this.canvas.getContext("2d")
                requestAnimationFrame(() => this.visualize());
            }
        },)
    }

    getElements() {
        this.canvas = this.shadowRoot.querySelector("#canvas");
        this.canvasWidth = this.canvas.width
        this.canvasHeight = this.canvas.height
    }

    visualize() {
        // clear the canvas
        this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Get the analyser data
        this.analyser.getByteFrequencyData(this.dataArray);

        let barWidth = this.canvasWidth / this.bufferLength;
        let barHeight;
        let x = 0;

        // values go from 0 to 256 and the canvas heigt is 100. Let's rescale
        // before drawing. This is the scale factor
        let heightScale = this.canvasHeight / 128;

        for (let i = 0; i < this.bufferLength; i++) {
            barHeight = this.dataArray[i];
            let random1 = Math.floor(Math.random() * 255);
            let random2 = Math.floor(Math.random() * 255);
            let random3 = Math.floor(Math.random() * 255);
            this.canvasContext.fillStyle = 'rgb(' + (barHeight + 100) + `${random1},${random2},${random3})`;
            barHeight *= heightScale;
            this.canvasContext.fillRect(x, this.canvasHeight - barHeight / 2, barWidth, barHeight / 2);
            // 2 is the number of pixels between bars
            x += barWidth + 1;
        }
        // call again the visualize function at 60 frames/s
        requestAnimationFrame(() => this.visualize());
    }
}

customElements.define("visualizer-component", VisualizerComponent);