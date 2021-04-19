/*import 'ol/ol.css';
import Draw from 'ol/interaction/Draw';
import Map from 'ol/Map';
import View from 'ol/View';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';*/

var raster = new ol.layer.Tile({
  source: new ol.source.OSM(),
});

var source = new ol.source.Vector({wrapX: false});

var vector = new ol.layer.Vector({
  source: source,
});

var map = new ol.Map({
  layers: [raster, vector],
  target: 'map',
  view: new ol.View({
    center: [-11000000, 4600000],
    zoom: 4,
  }),
});

//var typeSelect = document.getElementById('type');
function drawFarm() {

  console.log('Hello');

  var formatArea = function(polygon) {
      var area = ol.Sphere.getArea(polygon);
      var output;
      output = (Math.round(area / 1000000 * 100) / 100);
      console.log("In function = " + output);
      return output;
  };
  var draw; 
  function addInteraction() {
    var value = 'Polygon';
    if (value !== 'None') {
      draw = new ol.interaction.Draw({
        source: source,
        type: value,
      });
      map.addInteraction(draw);
    }
    map.addInteraction(draw);
    draw.on('drawstart', function(evt) {
      sketch = evt.feature;
      console.log("sketch:" + sketch);
      console.log("here ");

      listener = sketch.getGeometry().on('change', function(evt) {
          //console.log("in listener")
          var geom = evt.target;
          var output;
          if (geom instanceof ol.geom.Polygon) {
              output = formatArea(geom);
              /*console.log("output: "+output);*/
              farm_area = parseFloat(output);
              console.log(farm_area)
          } else {
              console.log("outside");
          }
      })

  });
  draw.on('drawend', function(event) {
    var intersect;
    var feature = event.feature;
    if (sketch.getGeometry().getType() == "Polygon") {
        console.log("Hi, from inside");
        poly = feature.getGeometry().getCoordinates();
        console.log("poly: " + poly);
        var kinkedPoly = turf.polygon(poly);
        var unkinkedPoly = turf.unkinkPolygon(kinkedPoly);
        if (unkinkedPoly.features.length > 1) {
            console.log("In intersection");
            intersect = true;
            /*sweetAlert({
              icon: 'error',
              title: 'Oops...',
              text: 'The farm you have drawn in having intersection(s).'
            })*/
        }

    }
    if (!intersect) {
        console.log("intersect: " + intersect);
        if (farm_area > 8.093713) {
            var message = "Farm size exceeded!\n" + "Your Farm Size: " + farm_area;
            sweetAlert({
                icon: 'error',
                title: 'Oops!',
                text: message,
                footer: 'Your Farm Size: ' + farm_area
            });
            source.clear();
        } else {

            (async() => {

                const { value: formValues } = await Swal.fire({
                    title: 'Enter your farm name',
                    html: '<input id="drawFarmName" class="swal2-input">' + '<h3>Crop Type</h3><input id="CropType" class="swal2-input" placeholder="Crop Type">' +
                        ' <br> <label class="chk">Rice<input type="checkbox" value="Rice" name="check" checked="checked"><span class="checkmark"></span></label><label class="chk">Soil Moisture<input type="checkbox" value="Soil Moisture" name="check"><span class="checkmark"></span></label><br><label class="chk">Weather Forecast<input type="checkbox" value="Weather Forecast" name="check"><span class="checkmark"></span></label><br><label class="chk">Precipitation<input type="checkbox" value="Precipitation" name="check"><span class="checkmark"></span></label><br><label class="chk">Soil Temperature<input type="checkbox" value="Soil Temperature" name="check"><span class="checkmark"></span></label>',
                    focusConfirm: false,
                    allowOutsideClick: false,
                    showCancelButton: true,

                    preConfirm: () => {
                        return [
                            document.getElementById('drawFarmName').value,

                        ]
                    }
                })


            })()
            .then((value) => {

                var i = 0;
                $.each($("input[name='check']:checked"), function() {
                    productList[i] = ($(this).val());
                    i++;
                });
                product = productList.toString();
                farm_name = document.getElementById('drawFarmName').value,
                    console.log('satyukt_Format=' + product);

                console.log('satyukt_Format=' + satyukt_format);
                var jsonobj = JSON.parse(satyukt_format);
                //console.log(jsonobj); 
                jsonobj.name = farm_name;
                satyukt_format = JSON.stringify(jsonobj);
                console.log(satyukt_format); // do all your logic here 
                console.log(farm_name);




                insertValues();
                console.log("coord1234: " + poly);
                // do all your logic here
                console.log("in swal " + farm_name);

                console.log("in swal " + productList);
            });
        }
    } else {
        console.log("intersect: " + intersect);
        sweetAlert({
            icon: 'error',
            title: 'Oops!',
            text: 'Please draw a valid farm.'
        });
        intersect = false;
    }
});
  }
  addInteraction();
}

drawFarm();