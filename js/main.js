var state = "United States",
	factor = "count";

$("#main-chart-container .factor-button").click(function(e){
	e.preventDefault();	
	factor = this.value;
	smallMults(state,factor);
	return false;
})
