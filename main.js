var date;
$(document).ready(function() {
    $('#fullpage').fullpage({
    	anchors:['firstPage', 'secondPage', 'thirdPage', 'fourthPage'],
    	afterLoad: function (anchorLink, index) {
    		date = getDate();
    		$('.time').text(date);
    		if (index==2) {
    			$('[data-id="1"]').slideDown();
    			$('[data-id="2"]').delay(3000).slideDown();
    		}
    	}
    });
});
function getDate() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;

	var h = today.getHours();
    var m = today.getMinutes();

	var yyyy = today.getFullYear();
	if(dd<10){
	    dd='0'+dd
	} 
	if(mm<10){
	    mm='0'+mm
	} 
	return dd+"-"+mm+"-"+yyyy+" "+h+":"+m;
}
