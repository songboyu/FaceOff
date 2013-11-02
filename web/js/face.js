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
	this.angle			= Math.atan((eye_left_y - eye_right_y) / (eye_left_x - eye_right_x));

	this.setFace= function()
	{
		this.point_x[i] = point_x1;
		this.point_y[i] = point_y1;	
	}
	this.drawFace = function(ctx0){
		with(this)
		{
			var ctx = ctx0;
			
			var upOval = new Oval();
			var doOval = new Oval();
			upOval.setOval((eye_left[0] + eye_right[0]) / 2,
				(eye_left[1] + eye_right[1]) / 2,
				(eye_right[0] - eye_left[0]) / Math.cos(angle),
				faceHeight/2);
			
			doOval.setOval((eye_left[0] + eye_right[0]) / 2,
				(eye_left[1] + eye_right[1]) / 2,
				(eye_right[0] - eye_left[0]) / Math.cos(angle),
				mouth_left[1] - eye_left[1] + faceWidth / 3);

			var int_id = 0;

			ctx.save();

			ctx.translate(upOval.center_x,upOval.center_y);
			ctx.rotate(angle);
			ctx.lineWidth = 4;
			
			var TMP_PI = Math.PI;
			var INC_ANGLE = TMP_PI / 90;
			var tmp_angle = 0 - INC_ANGLE;
			int_id = setInterval(function(){
				tmp_angle += INC_ANGLE;
				ctx.save();
				ctx.scale(1,upOval.microaxis/upOval.macroaxis);
				ctx.beginPath();
				ctx.arc(0,0,upOval.macroaxis,
					TMP_PI * 1.5 + tmp_angle - INC_ANGLE / 2,
					TMP_PI * 1.5 + tmp_angle + INC_ANGLE);
				ctx.closePath();
				ctx.restore();
				ctx.stroke();
				
				ctx.save();
				ctx.scale(1,upOval.microaxis/upOval.macroaxis);
				ctx.beginPath();
				ctx.arc(0,0,upOval.macroaxis,
					TMP_PI * 1.5 - tmp_angle + INC_ANGLE / 2,
					TMP_PI * 1.5 - tmp_angle - INC_ANGLE,true);
				ctx.closePath();
				ctx.restore();
				ctx.stroke();

				ctx.save();
				ctx.scale(1,doOval.microaxis/doOval.macroaxis);
				ctx.beginPath();
				ctx.arc(0,0,doOval.macroaxis,
					TMP_PI * 0.5 + tmp_angle - INC_ANGLE / 2,
					TMP_PI * 0.5 + tmp_angle + INC_ANGLE);
				ctx.restore();
				ctx.stroke();
				
				ctx.save();
				ctx.scale(1,doOval.microaxis/doOval.macroaxis);
				ctx.beginPath();
				ctx.arc(0,0,doOval.macroaxis,
					TMP_PI * 0.5 - tmp_angle + INC_ANGLE / 2,
					TMP_PI * 0.5 - tmp_angle - INC_ANGLE,true);
				ctx.restore();
				ctx.stroke();

				if(tmp_angle > TMP_PI / 2){
					ctx.restore();
					clearInterval(int_id);
				}
			},30);


			
		}

	 }

}


