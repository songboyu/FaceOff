// JavaScript Document
function Oval()
{
	this.center_x  = 0;
	this.center_y  = 0;
	this.microaxis = 0;
	this.macroaxis = 0;
	this.setOval = function(center_x,center_y,macroaxis,microaxis)
	{
		this.center_x = center_x;
		this.center_y = center_y;
		this.macroaxis = macroaxis;
		this.microaxis = microaxis;
	}
	this.getLeft_x = function(y)
	{
		with(this)
		{
			var left_x;
			left_x = center_x - 
				(Math.sqrt((microaxis+y-center_y)*(microaxis-y+center_y))/microaxis)*macroaxis;
			return left_x;
		}
	}
	this.getRight_x = function(y)
	{
		with(this)
		{
			var right_x;
			right_x = center_x + 
				(Math.sqrt((microaxis+y-center_y)*(microaxis-y+center_y))/microaxis)*macroaxis;
			return right_x;
		}
	}
}