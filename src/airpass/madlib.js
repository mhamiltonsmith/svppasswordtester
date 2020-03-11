 function newBlankStory(story) {
	
	mlCanvas = Raphael(picmaxx+10, picminy-80, 900, 600);

//	mlCanvas.rect(picmaxx+235, picminy+5, 500, 500);	
	
	storyRows = story.split("LL");
	//	alert("number of storyRows is "+storyRows.length);
	
	imgPlace = Array();
	imgPlaceCount = 0;
	
	for (var i=0; i<storyRows.length; i++) {
		
		storyPiece = storyRows[i].split("YYY");
	//	alert("storyPiece is "+storyPiece);
		
		imgNum = storyRows[i].match(/YYY/g);
		if (imgNum) imgNum = imgNum.length;
		else imgNum=0;


		//count the distance across
		xdim = 20

		for(var k=0; k<storyPiece.length; k++) {
		//	story[i]="Sentence"+i;
			line = mlCanvas.text(xdim,100+(50*i),storyPiece[k])
			line.attr({'font-size': 18, 'text-anchor':'start'});
			dim=line.getBBox();
			//	alert(dim.x2);
		
			if (k<imgNum) {
				// put an image in (paper.image(src, x, y, width, height))
				mlCanvas.image("http://mvp.soft.carleton.ca/pwd/images/question.jpg",dim.x2+5,80+(50*i),45,45);
				imgPlace[imgPlaceCount]=[dim.x2+5,80+(50*i)];
				imgPlaceCount++;
				// alert("imageplacecount is " + imgPlaceCount)
			}
			
			xdim = dim.x2+60
		}

		// alert("imgPlace is"+imgPlace);
		 
	
	}
	
}

//i is the slot number
//s is the filename
function assignImage(i,s) {
	
	//alert(imgPlace[i][0]);
	
	mlCanvas.image(s,imgPlace[i][0],imgPlace[i][1],52,50);
	
	
}
