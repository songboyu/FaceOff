reciprocal = function(x){
	return x > 1? 1 / x : x;
}

my_round = function(x){
	var tmp = x * 1000;
	tmp = Math.round(tmp);
	return tmp / 1000;
}