$(document).ready(function() {

    //get all settings
    var request = $.ajax({
            url: "http://localhost:3500/api/settings/",
            method: "GET",
            dataType: "json",
        }).done(function( settings ) {
            $('title').text(settings.site_name);
            $('body').css({backgroundColor:settings.site_color});
            if( settings.site_use_theme !== 'on'){
                map.areasSettings.color = settings.site_area_color;

                map.areasSettings.outlineColor = settings.site_outlineColor;
                map.areasSettings.rollOverColor = settings.site_rollOverColor;
                map.areasSettings.selectedColor = settings.site_selectedColor;
                map.areasSettings.selectedOutlineColor = settings.site_selectedOutlineColor;
            }
            map.imagesSettings.labelColor = settings.site_circle_label;
            map.imagesSettings.labelRollOverColor = settings.site_circle_label;
            map.imagesSettings.color = settings.site_circle_color;
        }).fail(function( jqXHR, textStatus ) {
            console.log("Request failed: " + textStatus);
        });



    $('a.close').on('click', function(){
        map.clickMapObject(map.getObjectById(map.selectedArea));
        return false;
    });



    function alertSize() {
      var myWidth = 0, myHeight = 0;
      if( typeof( window.innerWidth ) == 'number' ) {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
      } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
      } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
      }
      document.getElementById('chartwrapper').style.height = myHeight + 'px';
    }
    alertSize();
});










// create circle for each country

//
// http://www.distancelatlong.com/country/netherlands
var mapData = [
    {
        type: "circle",
        provence_id: "NL-DR",
        longitude: 6.55,
        latitude: 53,
        title: "22 Persons in Drenthe",
        scale: 3.0,
        label: "5",
        labelShiftY: -2
    },
    {
        type: "circle",
        provence_id: "NL-FR",
        longitude: 5.783,
        latitude: 53.25,
        title: "22 Persons in Friesland",
        scale: 3.0,
        label: "16",
        labelShiftY: -2
    },
    {
        type: "circle",
        provence_id: "NL-GE",
        longitude: 5.922,
        latitude: 51.987,
        title: "22 Persons in Gelderland",
        scale: 3.0,
        label: "22",
        labelShiftY: -2
    },
    {
        type: "circle",
        provence_id: "NL-GR",
        longitude: 6.58,
        latitude: 53.22,
        title: "22 Persons in Groningen",
        scale: 3.0,
        label: "19",
        labelShiftY: -2
    },
    {
        type: "circle",
        provence_id: "NL-OV",
        longitude: 6.0969,
        latitude: 52.524,
        title: "22 Persons in Overijssel",
        scale: 3.0,
        label: "12",
        labelShiftY: -2
    },
    {
        type: "circle",
        provence_id: "NL-NH",
        longitude: 4.6299,
        latitude: 52.38,
        scale: 3.0,
        title: "22 Persons in Noord-Holland",
        label: "1",
        labelShiftY: -2
    },
    {
        type: "circle",
        provence_id: "NL-UT",
        longitude: 5.12003,
        latitude: 52.1003,
        scale: 3.0,
        title: "22 Persons in Utrecht",
        label: "10",
        labelShiftY: -2
    },
    {
        type: "circle",
        provence_id: "NL-LI",
        longitude: 5.677,
        latitude: 50.8529,
        scale: 3.0,
        title: "22 Persons in Limburg",
        label: "28",
        labelShiftY: -2
    },
    {
        type: "circle",
        provence_id: "NL-NB",
        longitude: 5.3166,
        latitude: 51.6833,
        scale: 3.0,
        title: "22 Persons in Noord-Brabant",
        label: "42",
        labelShiftY: -2
    },
    {
        type: "circle",
        provence_id: "NL-ZE",
        longitude: 3.6099,
        latitude: 51.5019,
        scale: 3.0,
        title: "22 Persons in Zeeland",
        label: "32",
        labelShiftY: -2
    },
    {
        type: "circle",
        provence_id: "NL-FL",
        longitude: 5.505,
        latitude: 52.424,
        scale: 3.0,
        title: "22 Persons in Flevoland",
        label: "25",
        labelShiftY: -2
    },
    {
        type: "circle",
        provence_id: "NL-ZH",
        longitude: 4.4799,
        latitude:  51.9199,
        scale: 3.0,
        title: "22 Persons in Zuid-Holland",
        label: "50",
        labelShiftY: -2
    }
];

// get min and max values
var minBulletSize = 13;
var maxBulletSize = 60;
var min = Infinity;
var max = -Infinity;
for ( var i = 0; i < mapData.length; i++ ) {
  var value = parseInt(mapData[ i ].label);
  if ( value < min ) {
    min = value;
  }
  if ( value > max ) {
    max = value;
  }
}

// it's better to use circle square to show difference between values, not a radius
var maxSquare = maxBulletSize * maxBulletSize * 2 * Math.PI;
var minSquare = minBulletSize * minBulletSize * 2 * Math.PI;

// create circle for each country
var images = [];
for ( var i = 0; i < mapData.length; i++ ) {
  var dataItem = mapData[ i ];
  var value = parseInt(dataItem.label);
  // calculate size of a bubble
  var square = ( value - min ) / ( max - min ) * ( maxSquare - minSquare ) + minSquare;
  if ( square < minSquare ) {
    square = minSquare;
  }
  var size = Math.sqrt( square / ( Math.PI * 2 ) );
dataItem.width = dataItem.height = size;
dataItem.scale = 1;
  images.push(dataItem);
}


var map = AmCharts.makeChart( "chartdiv", {
    type: "map",
    theme: 'light',
    colorSteps: 10,

    dataProvider: {
        map: "netherlandsLow",
        getAreasFromMap: true,
        zoomLevel: 1,
        images: images
    },

    imagesSettings: {
        selectable: true,
        labelPosition: 'middle',
        rollOverScale: 1.5,
        selectedScale: 1.5
    },

    zoomControl: {
        zoomControlEnabled: false,
        homeButtonEnabled: false
    },

    areasSettings: {
        autoZoom: true
    },

    listeners: [{
            event: "rendered",
            method: function(e) {
                var map = e.chart;
                map.initialZoomLevel = map.zoomLevel();
                map.initialZoomLatitude = map.zoomLatitude();
                map.initialZoomLongitude = map.zoomLongitude();
            }
        },
        {
            event: "clickMapObject",
            method: function( event ) {
                provence_id = event.mapObject.type === 'circle' ? event.mapObject.provence_id : event.mapObject.id;
                if( map.selectedArea === provence_id ){

                    if ( event.mapObject.type === 'circle' ){
                        // map.selectObject(map.getObjectById(provence_id));
                        // $('#briefUserInfo').toggleClass('active');
                        // $('#briefUserList').toggleClass('active');
                    } else {
                        map.selectedArea = null;
                        map.selectObject();
                        map.zoomToLongLat(map.initialZoomLevel, map.initialZoomLongitude, map.initialZoomLatitude);
                        $('#provence').selectpicker( 'val', '');
                    }
                } else {
                    map.selectedArea = provence_id;
                    $('#provence').selectpicker( 'val', provence_id);
                    map.selectObject(map.getObjectById(provence_id));
                }
            }
        },
        {
            event: "selectedObjectChanged",
            method: function( event ) {
                $('#briefUserList').removeClass('active');
                $('#briefUserInfo').removeClass('active');
            }
        },
        {
            event: "zoomCompleted",
            method: function( event ) {
                if( map.selectedArea !== null ){
                    $('#briefUserInfo').addClass('active');
                    $('#briefUserList').addClass('active');
                }
            }
        }
    ],
    selectedArea: null
});


function selectArea(select) {
    var id = select.options[select.selectedIndex].value;
    if ( '' == id ) {
        map.clickMapObject(map.getObjectById(map.selectedArea));
    } else {
        map.clickMapObject(map.getObjectById(id));
    }
};