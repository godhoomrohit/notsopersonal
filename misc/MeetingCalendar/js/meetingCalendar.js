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
    	pixel: 2,
    	timeStart: 9
    }
    
    //private
    fn = {
    	
    	//returns css properties to be used by any function
    	//input onject array is modified to add additional property
    	_getMeetingPosition: function(dataArr){
            if(dataArr && dataArr.length){
				var i = 0;
				var startSortedArr = '', endSortedArr = '';
	        	
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
				
				for(i; i< startSortedArr.length; i++){
					startSortedArr[i]['top'] = startSortedArr[i]['start'] * constants['pixel'];
					startSortedArr[i]['height'] = (startSortedArr[i]['end'] - startSortedArr[i]['start'])  * constants['pixel'];
					startSortedArr[i]['left'] = (startSortedArr[i]['leftCalc'] * constants['width']) / startSortedArr[i]['widthDivisor'];
					startSortedArr[i]['width'] = constants['width'] / startSortedArr[i]['widthDivisor'];
				}
	        	
	        	return startSortedArr;
            } 
            return [];
        },
        
        //generates random hexcode
        _getRandomHexCode: function(){
        	var code = Math.floor(Math.random()*16777216).toString(16);
        	if(code.length < 6){
        		while(code.length < 6){
        			code = 0 + code;
        		}
        	}
        	return code;
        },
        
        //returns html string which can be used by any client to draw dom on browser
        _drawMeetingCalendar: function(startSortedArr){
        	if(startSortedArr && startSortedArr.length){
				var i = 0, finalHtml = '';
				
				//creating html
            	for(i; i< startSortedArr.length; i++){
            		//final width = width/widthDivisor
            		//final left = (leftCalc * width)/widthDivisor
            		finalHtml += '<div class="row" style="top:'+ startSortedArr[i]['top'] +'px; height:'+ startSortedArr[i]['height'] +'px; width: '+ startSortedArr[i]['width'] +'px; background: #'+ fn._getRandomHexCode() +'; left: '+ startSortedArr[i]['left'] +'px"><div class="text">'+ startSortedArr[i]['id'] +'</div></div>';
				}
            	
            	//returns final html string
            	return finalHtml;
            } 
        },
        
        //method to find overlapping range
        //the logic for finding range:width
        // 1. keep two sorted object array based on start and end
        // 2. start comparing element of startSortedArr with endSortedArr
        // 3. keep increasing startSortedArrPointer if startSortedArr element is less than endSortedArr else increase endSortedArrPointer
        // 4. if startSortedArrPointer == endSortedArrPointer, means no more overlapping
        // i.e. id there are 4 overlapping time range, widthDivisor should be 4
        _findOverlappingRange: function(startSortedArr, endSortedArr){
        	var startLen = startSortedArr.length, endLen = endSortedArr.length, i = 0, j = 0;
        	var startSortedArrPointer = 0, endSortedArrPointer = 0;
        	
        	while(i < startLen && j < endLen){
        		if(startSortedArr[i]['start'] < endSortedArr[j]['end']){
        			startSortedArr[i]['leftCalc'] = startSortedArrPointer;
        			startSortedArrPointer++;
        			i++;
        		}
        		else{
        			j++
        			endSortedArrPointer++;
        			if(startSortedArrPointer === endSortedArrPointer){
        				for(var k = (i - startSortedArrPointer); k < i; k++){
                			startSortedArr[k]['widthDivisor'] = startSortedArrPointer;
        				}
        				startSortedArrPointer = 0;
        				endSortedArrPointer = 0;
        			}
        		}
        	}
        	
        	//if every element of startSortedArr > endSortedArr
        	if(startSortedArrPointer === startLen){
        		for(var i = 0; i< startSortedArr.length; i++){
        			startSortedArr[i]['widthDivisor'] = startSortedArrPointer;
        			startSortedArr[i]['leftCalc'] = i;
				}
        	}
        	
        	//if some last element of startSortedArr > endSortedArr
        	else if(i === startLen){
        		for(var k = (i - (startSortedArrPointer)); k < i; k++){
        			startSortedArr[k]['widthDivisor'] = startSortedArrPointer;
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