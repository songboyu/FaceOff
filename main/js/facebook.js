var MOVE = true;
var count = 0;
function faceBook(Width,Height,offsetX,offsetY)
{
	this.Width 		= Width;
	this.Height 	= Height;
	this.offsetX 	= offsetX;
	this.offsetY 	= offsetY;
	this.tiles		= [];
	this.TILE_WIDTH = Width / 16;
	this.TILE_HEIGHT= Height / 16;
	
	this.SEPARATE 	= true;
	this.RAD 		= Math.PI / 180;
	this.createTiles = function()
	{
        var offsetX = this.offsetX;
        var offsetY = this.offsetY;
        var y = 0;
        while (y < this.Height) {
            var x = 0;
            while (x < this.Width) {
                var tile = new Tile();
                tile.imageX 	= x;
                tile.imageY 	= y;
                tile.originX 	= offsetX + x;
                tile.originY 	= offsetY + y;
                tile.currentX 	= tile.originX;
                tile.currentY 	= tile.originY;
                tile.Width 		= this.TILE_WIDTH;
                tile.Height 	= this.TILE_HEIGHT;
                this.tiles.push(tile);
                x += this.TILE_WIDTH;
            }
            y += this.TILE_HEIGHT;
        }
	}

	this.changeTiles = function(X,Y)
	{
		var offsetX = X;
        var offsetY = Y;
        for (var i = 0; i < this.tiles.length;i++) 
        {
                var tile 		= this.tiles[i];
                tile.imageX 	= (i % 16) * this.TILE_WIDTH;
                tile.imageY 	= (i / 16) * this.TILE_HEIGHT;
                tile.originX 	= offsetX + tile.imageX;
                tile.originY 	= offsetY + tile.imageY;
                tile.Width 		= this.TILE_WIDTH;
                tile.Height 	= this.TILE_HEIGHT;
        }
	}

	this.deleteTiles = function()
	{
		while(this.tiles.length > 0)
		{
			this.tiles.pop();
		}
	}

	this.explode = function(img,canvas,canvas1,canvas2,ctx,ctx2,faceInfo)
	{
		MOVE = true;
		this.createTiles();
		var _this = this;
		var callback = function(){
			
            _this.changePosition(canvas1,canvas2,ctx2,faceInfo);
            _this.processFrame(img,canvas,canvas2,ctx);
		};
		var resetTile = function()
		{
			count = 0;
			_this.deleteTiles();
			canvas2.width = faceInfo.faceWidth;
            canvas2.height= faceInfo.faceHeight;
            ctx2.drawImage(canvas1,
                0, //x
                0, //y
                canvas2.width, //宽度
                canvas2.height//高度
            );
            _this.TILE_WIDTH = canvas2.width / 16;
            _this.TILE_HEIGHT = canvas2.height / 16;
            _this.createTiles();
		}
        var Int = setInterval(function() 
        {
        	
			if(MOVE == true)
			{
               callback();
            } 
            else
            {

                clearInterval(Int);
                ctx2.globalAlpha = 1;
                resetTile();
            }
        }, 33);
	}

	this.processFrame = function(img,canvas,canvas2,ctx)
    {
    	
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        for(var i = 0;i < this.tiles.length;i++)
        {
            var tile = this.tiles[i];
            ctx.save();
            ctx.translate(tile.currentX, tile.currentY);
            ctx.rotate(tile.rotation * this.RAD);
            ctx.drawImage(canvas2,
                tile.imageX,tile.imageY,
                this.TILE_WIDTH,
                this.TILE_HEIGHT,
                0,0,
                this.TILE_WIDTH,
                this.TILE_HEIGHT);
            ctx.restore();
        }
    }

    this.changePosition = function(canvas1,canvas2,ctx2,faceInfo)
    {
        if(this.SEPARATE == true)
        {
            for(var i = 0;i < this.tiles.length;i++)
            {
                var tile = this.tiles[i];
                tile.currentX -= (canvas2.width / 2 - tile.imageX) / this.TILE_WIDTH;
                tile.currentY -= (canvas2.height / 2 - tile.imageY) / this.TILE_HEIGHT;
                tile.rotation += (canvas2.width/ 2 - tile.imageX);
                if(i == 0 && tile.currentY <= this.TILE_HEIGHT)
                {
                    this.SEPARATE = false;
                }

            }
            if(!this.SEPARATE)
            {
            	var wRate = ((faceInfo.eye_right[0] - faceInfo.eye_left[0]) / Math.cos(faceInfo.angle)) / 240;
                var hRate = (((faceInfo.eye_right[1] + faceInfo.eye_left[1]) / 2) / Math.cos(faceInfo.angle)) / 160;
                var newWidth = 630 * wRate;
                var newHeight = 878 * hRate;
            	canvas2.width = newWidth;
                canvas2.height = newHeight;
                this.TILE_WIDTH = canvas2.width / 16;
                this.TILE_HEIGHT = canvas2.height / 16;
                ctx2.clearRect(0,0,canvas2.width,canvas2.height);                
                ctx2.save();
                ctx2.globalAlpha = 0.5;
                

                ctx2.drawImage(canvas1,0,0,630,878,
                    0,
                    0,
                    newWidth,
                    newHeight);

                ctx2.drawImage(canvas1,0,0,630,878,
                    0,
                    0,
                    faceInfo.eye_left[0] - faceInfo.upOval.center_x + faceInfo.upOval.macroaxis,
                    faceInfo.eye_left[1] - faceInfo.upOval.center_y + faceInfo.upOval.microaxis);
                ctx2.drawImage(canvas1,200,0,230,430,
                    faceInfo.eye_left[0] - faceInfo.upOval.center_x + faceInfo.upOval.macroaxis,
                    0,
                    faceInfo.eye_right[0] - faceInfo.eye_left[0],
                    faceInfo.eye_left[1] - faceInfo.upOval.center_y + faceInfo.upOval.microaxis);
                ctx2.drawImage(canvas1,430,0,200,430,
                    faceInfo.eye_right[0] - faceInfo.upOval.center_x + faceInfo.upOval.macroaxis,
                    0,
                    faceInfo.upOval.center_x + faceInfo.upOval.macroaxis - faceInfo.eye_right[0],
                    faceInfo.eye_left[1] - faceInfo.upOval.center_y + faceInfo.upOval.microaxis);

                ctx2.drawImage(canvas1,0,430,200,170,
                    0,
                    faceInfo.eye_left[1] - faceInfo.upOval.center_y + faceInfo.upOval.microaxis,
                    faceInfo.eye_left[0] - faceInfo.upOval.center_x + faceInfo.upOval.macroaxis,
                    faceInfo.nose[1] - faceInfo.eye_left[1]);
                ctx2.drawImage(canvas1,200,430,230,170,
                    faceInfo.eye_left[0] - faceInfo.upOval.center_x + faceInfo.upOval.macroaxis,
                    faceInfo.eye_left[1] - faceInfo.upOval.center_y + faceInfo.upOval.microaxis,
                    faceInfo.eye_right[0] - faceInfo.eye_left[0],
                    faceInfo.nose[1] - faceInfo.eye_left[1]);
                ctx2.drawImage(canvas1,430,430,200,170,
                    faceInfo.eye_right[0] - faceInfo.upOval.center_x + faceInfo.upOval.macroaxis,
                    faceInfo.eye_left[1] - faceInfo.upOval.center_y + faceInfo.upOval.microaxis,
                    faceInfo.upOval.center_x + faceInfo.upOval.macroaxis - faceInfo.eye_right[0],
                    faceInfo.nose[1] - faceInfo.eye_left[1]);


                ctx2.drawImage(canvas1,0,600,200,278,
                    0,
                    faceInfo.nose[1] - faceInfo.upOval.center_y + faceInfo.upOval.microaxis,
                    faceInfo.eye_left[0] - faceInfo.upOval.center_x + faceInfo.upOval.macroaxis,
                    faceInfo.doOval.center_y + faceInfo.doOval.microaxis - faceInfo.nose[1]);
                ctx2.drawImage(canvas1,200,600,230,278,
                    faceInfo.eye_left[0] - faceInfo.upOval.center_x + faceInfo.upOval.macroaxis,
                    faceInfo.nose[1] - faceInfo.upOval.center_y + faceInfo.upOval.microaxis,
                    faceInfo.eye_right[0] - faceInfo.eye_left[0],
                    faceInfo.doOval.center_y + faceInfo.doOval.microaxis - faceInfo.nose[1]);
                ctx2.drawImage(canvas1,430,600,200,278,
                    faceInfo.eye_right[0] - faceInfo.upOval.center_x + faceInfo.upOval.macroaxis,
                    faceInfo.nose[1] - faceInfo.upOval.center_y + faceInfo.upOval.microaxis,
                    faceInfo.upOval.center_x + faceInfo.upOval.macroaxis - faceInfo.eye_right[0],
                    faceInfo.doOval.center_y + faceInfo.doOval.microaxis - faceInfo.nose[1]);

                ctx2.restore();

                this.changeTiles(faceInfo.upOval.center_x - faceInfo.upOval.macroaxis,
                	faceInfo.upOval.center_y - faceInfo.upOval.microaxis);

				this.changeTiles(faceInfo.nose[0] - 315 * wRate,
                	faceInfo.nose[1] - 590 * hRate);
            }
        }
        else
        {
            var tile = this.tiles[count];
            tile.currentX = tile.originX;
            tile.currentY = tile.originY;
            tile.rotation = 0;
            if(count == 255)
                this.SEPARATE = true;
       		count++;
            if(this.SEPARATE)
               	MOVE = false;
        }
    }


}
Tile = function(Width,Height) {
    this.originX = 0;
    this.originY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.rotation = 0;
    this.imageX = 0;
    this.imageY = 0;
    this.Width = Width;
    this.Height = Height;
};