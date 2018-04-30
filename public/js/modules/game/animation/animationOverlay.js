
export const animationOverlay = (x , y) => {

	const wrapper = document.getElementsByClassName('wrapper')[0];

	const wrapAnim = document.createElement('div');
	wrapAnim.classList.add('overlay');

	const canvas = document.createElement('canvas');
	wrapAnim.appendChild(canvas);
	canvas.setAttribute('id', 'overlay');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	wrapper.appendChild(wrapAnim);
	const ctx = canvas.getContext('2d');
	const start = 4.72;
	const cw = ctx.canvas.width;
	const ch = ctx.canvas.height;
	let diff;
	const gradient = ctx.createLinearGradient(
		x - cw * 0.02 * 0.66,
		y - cw * 0.02 * 0.66,
		x + cw * 0.02 * 0.66,
		y + cw * 0.02 * 0.66
	);
	const gradientStroke = ctx.createLinearGradient(
		x - cw * 0.02 * 0.66,
		y - cw * 0.02 * 0.66,
		x + cw * 0.02 * 0.66,
		y + cw * 0.02 * 0.66
	);

	animate(function(timePassed) {
		diff = ((timePassed / 1000) * Math.PI*2*10).toFixed(2);
		ctx.clearRect(0, 0, cw, ch);
		ctx.lineWidth = 10;
		gradient.addColorStop(0, '#030101');
		gradient.addColorStop(0.5, '#711615');
		gradient.addColorStop(1, '#ee2357');

		gradientStroke.addColorStop(0, '#030101');
		gradientStroke.addColorStop(0.5, '#0d3634');
		gradientStroke.addColorStop(1, '#ffffff');


		ctx.fillStyle = gradient;
		ctx.strokeStyle = gradientStroke;


		ctx.beginPath();
		ctx.arc(x, y, cw * 0.02, start, diff/10+start, false);
		ctx.stroke();
		ctx.fill();
	}, 1000);
	setTimeout(() => {
		wrapper.removeChild(wrapper.lastChild);
	}, 1000);
};


const animate = (draw, duration) => {
	const start = performance.now();
	requestAnimationFrame(function animate(time) {
		let timePassed = time - start;
		if (timePassed > duration) timePassed = duration;
		draw(timePassed);
		if (timePassed < duration) {
			requestAnimationFrame(animate);
		}
	});
};