var state = "United States",
	factor = "count";

$("#main-chart-container .factor-button").on("click", function(){

console.log(this.value);
	factor = this.value;
console.log(state,factor);
	smallMults(state,factor)
})
