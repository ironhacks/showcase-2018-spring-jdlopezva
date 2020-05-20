const API_KEY = "AIzaSyCKLOC2nNGCag9x82Xj206A5h5VhxVTCXA";

//MAPA
var map;
var coordenadasNYU={lat:40.7291, lng:-73.9965};
var marcadorNYU;

var feat = [];

var test = [];
initMap();
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: coordenadasNYU
  });

  marcadorNYU = new google.maps.Marker({
    position: coordenadasNYU,
    map:map,
    title: 'NYU',
    icon: "https://www.shareicon.net/data/48x48/2015/09/21/644210_university_512x512.png"
  });

  map.data.loadGeoJson(
    'http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson'
  );

  var n = 0;
  map.data.setStyle(function(feature) {
    if (feature.getProperty('BoroCD')%100 < 19) {
      feat[n++] = feature;
      //var color = getRandomColor();
      return {
        //fillColor: color,
        fillOpacity:0,
        strokeColor:strokeDis(parseInt(feature.getProperty('BoroCD')/100)),
        strokeWeight: 2
      };
    } else {
      return {
        fillOpacity:0,
        strokeWeight: 0
      };
    }
  });
  map.data.addListener('mouseover', function(event) {
    map.data.revertStyle();
    map.data.overrideStyle(event.feature,fDis(event.feature));
  });

}

function fDis(a) {
  if (a.getProperty('BoroCD')%100 < 19) {
    return {fillColor:strokeDis(parseInt(a.getProperty('BoroCD')/100)),fillOpacity:0.3};
  } else {
    return {fillOpacity:0};
  }
}

var markers=[];

function setMarksNei() {
  var marcador;
  for (var i = 0; i < neiPoints.length; i++) {
    marcador = new google.maps.Marker({
      position: neiPoints[i],
      map:map,
      title: infoRows[i][0]
    })
    markers.push(marcador);
  };
  markerCluster = new MarkerClusterer(map, markers,
    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    markerCluster.clearMarkers();
  }

  var markerCluster;

  function marksNei() {
    var check = document.getElementById("chNei");
    if (check.checked) {
      markerCluster.addMarkers(markers);
      setMapOnAll(polisNei,map);
    } else {
      markerCluster.clearMarkers();
      setMapOnAll(polisNei,null);
    }
  }


  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function strokeDis(n) {
    switch (n) {
      case 1:
      return "blue";
      break;
      case 2:
      return "violet";
      break;
      case 3:
      return "red";
      break;
      case 4:
      return "green";
      break;
      case 5:
      return "purple";
      break;
      default:
      return "black";
    }
  }

  //TABLA Y EXPOTAR DATOS
  const NEISHAPES = "https://data.cityofnewyork.us/api/views/q2z5-ai38/rows.json?accessType=DOWNLOAD";
  var p = true;
  var polisNei=[];
  function geoNei() {
    if (p) {
      var data = $.get(NEISHAPES, function() {})

      .done(function() {
        var dataR = data.responseJSON.data;
        for (var i = 0; i < dataR.length; i++) {
          var bounds =[];
          for (var j = 0; j < dataR[i][9].split("(")[3].split(")")[0].split(" ").length; j=j+2) {
            var bound = new google.maps.LatLng(parseFloat(dataR[i][9].split("(")[3].split(")")[0].split(" ")[j+1]), parseFloat(dataR[i][9].split("(")[3].split(")")[0].split(" ")[j]));
            bounds.push(bound);
          }
          var pol= new google.maps.Polygon({
            paths:bounds,
            strokeOpacity: 0.5,
            strokeWeight: 1,
            fillOpacity:0
          });
          polisNei.push(pol);
        }
        p=false;
      })

      .fail(function error(){
        console.log(error);
      })
    }
  }

  const HOUSURL = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
  var infoHous=[];
  var housPoints = [];
  var brDis = [];
  var f =true;

  function getHous() {
    if (f) {
      var data = $.get(HOUSURL, function() {})

      .done(function() {
        var dataR = data.responseJSON.data;
        var dis;

        for (var i = 0; i < dataR.length; i++) {
          dis = dataR[i][19].split("-")[1];

          if(dataR[i][23] != null){
            housPoints.push({lat: parseFloat(dataR[i][23]),lng:parseFloat(dataR[i][24])});
          }

          var ind=brDis.indexOf(dataR[i][19]);

          if(ind != -1){
            infoHous[ind][2] = Math.max(infoHous[ind][2], parseInt(dataR[i][33]));
          }else{
            brDis.push(dataR[i][19]);
            infoHous.push([dataR[i][15],dis%100,parseInt(dataR[i][33])]);
          }
        }
        infoHous = infoHous.sort(compare);
        infoHous.splice(45,1);
        markHous();
        f =false;
      })

      .fail(function error(){
        console.log(error);
      })
    }
  }

  var marksHous=[];
  function markHous() {
    for (var i = 0; i < housPoints.length; i++) {
      var marcador = new google.maps.Marker({
        position: housPoints[i],
        map:map,
        icon:"https://www.shareicon.net/data/128x128/2015/11/28/187039_apartment_32x37.png"
      })
      marksHous.push(marcador);
    }
    markerClusterHous = new MarkerClusterer(map, marksHous,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
      markerClusterHous.clearMarkers();
    }
    var markerClusterHous;

    function marksBui() {
      getHous();
      var check = document.getElementById("chBui");
      if (check.checked) {
        markerClusterHous.addMarkers(marksHous);
      } else {
        markerClusterHous.clearMarkers();
      }
    }

    const BARRIOS_URL = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
    var infoRows = [];
    var neiPoints = [];
    var neiLat, neiLng;

    function getNei(){
      var data = $.get(BARRIOS_URL, function() {})
      .done(function(){
        //console.log(data.responseJSON.data);
        var dataR = data.responseJSON.data;
        for (var i = 0; i < dataR.length; i++) {
          infoRows.push([dataR[i][10], dataR[i][16]]);
          neiLng= parseFloat(dataR[i][9].split(" ")[1].split("(")[1]);
          neiLat= parseFloat(dataR[i][9].split(" ")[2].split(")")[0]);
          neiPoints.push({lat:neiLat, lng:neiLng});
        }
        setMarksNei();
      })

      .fail(function error(){
        console.log(error);
      })
    }

    var infoDis = [];
    var ft = true;
    var md =[];
    var bcdCenter=[];
    function centrosDis() {
      if (ft) {
        for (var i = 0; i < feat.length; i++) {
          if (feat[i].f.BoroCD%100 < 19) {
            var bounds = new google.maps.LatLngBounds();
            if(feat[i].b.b.length == 1){
              for (k = 0; k < feat[i].b.b[0].b.length; k++) {
                bounds.extend(feat[i].b.b[0].b[k]);
              }
            }else {
              for (var j = 0; j < feat[i].b.b.length; j++) {
                /*for (k = 0; k < feat[i].b.b[j].b.length; k++) {
                  bounds.extend(feat[i].b.b[j].b[k]);
                }*/
                for (k = 0; k < feat[i].b.b[j].b[0].b.length; k++) {
                  bounds.extend(feat[i].b.b[j].b[0].b[k]);
                }
              }
            }
            bcdCenter.push([feat[i].f.BoroCD,bounds.getCenter()]);
            var marcador = new google.maps.Marker({
              position: bounds.getCenter(),
              label:(feat[i].f.BoroCD%100).toString(),
              map:map,
            })
            /*marcador.addListener('mouseover',function() {
              polys[parseInt(feat[i].f.BoroCD/100)-1][];
            });*/
            md.push(marcador);
            var distancia = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(40.7291, -73.9965),bounds.getCenter());
            infoDis.push([boroName(parseInt(feat[i].f.BoroCD/100)),feat[i].f.BoroCD%100,distancia]);
          }
        }
        ft = false;
        marksDis();
        titleDisMar();
      }
      infoDis = infoDis.sort(compare).reverse();
    }

    function numero(bcd) {
      switch (parseInt(bcd/100)) {
        case 1:
        return 29+(bcd%100);
        break;
        case 2:
        return 17+(bcd%100);
        break;
        case 3:
        return -1+(bcd%100);
        break;
        case 4:
        return 41+(bcd%100);
        break;
        case 5:
        return 55+(bcd%100);
        break;
        default:
        console.error("error");
        return 0;
      }
    }

    function titleDisMar() {
      bestDis();
      setTimeout(function() {
        for (var i = 0; i < md.length; i++) {
          var ind =numero(bcdCenter[i][0]);
          md[i].setTitle(infoRank[ind][0]+" "+infoRank[ind][1] +"\nN° Crimes: "+ crimDis[infoRank[ind][2]-1][2] +"\nCrime Rank: " +infoRank[ind][2]+"\nAffordable Rank: " +infoRank[ind][3]+"\nDistance Rank: " +infoRank[ind][4]);
        }
      },200);
    }

    function setMapOnAll(arr,map) {
      for (var i = 0; i < arr.length; i++) {
        arr[i].setMap(map);
      }
    }

    function marksDis() {
      centrosDis();
      var check = document.getElementById("chDis");
      if (check.checked) {
        setMapOnAll(md,map);
      } else {
        setMapOnAll(md,null);
      }
    }

    var polys=[[],[],[],[],[]];
    var ft2=true;
    function poligonos() {
      if (ft2) {
        $(".loader").show();
        for (var i = 0; i < feat.length; i++) {
          if (feat[i].f.BoroCD%100 < 19) {
            var bounds = [];
            if(feat[i].b.b.length == 1){
              for (k = 0; k < feat[i].b.b[0].b.length; k++) {
                bounds.push(feat[i].b.b[0].b[k]);
              }

              var pol= new google.maps.Polygon({
                paths:bounds
              });
              var b = parseInt(feat[i].f.BoroCD/100);
              polys[b-1].push([feat[i].f.BoroCD,pol]);

            }else {
              for (var j = 0; j < feat[i].b.b.length; j++) {
                /*for (k = 0; k < feat[i].b.b[j].b.length; k++) {
                  bounds.push(feat[i].b.b[j].b[k]);
                }*/
                for (k = 0; k < feat[i].b.b[j].b[0].b.length; k++) {
                  bounds.push(feat[i].b.b[j].b[0].b[k]);
                }
                var pol= new google.maps.Polygon({
                  paths:bounds
                });
                var b = parseInt(feat[i].f.BoroCD/100);
                polys[b-1].push([feat[i].f.BoroCD,pol]);
              }
            }
          }
        }
        ft2 = false;
      }
    }

    function boroName(num) {
      if(num==1){
        return "Manhattan";
      }else if (num==2) {
        return "Bronx";
      }else if (num==3) {
        return "Brooklyn";
      }else if (num==4) {
        return "Queens";
      }else if (num==5) {
        return "Staten Island";
      }
    }

    const MUSURL ="https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json?accessType=DOWNLOAD";
    var pv1 = true;
    var markersMus = [];
    var bcd2 = [];
    var infoMus = [];
    var markerClusterMus;
    function getMus() {
      poligonos();
      if (pv1) {
        $(".loader").show();
        var data = $.get(MUSURL, function() {})
        .done(function(){
          var dataR = data.responseJSON.data;
          for (var i = 0; i < dataR.length; i++) {
            var coor = new google.maps.LatLng(parseFloat(dataR[i][8].split(" ")[2].split(")")[0]),parseFloat(dataR[i][8].split("(")[1].split(" ")[0]));
            for (var j = 0; j < polys.length; j++) {
              for (var k = 0; k < polys[j].length; k++) {

                if (google.maps.geometry.poly.containsLocation(coor,polys[j][k][1])) {
                  var ind = bcd2.indexOf(polys[j][k][0]);
                  if (ind != -1) {
                    infoMus[ind][2]++;
                  } else {
                    infoMus.push([boroName(j+1),polys[j][k][0]%100,1]);
                    bcd2.push(polys[j][k][0]);
                  }
                }
              }
            }


            var marcador = new google.maps.Marker({
              position: coor,
              map:map,
              title: dataR[i][9],
              icon:"https://www.shareicon.net/data/128x128/2015/04/26/29232_historical_32x37.png"
            })
            markersMus.push(marcador);
          }
          markerClusterMus = new MarkerClusterer(map, markersMus,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
            markerClusterMus.clearMarkers();
            infoMus = infoMus.sort(compare);
            pv1=false;
          })

          .fail(function error(){
            console.log(error);
          })
          $(".loader").fadeOut();
        }
      }

      function marksMus() {
        getMus();
        var check = document.getElementById("chMus");
        setTimeout(function functionName() {
          if (check.checked) {
            markerClusterMus.addMarkers(markersMus);
          } else {
            markerClusterMus.clearMarkers();
          }
        },100);
      }

      const GALURL ="https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.json?accessType=DOWNLOAD";
      var pv5 = true;
      var markersGal = [];
      var bcd5 = [];
      var infoGal = [];
      var markerClusterGal;

      function getGal() {
        poligonos();
        if (pv5) {
          $(".loader").show();
          var data = $.get(GALURL, function() {})
          .done(function(){
            var dataR = data.responseJSON.data;
            for (var i = 0; i < dataR.length; i++) {
              var coor = new google.maps.LatLng(parseFloat(dataR[i][9].split(" ")[2].split(")")[0]),parseFloat(dataR[i][9].split("(")[1].split(" ")[0]));
              for (var j = 0; j < polys.length; j++) {
                for (var k = 0; k < polys[j].length; k++) {
                  if (google.maps.geometry.poly.containsLocation(coor,polys[j][k][1])) {
                    var ind = bcd5.indexOf(polys[j][k][0]);
                    if (ind != -1) {
                      infoGal[ind][2]++;
                    } else {
                      infoGal.push([boroName(j+1),polys[j][k][0]%100,1]);
                      bcd5.push(polys[j][k][0]);
                    }
                  }
                }
              }


              var marcador = new google.maps.Marker({
                position: coor,
                map:map,
                title: dataR[i][8],
                icon:"https://www.shareicon.net/data/128x128/2015/04/26/29238_museum_32x37.png"
              })
              markersGal.push(marcador);
            }
            markerClusterGal = new MarkerClusterer(map, markersGal,
              {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
              markerClusterGal.clearMarkers();
              infoGal = infoGal.sort(compare);
              pv5=false;
            })

            .fail(function error(){
              console.log(error);
            })
            $(".loader").fadeOut();
          }
        }

        function marksGal() {
          getGal();
          var check = document.getElementById("chGal");
          setTimeout(function functionName() {
            if (check.checked) {
              markerClusterGal.addMarkers(markersGal);
            } else {
              markerClusterGal.clearMarkers();
            }
          },100);
        }


        const AIRURL = "https://data.cityofnewyork.us/api/views/c3uy-2p5r/rows.json?accessType=DOWNLOAD"

        var pv3 = true;
        var infoAir = [];
        var bcd3 = [];
        var bcdAir = [];

        function getAir() {
          if (pv3) {
            $(".loader").show();
            var data = $.get(AIRURL, function() {})
            .done(function(){
              var dataR = data.responseJSON.data;
              for (var i = 0; i < dataR.length; i++) {
                if (dataR[i][13] > 100 && dataR[i][13]!=504 && dataR[i][12]!="CD") {
                  var ind = bcd3.indexOf(dataR[i][13]);
                  if (ind != -1) {
                    infoAir[ind][2] = infoAir[ind][2] + parseFloat(dataR[i][16]);
                    bcdAir[ind][1] = bcdAir[ind][1] + parseFloat(dataR[i][16]);
                  } else {
                    infoAir.push([boroName(parseInt(dataR[i][13]/100)),dataR[i][13]%100,parseFloat(dataR[i][16])]);
                    bcd3.push(dataR[i][13]);
                    bcdAir.push([parseInt(dataR[i][13]),parseFloat(dataR[i][16])]);
                  }
                }
              }
              infoAir = infoAir.sort(compare).reverse();
              bcdAir = bcdAir.sort(function(a,b) {
                return (a[0] >= b[0]) ? 1 : -1;
              });
              //console.log(dataR);
              pv3=false;
            })

            .fail(function error(){
              console.log(error);
            })
            if (!pv3) {
              $(".loader").fadeOut();
            }
          }
        }

        var noDrawn=true;
        function heatAir() {
          if (noDrawn) {
            getCri();
            setTimeout(function() {
              centrosDis();
              bcdCenter.sort(function(a,b) {
                return (a[0] >= b[0]) ? 1 : -1;
              });

              function getHeat () {
                var r = [];
                for (var i = 0; i < bcdAir.length; i++) {
                  var ind = bcd.indexOf(bcdAir[i][0]);
                  r.push({location: bcdCenter[ind][1], weight: bcdAir[i][1]});
                }
                return r;
              };

              var heat = getHeat();
              heatmap = new google.maps.visualization.HeatmapLayer({
                data: heat,
                radius: 70,
                opacity: 0.38
              });

            },100);
            noDrawn = false;
          }
        }

        var heatmap;

        function drawHeat() {
          heatAir();
          setTimeout(function () {
            var check = document.getElementById("chAir");
            if (check.checked) {
              heatmap.setMap(map)
            } else {
              heatmap.setMap(null)
            }
          },100);
        }

        const CRIURL = "https://data.cityofnewyork.us/api/views/xazf-tj86/rows.json?accessType=DOWNLOAD";
        var infoCri = [];
        var criPoints = [];
        var ft3 = true;
        var crimDis = [];
        var bcd = [];
        var markersCri = [];

        function getCri() {
          poligonos();
          if (ft3) {
            $(".loader").show();
            var data = $.get(CRIURL, function() {})
            .done(function(){
              var dataR = data.responseJSON.data;
              for (var i = 0; i < dataR.length; i++) {
                var coor = new google.maps.LatLng(parseFloat(dataR[i][29]),parseFloat(dataR[i][30]))
                infoCri.push([dataR[i][21],dataR[i][15],coor])
                var marcador = new google.maps.Marker({
                  position: infoCri[i][2],
                  map:map,
                  title: infoCri[i][1],
                  icon:"https://www.shareicon.net/data/128x128/2015/11/29/187626_police_32x37.png"
                })
                markersCri.push(marcador);
                var numero;
                if (infoCri[i][0].toUpperCase()=="BROOKLYN") {
                  numero = 2;
                  infoCri[i][0]="Brooklyn";
                } else if (infoCri[i][0].toUpperCase()=="MANHATTAN") {
                  numero = 0;
                  infoCri[i][0]="Manhattan";
                } else if (infoCri[i][0].toUpperCase()=="BRONX") {
                  numero = 1;
                  infoCri[i][0]="Bronx";
                } else if (infoCri[i][0].toUpperCase()=="QUEENS") {
                  numero = 3;
                  infoCri[i][0]="Queens";
                } else if (infoCri[i][0].toUpperCase()=="STATEN ISLAND") {
                  numero = 4;
                  infoCri[i][0]="Staten Island";
                }
                for (var j = 0; j < polys[numero].length; j++) {
                  if (google.maps.geometry.poly.containsLocation(infoCri[i][2], polys[numero][j][1])) {
                    var ind = bcd.indexOf(polys[numero][j][0]);
                    if (ind != -1) {
                      crimDis[ind][2]++;
                    } else {
                      crimDis.push([infoCri[i][0],polys[numero][j][0]%100,1]);
                      bcd.push(polys[numero][j][0]);
                    }

                    break;
                  }
                }
              }
              markerClusterCri = new MarkerClusterer(map, markersCri,
                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
                markerClusterCri.clearMarkers();
                crimDis = crimDis.sort(compare).reverse();
                bcd = bcd.sort();
                ft3 =false;
              })

              .fail(function error(){
                console.log(error);
              })
              $(".loader").fadeOut();
            }
          }

          var markerClusterCri;

          function marksCri() {
            getCri();
            var check = document.getElementById("chCir");
            setTimeout(function functionName() {
              if (check.checked) {
                markerClusterCri.addMarkers(markersCri);
              } else {
                markerClusterCri.clearMarkers();
              }
            },100);
          }

          var infoAv = [];
          var infoRank =[];
          var ftb = true;
          function bestDis() {
            if (ftb) {
              getCri();
              getHous();
              centrosDis();
              setTimeout(function() {
                for (var i = 0; i < 18; i++) {
                  infoAv.push(["Brooklyn", i+1, dataRanks(crimDis,"Brooklyn")[i].rank + dataRanks(infoHous,"Brooklyn")[i].rank + dataRanks(infoDis,"Brooklyn")[i].rank]);
                  infoRank.push(["Brooklyn", i+1, dataRanks(crimDis,"Brooklyn")[i].rank, dataRanks(infoHous,"Brooklyn")[i].rank, dataRanks(infoDis,"Brooklyn")[i].rank]);
                }
                for (var i = 0; i < 12; i++) {
                  infoAv.push(["Bronx", i+1, dataRanks(crimDis,"Bronx")[i].rank + dataRanks(infoHous,"Bronx")[i].rank + dataRanks(infoDis,"Bronx")[i].rank]);
                  infoRank.push(["Bronx", i+1, dataRanks(crimDis,"Bronx")[i].rank, dataRanks(infoHous,"Bronx")[i].rank, dataRanks(infoDis,"Bronx")[i].rank]);
                }
                for (var i = 0; i < 12; i++) {
                  infoAv.push(["Manhattan", i+1, dataRanks(crimDis,"Manhattan")[i].rank + dataRanks(infoHous,"Manhattan")[i].rank + dataRanks(infoDis,"Manhattan")[i].rank]);
                  infoRank.push(["Manhattan", i+1, dataRanks(crimDis,"Manhattan")[i].rank, dataRanks(infoHous,"Manhattan")[i].rank, dataRanks(infoDis,"Manhattan")[i].rank]);
                }
                for (var i = 0; i < 14; i++) {
                  infoAv.push(["Queens", i+1, dataRanks(crimDis,"Queens")[i].rank + dataRanks(infoHous,"Queens")[i].rank + dataRanks(infoDis,"Queens")[i].rank]);
                  infoRank.push(["Queens", i+1, dataRanks(crimDis,"Queens")[i].rank, dataRanks(infoHous,"Queens")[i].rank, dataRanks(infoDis,"Queens")[i].rank]);
                }
                for (var i = 0; i < 3; i++) {
                  infoAv.push(["Staten Island", i+1, dataRanks(crimDis,"Staten Island")[i].rank + dataRanks(infoHous,"Staten Island")[i].rank + dataRanks(infoDis,"Staten Island")[i].rank]);
                  infoRank.push(["Staten Island", i+1, dataRanks(crimDis,"Staten Island")[i].rank, dataRanks(infoHous,"Staten Island")[i].rank, dataRanks(infoDis,"Staten Island")[i].rank]);
                }
                infoAv.sort(compare).reverse();
              },100);
              ftb=false;
            }
          }

          //datos charts
          function compare2(a, b) {
            return (a.name >= b.name) ? 1 : -1;
          }

          function dataRanks(arr,boro) {
            var r=[];
            for (var i = 0; i < arr.length; i++) {
              if (arr[i][0]==boro) {
                r.push({"name":arr[i][1], size:1,rank:i+1});
              }
            }
            r.sort(compare2);
            return r;
          }

          var root;
          function getDataChart() {
            root ={
              "name": "Parameter",
              "children": [
                {
                  "name": "Crimes",
                  "children": [
                    {
                      "name": "Brooklyn",
                      "children": dataRanks(crimDis,"Brooklyn")
                    },
                    {
                      "name": "Bronx",
                      "children": dataRanks(crimDis,"Bronx")
                    },
                    {
                      "name": "Manhattan",
                      "children": dataRanks(crimDis,"Manhattan")
                    },
                    {
                      "name": "Queens",
                      "children": dataRanks(crimDis,"Queens")
                    },
                    {
                      "name": "Staten Island",
                      "children": dataRanks(crimDis,"Staten Island")
                    }
                  ]
                },
                {
                  "name": "Affordability",
                  "children": [
                    {
                      "name": "Brooklyn",
                      "children": dataRanks(infoHous,"Brooklyn")
                    },
                    {
                      "name": "Bronx",
                      "children": dataRanks(infoHous,"Bronx")
                    },
                    {
                      "name": "Manhattan",
                      "children": dataRanks(infoHous,"Manhattan")
                    },
                    {
                      "name": "Queens",
                      "children": dataRanks(infoHous,"Queens")
                    },
                    {
                      "name": "Staten Island",
                      "children": dataRanks(infoHous,"Staten Island")
                    }
                  ]
                },
                {
                  "name": "Distance",
                  "children": [
                    {
                      "name": "Brooklyn",
                      "children": dataRanks(infoDis,"Brooklyn")
                    },
                    {
                      "name": "Bronx",
                      "children": dataRanks(infoDis,"Bronx")
                    },
                    {
                      "name": "Manhattan",
                      "children": dataRanks(infoDis,"Manhattan")
                    },
                    {
                      "name": "Queens",
                      "children": dataRanks(infoDis,"Queens")
                    },
                    {
                      "name": "Staten Island",
                      "children": dataRanks(infoDis,"Staten Island")
                    }
                  ]
                }
              ]
            };
          }
          //charts

          function drawChart(a) {
            $(".loader").show();
            getCri();
            getHous();
            centrosDis();
            setTimeout(function() {
              getDataChart();

              var margin = {
                top: 30,
                right: 30,
                bottom: 30,
                left: 30
              };

              var w = 500 - margin.left - margin.right,
              h = 500 - margin.top - margin.bottom,
              radius = (Math.min(w, h) / 2) - 10;

              var formatNumber = d3.format(",d");
              var percentBase = 100;

              var x = d3.scale.linear()
              .range([0, 2 * Math.PI]);

              var y = d3.scale.sqrt()
              .range([0, radius]);

              var color = d3.scale.category20c();

              var partition = d3.layout.partition()
              .value(function(d) { return d.size; });

              var arc = d3.svg.arc()
              .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
              .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
              .innerRadius(function(d) { return Math.max(0, y(d.y)); })
              .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

              var svg = d3.select(a)
              .attr("width", w)
              .attr("height", h)
              .append("g")
              .attr("transform", "translate(" + w / 2 + "," + (h / 2) + ")");

              var tooltip = d3.select("#charts").append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);

              //var root = d3.hierarchy(nodeData);

              var g = svg.selectAll("path")
              .data(partition.nodes(root))
              .enter().append("g");

              var path = g.append("path")
              .attr("d", arc)
              .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
              .style("stroke", "white")
              .style("stroke-width", "1px")
              .on("click", click)
              .on("mouseover", function(d, i) {
                d3.select(this).style("cursor", "pointer")
                var totalSize = path.node().__data__.value;
                var percentage = Math.round(((100 * d.value / totalSize) * 100) / percentBase);
                var percentageString = percentage + "%";
                if (d.name == "Sources") return null;
                tooltip.text(function(){return d.children ? d.name :"District "+d.name +"\nrank " + d.rank;})
                .style("opacity", 0.8)
                .style("left", (d3.event.pageX) + 0 + "px")
                .style("top", (d3.event.pageY) - 0 + "px");
              })
              .on("mouseout", function(d) {
                d3.select(this).style("cursor", "default")
                tooltip.style("opacity", 0);
              });


              var text = g.append("text")
              .attr("transform", function(d) {
                return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")";
              })
              .attr("text-anchor", "middle")
              .attr("dx", "0") // margin
              .attr("dy", ".35em") // vertical-align
              .attr("visibility",function(d) { return d.dx < 0.03? "hidden" : "visible"})
              .text(function(d) {
                if (d.children) {
                  return d.name;
                }else {
                  return "D: "+d.name+" R: "+d.rank;
                }
              })
              .style("font-size", "13px")
              .style("fill", "#0a2538");


              function click(d) {
                var total = d.dx;
                // fade out all text elements
                text.transition().attr("opacity", 0);

                path.transition()
                .duration(750)
                .attrTween("d", arcTween(d))
                .each("end", function(e, i) {
                  // check if the animated element's data e lies within the visible angle span given in d
                  if (e.x >= d.x && e.x < (d.x + d.dx)) {
                    // get a selection of the associated text element
                    var arcText = d3.select(this.parentNode).select("text");
                    // fade in the text element and recalculate positions
                    arcText.transition().duration(750)
                    .attr("opacity", 1)
                    .attr("transform", function(d) {
                      return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")";
                    })
                    .attr("text-anchor", "middle")
                    .attr("visibility",function(d) { return d.dx/total < 0.01? "hidden" : "visible"});
                  }
                });
              }


              d3.select(self.frameElement).style("height", h + "px");

              // Interpolate the scales!
              function arcTween(d) {
                var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                yd = d3.interpolate(y.domain(), [d.y, 1]),
                yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
                return function(d, i) {
                  return i ? function(t) {
                    return arc(d);
                  } : function(t) {
                    x.domain(xd(t));
                    y.domain(yd(t)).range(yr(t));
                    return arc(d);
                  };
                };
              }

              function computeTextRotation(d) {
                var ang = (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
                return (ang > 90) ? 180 + ang : ang;
              }
              $(".loader").fadeOut();
            },100);
          }

          // select

          var x, i, j, selElmnt, a, b, c;
          /*look for any elements with the class "custom-select":*/
          x = document.getElementsByClassName("custom-sel");
          for (i = 0; i < x.length; i++) {
            selElmnt = x[i].getElementsByTagName("select")[0];
            /*for each element, create a new DIV that will act as the selected item:*/
            a = document.createElement("DIV");
            a.setAttribute("class", "select-selected");
            a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
            x[i].appendChild(a);
            /*for each element, create a new DIV that will contain the option list:*/
            b = document.createElement("DIV");
            b.setAttribute("class", "select-items select-hide");
            for (j = 1; j < selElmnt.length; j++) {
              /*for each option in the original select element,
              create a new DIV that will act as an option item:*/
              c = document.createElement("DIV");
              c.innerHTML = selElmnt.options[j].innerHTML;
              c.addEventListener("click", function(e) {
                /*when an item is clicked, update the original select box,
                and the selected item:*/
                var y, i, k, s, h;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                h = this.parentNode.previousSibling;
                for (i = 0; i < s.length; i++) {
                  if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    for (k = 0; k < y.length; k++) {
                      y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                  }
                }
                h.click();
              });
              b.appendChild(c);
            }
            x[i].appendChild(b);
            a.addEventListener("click", function(e) {
              /*when the select box is clicked, close any other select boxes,
              and open/close the current select box:*/
              e.stopPropagation();
              closeAllSelect(this);
              this.nextSibling.classList.toggle("select-hide");
              this.classList.toggle("select-arrow-active");
            });
          }
          function closeAllSelect(elmnt) {
            /*a function that will close all select boxes in the document,
            except the current select box:*/
            var x, y, i, arrNo = [];
            x = document.getElementsByClassName("select-items");
            y = document.getElementsByClassName("select-selected");
            for (i = 0; i < y.length; i++) {
              if (elmnt == y[i]) {
                arrNo.push(i)
              } else {
                y[i].classList.remove("select-arrow-active");
              }
            }
            for (i = 0; i < x.length; i++) {
              if (arrNo.indexOf(i)) {
                x[i].classList.add("select-hide");
              }
            }
          }
          /*if the user clicks anywhere outside the select box,
          then close all select boxes:*/
          document.addEventListener("click", closeAllSelect);

          // barra de navegación, botones
          function ini() {
            ocultar();
            mostrarInicio();
            setTimeout(function() {
              getNei();
              getHous();
              geoNei();
              getAir();
            },100);
            $(".loader").show();
            window.setTimeout(function() {
              $(".loader").fadeOut();
            },3000);
          }

          ini();

          function ocultar(){
            $("#ranking").hide();
            $("#o").hide();
            $("#desc").hide();
            $("#titDR").hide();
            $("#titRCC").hide();
            $("#3Distritos").hide();
            $("#comp1").hide();
            $("#comp2").hide();
            $("#charts").hide();
            $("#mapa").hide();
            $("#opciones").hide();
          }

          function mostrarInicio() {
            ocultar();
            $("#mapa").show();
            $("#opciones").show();
          }

          function mostrarRanking() {
            ocultar();
            $("#ranking").show();
            $("#mapa").show();
            $("#opciones").show();
          }

          function mostrarSegDistritos() {
            ocultar();
            $("#titSD").show();
            $("#3Distritos").show();
            $("#mapa").show();
            $("#opciones").show();
          }

          function mostrarDisDistritos() {
            ocultar();
            $("#titCD").show();
            $("#3Distritos").show();
            $("#mapa").show();
            $("#opciones").show();
          }

          function mostrarRenDistritos() {
            ocultar();
            $("#titAD").show();
            $("#3Distritos").show();
            $("#mapa").show();
            $("#opciones").show();
          }

          function mostrarComparacion() {
            ocultar();
            $("#o").show();
            $("#desc").show();
            $("#titDR").show();
            $("#comp1").show();
            $("#comp2").show();
            $("#titRCC").show();
            $("#mapa").show();
            $("#opciones").show();
            $("#charts").show();
            drawChart("#chart1");
            drawChart("#chart2");
          }

          var ftpv=true;
          var bd=[];
          var infoBD=[];
          function getBoDis() {
            if (ftpv) {
              for (var i = 0; i < feat.length; i++) {
                bd.push(feat[i].f.BoroCD);
              }
              bd.sort();
              ftpv = false;
              for (var j = 0; j < bd.length; j++) {
                infoBD.push([boroName(parseInt(bd[j]/100)),bd[j]%100]);
              }
            }
          }

          function compare(a, b) {
            return (a[2] >= b[2]) ? -1 : 1;
          }


          function llenarTabla(matriz,tableReference) {
            tableReference.innerHTML = "";
            var newR, n, bor, distri;
            for (var j = 0; j < matriz.length; j++) {
              newR = tableReference.insertRow(tableReference.rows.length);
              n = newR.insertCell();
              bor = newR.insertCell();
              distri= newR.insertCell();
              n.innerHTML = j+1;
              bor.innerHTML = matriz[j][0];
              distri.innerHTML = matriz[j][1];
            }
          }

          $(document).ready(function(){
            $("#navRanking").on("click",function() {
              $(".loader").show();
              mostrarRanking();
              centrosDis();
              bestDis();
              getCri();

              setTimeout(function() {
                var tableReference = $("#table1")[0];
                tableReference.innerHTML = "";
                var newR, n, bor, distri;
                for (var j = 0; j < 3; j++) {
                  newR = tableReference.insertRow(tableReference.rows.length);
                  n = newR.insertCell();
                  bor = newR.insertCell();
                  distri= newR.insertCell();
                  n.innerHTML = j+1;
                  bor.innerHTML = infoAv[j][0];
                  distri.innerHTML = infoAv[j][1];
                }
              },100);

              setTimeout(function() {
                var tableReference = $("#table2")[0];
                tableReference.innerHTML = "";
                var newR, n, bor, distri;
                for (var j = 0; j < 10; j++) {
                  newR = tableReference.insertRow(tableReference.rows.length);
                  n = newR.insertCell();
                  bor = newR.insertCell();
                  distri= newR.insertCell();
                  n.innerHTML = j+1;
                  bor.innerHTML = crimDis[j][0];
                  distri.innerHTML = crimDis[j][1];
                }
              },100);

              var tableReference = $("#table3")[0];
              tableReference.innerHTML = "";
              var newR, n, bor, distri;
              for (var j = 0; j < 10; j++) {
                newR = tableReference.insertRow(tableReference.rows.length);
                n = newR.insertCell();
                bor = newR.insertCell();
                distri= newR.insertCell();
                n.innerHTML = j+1;
                bor.innerHTML = infoDis[j][0];
                distri.innerHTML = infoDis[j][1];
              }

              var tableReference = $("#table4")[0];
              tableReference.innerHTML = "";
              var newR, n, bor, distri;
              for (var j = 0; j < 10; j++) {
                newR = tableReference.insertRow(tableReference.rows.length);
                n = newR.insertCell();
                bor = newR.insertCell();
                distri= newR.insertCell();
                n.innerHTML = j+1;
                bor.innerHTML = infoHous[j][0];
                distri.innerHTML = infoHous[j][1];
              }
              $(".loader").fadeOut("slow");
            });
          });

          $(document).ready(function(){
            $("#navInicio").on("click",mostrarInicio);
            $("#navComparacion").on("click",function() {
              getBoDis();
              mostrarComparacion();
              var tableReference1= $("#tableBody1")[0]
              llenarTabla(infoBD,tableReference1);
              var tableReference2= $("#tableBody2")[0]
              llenarTabla(infoBD,tableReference2);
            });
          });

          $(document).ready(function(){
            $("#botRank1").on("click",function() {
              $(".loader").show();
              var sel = document.getElementById('selT1');
              if(sel.value == 'Affordability'){
                var tableReference = $("#tableBody1")[0];
                llenarTabla(infoHous,tableReference);
              } else if (sel.value == 'Distance') {
                centrosDis();
                var tableReference = $("#tableBody1")[0];
                llenarTabla(infoDis,tableReference);
              } else if (sel.value == 'Safety') {
                getCri();
                var tableReference = $("#tableBody1")[0];
                setTimeout(function () {
                  llenarTabla(crimDis,tableReference);
                },100);
              }else if (sel.value == 'Average') {
                bestDis();
                var tableReference = $("#tableBody1")[0];
                setTimeout(function() {
                  llenarTabla(infoAv,tableReference);
                },100);
              } else if (sel.value == 'Museums') {
                getMus();
                var tableReference = $("#tableBody1")[0];
                setTimeout(function() {
                  llenarTabla(infoMus,tableReference);
                },100);
              } else if (sel.value == 'Galleries') {
                getGal();
                var tableReference = $("#tableBody1")[0];
                setTimeout(function() {
                  llenarTabla(infoGal,tableReference);
                },100);
              } else if (sel.value == 'Air Quality') {
                getAir();
                var tableReference = $("#tableBody1")[0];
                setTimeout(function() {
                  llenarTabla(infoAir,tableReference);
                },100);
              }
              $(".loader").fadeOut();
            });
          });

          $(document).ready(function(){
            $("#botRank2").on("click",function() {
              $(".loader").show();
              var sel = document.getElementById('selT2');
              if(sel.value == 'Affordability'){
                var tableReference = $("#tableBody2")[0];
                llenarTabla(infoHous,tableReference);
              } else if (sel.value == 'Distance') {
                centrosDis();
                var tableReference = $("#tableBody2")[0];
                llenarTabla(infoDis,tableReference);
              } else if (sel.value == 'Safety') {
                getCri();
                var tableReference = $("#tableBody2")[0];
                setTimeout(function () {
                  llenarTabla(crimDis,tableReference);
                },100);
              } else if (sel.value == 'Average') {
                bestDis();
                var tableReference = $("#tableBody2")[0];
                setTimeout(function() {
                  llenarTabla(infoAv,tableReference);
                },100);
              } else if (sel.value == 'Museums') {
                getMus();
                var tableReference = $("#tableBody2")[0];
                setTimeout(function() {
                  llenarTabla(infoMus,tableReference);
                },100);
              } else if (sel.value == 'Galleries') {
                getGal();
                var tableReference = $("#tableBody2")[0];
                setTimeout(function() {
                  llenarTabla(infoGal,tableReference);
                },100);
              } else if (sel.value == 'Air Quality') {
                getAir();
                var tableReference = $("#tableBody2")[0];
                setTimeout(function() {
                  llenarTabla(infoAir,tableReference);
                },100);
              }
              $(".loader").fadeOut();
            });
          });

          $(document).ready(function(){
            $("#export1").on("click",function () {
              $("#table1").tableToCSV();
            });
            $("#export2").on("click",function () {
              $("#table2").tableToCSV();
            });
            $("#export3").on("click",function () {
              $("#table3").tableToCSV();
            });
            $("#export4").on("click",function () {
              $("#table4").tableToCSV();
            });
            $("#exportar1").on("click",function () {
              $("#tableBody1").tableToCSV();
            });
            $("#exportar2").on("click",function () {
              $("#tableBody2").tableToCSV();
            });
          });
