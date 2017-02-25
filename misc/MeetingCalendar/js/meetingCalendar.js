/*
 * JS file for calendar application
 * @author: Rohit Anand
 */

//a global object to contain every js realted code
var MeetingCalendar = MeetingCalendar || {};

MeetingCalendar.meetingData = (function(){
    "use strict";
    
    var fn, api, constants;
    
    constants = {
    	width: 600,
    	left: 0,
    	pixel: 2
    }
    
    //private
    fn = {
    	
    	//returns css properties to be used by any function
    	//input onject array is modified to add additional property
    	_getMeetingPosition: function(dataArr){
            if(dataArr && dataArr.length){
				var i = 0;
            	for(i; i< dataArr.length; i++){
            		//passing object, any change in property will be made to input array as it's passed by reference
					fn._calculateCssProps(dataArr[i]);
				}
            }   
        },
        
        //returns css property based on problem constants
        _calculateCssProps: function(obj){
        	obj['top'] = obj['start'] * constants['pixel'];
        	obj['height'] = (obj['end'] - obj['start'])  * constants['pixel'];
        	obj['left'] = constants['left'];
        	obj['width'] = constants['width'];
        },
        
        //returns html string which can be used by any client to draw dom on browser
        _drawMeetingCalendar: function(dataArr){
        	if(dataArr && dataArr.length){
				var i = 0, finalHtml = '', startSortedArr = '', endSortedArr = '';
				
				//creating two array out of input array. next 3 steps are done to avoid object reference property 
				//i.e. any changes made to startSortedArr/endSortedArr will not be reflected to input array
				var tempArr = JSON.stringify(dataArr);
				startSortedArr = JSON.parse(tempArr);
				endSortedArr = JSON.parse(tempArr);
				
				//sorting array based on start/end
				fn._sortByStart(startSortedArr);
				fn._sortByEnd(endSortedArr);
				
				//finding overlapping range
				fn._findOverlappingRange(startSortedArr, endSortedArr);
				
				//creating html
            	for(i; i< startSortedArr.length; i++){
            		//final width = width/widthDivisor
            		//final left = (leftCalc * width)/widthDivisor
            		finalHtml += '<div class="row" style="top:'+ startSortedArr[i]['top'] +'px; height:'+ startSortedArr[i]['height'] +'px; width: '+ startSortedArr[i]['width']/startSortedArr[i]['widthDivisor'] +'px; background: #'+ Math.floor(Math.random()*16777215).toString(16) +'; left: '+ ((startSortedArr[i]['leftCalc']* constants['width'])/startSortedArr[i]['widthDivisor']) +'px">'+ startSortedArr[i]['id'] +'</div>';
				}
            	
            	//returns final html string
            	return finalHtml;
            } 
        },
        
        //method to find overlapping range
        //the logic for finding range:width
        // 1. keep two sorted object array based on start and end
        // 2. start comparing element of startSortedArr with endSortedArr
        // 3. keep increasing cnt if startSortedArr element is less than endSortedArr else decrease it
        // 4. also keep track of count by which i pointer is moving - xMovement
        // 5. if cnt == 0 means overlapping range is over, so find the widthDivisor
        // i.e. id there are 4 overlapping time range, widthDivisor should be 4
        _findOverlappingRange: function(startSortedArr, endSortedArr){
        	var startLen = startSortedArr.length, endLen = endSortedArr.length, i = 0, j = 0;
        	var cnt = 0, xMovement = 0;
        	
        	while(i < startLen && j < endLen){
        		if(startSortedArr[i]['start'] < endSortedArr[j]['end']){
        			startSortedArr[i]['leftCalc'] = cnt;
        			cnt++;
        			i++;
        			if(xMovement < cnt){
        				xMovement = cnt;
        			}
        		}
        		else{
        			j++;
        			cnt--;
        			
        			if(cnt === 0){
        				for(var k = (i - xMovement); k < i; k++){
                			startSortedArr[k]['widthDivisor'] = xMovement;
        				}
        				xMovement = 0;
        			}
        		}
        	}
        	
        	//if every element of startSortedArr > endSortedArr
        	if(cnt === startLen){
        		for(var i = 0; i< startSortedArr.length; i++){
        			startSortedArr[i]['widthDivisor'] = xMovement;
        			startSortedArr[i]['leftCalc'] = i;
				}
        	}
        	
        	//if some last element of startSortedArr > endSortedArr
        	else if(cnt === xMovement && i === startLen){
        		for(var k = (i - xMovement); k < i; k++){
        			startSortedArr[k]['widthDivisor'] = xMovement;
				}
        	}
        },
        
      //sort object array by key named start
        _sortByStart: function(dataArr){
        	dataArr.sort(function(a, b) {
        	    return a.start - b.start;
        	});
        },
        
        //sort object array by key named end
        _sortByEnd: function(dataArr){
        	dataArr.sort(function(a, b) {
        	    return a.end - b.end;
        	});
        }
    }
    
    //public
    api = {
        getMeetingPosition: function(){
            return fn._getMeetingPosition.apply(this, arguments);
        },
        
        drawMeetingCalendar: function(){
        	return fn._drawMeetingCalendar.apply(this, arguments);
        }
    }
    
    return api;
    
})();