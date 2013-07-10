$(document).ready(function(){
	getLocation();
});
function getLocation()
{
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(showWeather);
	}
	else
	{
		x.innerHTML="Geolocation is not supported by this browser.";
	}
}
function showWeather(position)
{
	$.when(	$.ajax({
		url : "http://api.wunderground.com/api/a9883f9b587f08b8/hourly/q/"+position.coords.latitude+","+position.coords.longitude+".json",
		dataType : "jsonp"}),
			$.ajax({
		url : "http://api.wunderground.com/api/a9883f9b587f08b8/geolookup/q/"+position.coords.latitude+","+position.coords.longitude+".json",
		dataType : "jsonp"})).then(function (resp1, resp2) {
	    //this callback will be fired once all ajax calls have finished.
		// 현재기온
//		alert(JSON.stringify(resp1[0]['hourly_forecast']));
			$("#primaryContent").html("");
			
			var i=0;
			var foreCasts = resp1[0]['hourly_forecast'];
			var geoLookup = resp2[0]['location'];

			var dateOld='0';

			var textToInsert = [];
			for (var j in foreCasts) {		
				if(dateOld != foreCasts[j].FCTTIME.mday) 
				{		
					textToInsert[i++] = '<div style=\'width:100%;font-size:30px;text-align:left;background:rgba(30,30,30,.7);\'>'+foreCasts[j].FCTTIME.mon +'월 '+foreCasts[j].FCTTIME.mday+'일'+'</div>';
					dateOld = foreCasts[j].FCTTIME.mday;
				}
				textToInsert[i++] = '<div style=\'width:100px;display:inline-block;';
				if(j%2==0){
					textToInsert[i++] = 'background-color:rgba(11,11,11,.4);';
				} else {
					textToInsert[i++] = 'background-color:rgba(44,44,44,.4);';			
				}
				textToInsert[i++] = '\'>'
				textToInsert[i++] = '<div style=\'text-align:center;padding:0;\'><img  src=\''+foreCasts[j].icon_url +'\' /></div>';
				textToInsert[i++] = '<p style=\'font-size:30px;text-align:center;\'>'+foreCasts[j].temp.metric +'°C</p>';

				textToInsert[i++] = '<p style=\'text-align:center;\'><span style=\'font-size:20px;\'>'+foreCasts[j].FCTTIME.civil+'</span></p>';
				textToInsert[i++] = '</div>';


			}

			textToInsert[i++] = '<div style=\'position:fixed;width:100%;font-size:23px;bottom:0;background:rgba(20,20,20,.7);text-align:center;\'><p>'+geoLookup.city +', '+geoLookup.country_name +'<input type=\'button\' value=\'옵션\' /></p></div>';
			textToInsert[i++] = '';
			textToInsert = textToInsert.join('');
			
			// 가져다 붙이기
			$('#primaryContent').html('<p>'+textToInsert+'</p>');

	});
}
	
