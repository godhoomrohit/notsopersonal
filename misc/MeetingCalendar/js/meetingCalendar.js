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
    	left: 0
    }
    
    //private
    fn = {
        _getMeetingPosition: function(dataArr){
            if(dataArr && dataArr.length){
				var i = 0;
            	for(i; i< dataArr.length; i++){
					fn._calculateCssProps(dataArr[i]);
				}
            }   
        },
        
        _calculateCssProps: function(obj){
        	obj['top'] = obj['start'] * 2;
        	obj['height'] = (obj['end'] - obj['start'])  * 2;
        	obj['left'] = constants['left'];
        	obj['width'] = constants['width'];
        },
        
        _drawMeetingCalendar: function(dataArr){
        	if(dataArr && dataArr.length){
				var i = 0, finalHtml = '', startSortedArr = '', endSortedArr = '';
				
				var tempArr = JSON.stringify(dataArr);
				startSortedArr = JSON.parse(tempArr);
				endSortedArr = JSON.parse(tempArr);
				
				fn._sortByStart(startSortedArr);
				fn._sortByEnd(endSortedArr);
				
				fn._findOverlappingRange(startSortedArr, endSortedArr);
				
            	for(i; i< startSortedArr.length; i++){
            		finalHtml += '<div class="row" style="top:'+ startSortedArr[i]['top'] +'px; height:'+ startSortedArr[i]['height'] +'px; width: '+ startSortedArr[i]['width']/startSortedArr[i]['widthDivisor'] +'px; background: #'+ Math.floor(Math.random()*16777215).toString(16) +'; left: '+ ((startSortedArr[i]['leftCalc']*600)/startSortedArr[i]['widthDivisor']) +'px">'+ startSortedArr[i]['id'] +'</div>';
				}
            	return finalHtml;
            } 
        },
        
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
        	
        	if(cnt === startLen){
        		for(var i = 0; i< startSortedArr.length; i++){
        			startSortedArr[i]['widthDivisor'] = xMovement;
        			startSortedArr[i]['leftCalc'] = i;
				}
        	}
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