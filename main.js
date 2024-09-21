console.clear();

const canvas = document.querySelector("#oof-canvas");
const ctx = canvas.getContext("2d");

const restartBtn = document.querySelector("#restart");

const wordInput = document.querySelector("#word");
const wordSubmit = document.querySelector("#select-word");

resizeCanvas();

const text = {
	value: "OOF",
	color: "245 255 110",
	fontFamily: `"Paytone One", sans-serif`,
	size: 20,
	opacity: 1
};

const textSize = {
	width: null,
	height: null
};

let particleArr = [];

let textCoordinates;

let gravity = 0;
let gravityFlag = false;

let isAnimating = false;

class Particle {
	constructor({ position }) {
		this.position = position;
		this.velocity = {
			x: 0,
			y: 0
		};
		this.size = 2;
	}
	update() {
		this.velocity.y += gravity;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		if (this.position.y >= canvas.height) {
			this.velocity.y = this.velocity.y * -(Math.random() * 0.4 + 0.2);
		}

		this.draw();
	}
	draw() {
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
		ctx.fillStyle = `rgb(${text.color} / 1)`;
		ctx.fillstyle = "#f00";
		ctx.fill();
		ctx.closePath();
	}
	explode() {
		const randomX = 4;
		const randomY = 8;
		this.velocity.x = Math.random() * randomX - randomX / 2;
		this.velocity.y = Math.random() * randomY - randomY / 2;
	}
}

drawOof();

function initializeWord() {
	drawOof();

	getOofData();

	setTimeout(init, 500);
	setTimeout(() => {
		isAnimating = true;
	}, 1000);
}

function init() {
	const stagger = 6;
	for (let y = 0, y2 = textCoordinates.height; y < y2; y += stagger) {
		for (let x = 0, x2 = textCoordinates.width; x < x2; x += stagger) {
			if (textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128) {
				let posX = x;
				textSize.width =
					textSize.width < posX || textSize === null ? posX : textSize.width;
				let posY = y;
				textSize.height =
					textSize.height < posY || textSize === null ? posY : textSize.height;
				let size = 1;
				const position = {
					x: posX * size,
					y: posY * size
				};
				particleArr.push(new Particle({ position }));
			}
		}
	}
	// console.log(textSize);
}

function getOofData() {
	textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function drawOof() {
	ctx.fillStyle = `rgb(${text.color} / ${text.opacity})`;
	ctx.textAlign = "center";
	ctx.font = `${text.size}vw ${text.fontFamily}`;
	ctx.fillText(text.value, canvas.width / 2, (canvas.height / 5) * 3);
}

function animate() {
	if (isAnimating) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);


		for (let i = 0; i < particleArr.length; i++) {
			particleArr[i].update();
			if (particleArr[i].position.y > canvas.height + 10) {
				particleArr.splice(i, 0);
			}
		}

		text.opacity = 0;
		drawOof();

		if (!gravityFlag) {
			particleArr.forEach((particle) => {
				particle.explode();
			});
			gravityFlag = true;
			gravity = 0.1;
		}
	}
	// console.log(particleArr.length);
	requestAnimationFrame(animate);
}
animate();

addEventListener("resize", resizeCanvas);

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

if (restartBtn) {
	restartBtn.addEventListener("click", (e) => {
		restartCanvas();
	});
}

function restartCanvas() {
	// console.log("restarting...")
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	isAnimating = false;
	particleArr = [];
	gravityFlag = false;
	gravity = 0;
	text.opacity = 1;
	drawOof();
	// getOofData();
	setTimeout(init, 2000);
	setTimeout(() => {
		isAnimating = true;
	}, 2500);
}

wordInput.addEventListener("input", (e) => {
	const value = e.target.value;
	text.value = value.toUpperCase();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	isAnimating = false;
	particleArr = [];
	gravityFlag = false;
	gravity = 0;
	text.opacity = 1;
	drawOof();
});

wordSubmit.addEventListener("click", (e) => {
	wordInput.value = "";
	initializeWord();
});
