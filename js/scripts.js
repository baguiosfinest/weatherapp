if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  error('not supported');
}

function success(position){
  //var latlng = position.coords.latitude + ", " + position.coords.longitude;
  //console.log(latlng);
  var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  var mapOptions = {
    zoom: 14,
    center: latlng,
    mapTypeControl: false,
    navigationControlOptions: {
      style: google.maps.NavigationControlStyle.SMALL,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
  }

  var map = new google.maps.Map(document.getElementById("map"), mapOptions);

  var infowindow = new google.maps.InfoWindow({
    content: "You are here! (at least within a "+position.coords.accuracy+" meter radius)"
  });

  var marker = new google.maps.Marker({
    position: latlng,
    map: map,
    title: "You are here!"
  });

  infowindow.open(map, marker);
}


function error(msg){
  alert(msg);
}

$(document).ready(function(){

  $.get('https://ipinfo.io', getWeather , "jsonp");

  /*
  $.ajax({
    url: "https://api.darksky.net/forecast/932554771d5b5ce80cb36e6f82de4442/" + latlong;
  });*/

  function getWeather(response){
    var loc = "";
    //var loc = response.city + ", " + response.region + ", " + response.country;

    loc += (response.city) ? response.city + ", ": "";
    loc += (response.region) ? response.region + ", ": "";
    loc += response.country;

    var latlong = response.loc;
    $('.address').text(loc);

    console.log(response);

    $.ajax({
      dataType: "json",
      url: "https://api.darksky.net/forecast/932554771d5b5ce80cb36e6f82de4442/" + latlong,
      success: getWeatherDetails
    });
  }

  function getWeatherDetails(data){
    var timeMs = new Date(data.currently.time);
    var asof = timeMs.customFormat( "#hh#:#mm# #AMPM#" );
    var temp = data.currently.temperature;
    $(".asof span").text(asof);
    $(".temp .num").text(temp);

    $(".summary").text(data.currently.summary);

    $(".feels .fnum").text(data.currently.apparentTemperature);


    $(".cloud-icon i").addClass("ic-"+data.currently.icon);

    $("body").addClass("bg-"+data.currently.icon);

    var tempTemp, feelsTemp;

    $(".temp .deg").on("click", function(){
      if($(this).hasClass("far")){
        $(".temp .num").text(degFarCel(temp));
        $(".feels .fnum").text(degFarCel(data.currently.apparentTemperature));
        $(this).removeClass("far");
        $(this).addClass("cel");
        $(this).text("C");
        $(".feels .deg").text("C");
        tempTemp = degFarCel(temp);
        feelsTemp = degFarCel(data.currently.apparentTemperature);
      }else{
        $(".temp .num").text(degCelFar(tempTemp));
        $(".feels .fnum").text(degCelFar(feelsTemp));
        $(this).addClass("far");
        $(this).text("F");
        $(".feels .deg").text("F");
        $(this).removeClass("cel");
      }
    });




  }


  function degFarCel(far){
    return ((far - 32) / 1.8).toFixed(2);
  }

  function degCelFar(cel){
    return ((cel * 1.8) + 32).toFixed(2);
  }

});


//*** This code is copyright 2002-2016 by Gavin Kistner, !@phrogz.net
//*** It is covered under the license viewable at http://phrogz.net/JS/_ReuseLicense.txt
Date.prototype.customFormat = function(formatString){
  var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
  YY = ((YYYY=this.getFullYear())+"").slice(-2);
  MM = (M=this.getMonth()+1)<10?('0'+M):M;
  MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
  DD = (D=this.getDate())<10?('0'+D):D;
  DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);
  th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
  formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
  h=(hhh=this.getHours());
  if (h==0) h=24;
  if (h>12) h-=12;
  hh = h<10?('0'+h):h;
  hhhh = hhh<10?('0'+hhh):hhh;
  AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
  mm=(m=this.getMinutes())<10?('0'+m):m;
  ss=(s=this.getSeconds())<10?('0'+s):s;
  return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
};
