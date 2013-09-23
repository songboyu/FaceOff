// JavaScript Document
function Face(Width,Height,age0,center_x,center_y,eye_left_x,eye_left_y,eye_right_x,eye_right_y,mouth_left_x,mouth_left_y,mouth_right_x,mouth_right_y,nose_x,nose_y,sex0,race0)
{
	this.faceWidth  	= Width;
	this.faceHeight 	= Height;
	this.age			= age0;
	this.center     	= [center_x,center_y];
	this.eye_left   	= [eye_left_x,eye_left_y];
	this.eye_right  	= [eye_right_x,eye_right_y];
	this.mouth_left 	= [mouth_left_x,mouth_left_y];
	this.mouth_right 	= [mouth_right_x,mouth_right_y];
	this.nose			= [nose_x,nose_y];
	this.sex			= sex0;
	this.race			= race0;
	this.upOval 		= new Oval();
	this.doOval 		= new Oval();
	this.angle			= Math.atan((eye_left_y - eye_right_y) / (eye_left_x - eye_right_x));
	with(this)
	{
		upOval.setOval( (eye_right[0] + eye_left[0]) / 2,
						(eye_right[1] + eye_left[1]) / 2,
						 25*faceWidth/48,(nose[1] - eye_left[1]) * 2,
						 angle);

		doOval.setOval( (eye_right[0] + eye_left[0]) / 2,
						(eye_right[1] + eye_left[1]) / 2,
						 25*faceWidth/48,
						(mouth_left[1] - eye_left[1] + faceWidth / 3) / Math.cos(angle),
						 angle);
	}
	this.setFace= function()
	{
		this.point_x[i] = point_x1;
		this.point_y[i] = point_y1;	
	}
	
	 this.drawFace = function(ctx0){
		with(this)
		{
			
			var rgbColor,
             	rgbaColor;

            if (sex === 'Male') 
            {
                rgbColor = '#12BDDC';
                rgbaColor = 'rgba(18,189,220,0.8)';
            } 
            else 
            {
                rgbColor = '#C537D8';
                rgbaColor = 'rgba(197,55,216,0.8)';
            }
			var ctx = ctx0;
			ctx.fillStyle = rgbColor;
			var upOval = new Oval();
			var doOval = new Oval();
			upOval.setOval(center[0],eye_left[1],faceWidth/2,faceHeight/2);
			
			doOval.setOval(center[0],eye_left[1],faceWidth/2,mouth_left[1] - eye_left[1] + faceWidth / 3);
			// 	point_y[2],(point_x[17] - point_x[2]) / 2,point_y[maxLen/2] - point_y[2]);
			
			var y1 = eye_left[1] - upOval.microaxis;
			var y2 = eye_left[1] + doOval.microaxis;
			var x1 = 0;
			var x2 = 0;
			var index = 0;
			var drawflag = false;
			var int_id = 0;
			
			int_id = setInterval(function(){
				if(y1 <= upOval.center_y)
				{
					x1 = upOval.getLeft_x(y1 );
					x2 = upOval.getRight_x(y1);

					ctx.beginPath();
					ctx.arc(x1,y1,2,0,2*Math.PI, false);
					ctx.fill();
					ctx.closePath();

					ctx.beginPath();
					ctx.arc(x2,y1,2,0,2*Math.PI, false);
					ctx.fill();
					ctx.closePath();
					drawflag = true;
				}
				if(y2 >= doOval.center_y)
				{
					x1 = doOval.getLeft_x(y2 );
					x2 = doOval.getRight_x(y2);

					ctx.beginPath();
					ctx.arc(x1,y2,2,0,2*Math.PI, false);
					ctx.fill();
					ctx.closePath();

					ctx.beginPath();
					ctx.arc(x2,y2,2,0,2*Math.PI, false);
					ctx.fill();
					ctx.closePath();
					drawflag = true;
				}
				if(drawflag == true)
					drawflag = false;
				else
				{
					clearInterval(int_id);
				}
				y1 += (y1 - eye_left[1] + upOval.microaxis) / upOval.microaxis + 0.8;
				y2 -= (eye_left[1] + doOval.microaxis - y2) / doOval.microaxis + 0.8;
				
			},5);


			
		}

	 }

}


