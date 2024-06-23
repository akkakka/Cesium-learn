Cesium.Ion.defaultAccessToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNDBjNjg0ZC1iODNlLTQ3NTMtOTU1Ny02NzVjMzI0ZDMyNTUiLCJpZCI6NTkxNTQsImlhdCI6MTY0MDY5ODIyNn0.JFAkOoVRCkKM-25T3oX5XxbPXk6RCIuTCLpVdvv4AoU';
var viewer = new Cesium.Viewer("cesiumContainer", {
  animation: false,
  timeline: false,
  selectionIndicator: false,
  baseLayerPicker: false,           //隐藏旧地图图层
  fullscreenButton: false,
  vrButton: false,
  geocoder: false,
  homeButton: false,
  sceneModePicker: false,
  creditContainer: null,
  infoBox: false,
  navigationHelpButton: false,
  imageryProvider: esri,     //选取新的图层地图
  terrainProvider:new Cesium.CesiumTerrainProvider({
    url:Cesium.IonResource.fromAssetId(1)            //地形服务器地址
                          
})                         
});
const layer = viewer.imageryLayers.addImageryProvider(
  new Cesium.IonImageryProvider({ assetId: 3 })
);

var esri=new Cesium.ArcGisMapServerImageryProvider({
  url:'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
  })


  const position=Cesium.Cartesian3.fromDegrees(116.40,39.90,80000)//设置一个坐标
  viewer.camera.flyTo
  ({
      destination:position,
      orientation:position,
      orientation:{           //视口方向
          heading:Cesium.Math.toRadians(0),
          pitch:Cesium.Math.toRadians(-90),
          roll:(0)
      },
     duration:6    //飞行时间

  })

var startPoint = null; // 起点坐标
var endPoint = null; // 终点坐标
var startMarker = null; // 起点对应绘制的entity
var endMarker = null; // 终点对应绘制的entity
var dataSource = "gaode"; // 定义数据源
var method = "driving"; // 定义路径规划方式



var pathEntity = null; // 路径

// 每种途径的url(只返回一条记录即可)
var routes = {
  "baidu": {
    "transit": "http://api.map.baidu.com/direction/v2/transit?origin={start}&destination={end}&coord_type=wgs84&page_size=1&ak=fEDcRKPxLwIkOamOx4trAivKm8TbaWHK",
    "driving": "http://api.map.baidu.com/direction/v2/driving?origin={start}&destination={end}&coord_type=wgs84&page_size=1&ak=fEDcRKPxLwIkOamOx4trAivKm8TbaWHK",
    "riding": "http://api.map.baidu.com/direction/v2/riding?origin={start}&destination={end}&coord_type=wgs84&page_size=1&ak=x3VOQlvZ6HVzYoTuEMGUeDl9TGVrZ8y7"
  },
  "gaode": {
    "transit": "https://restapi.amap.com/v3/direction/transit/integrated?origin={start}&destination={end}&city=010&key=36368c04f9fed752c806765be07d385a",
    "driving": "https://restapi.amap.com/v3/direction/driving?origin={start}&destination={end}&key=36368c04f9fed752c806765be07d385a",
    "riding": "https://restapi.amap.com/v4/direction/bicycling?origin={start}&destination={end}&key=36368c04f9fed752c806765be07d385a"
  }
};

// 点击获取坐标点
function getPickPosition(callback) {
  // 注册点击事件
  viewer.screenSpaceEventHandler.setInputAction((clickEvent) => {
    
    // 拾取坐标点
    var position = viewer.scene.globe.pick(viewer.camera.getPickRay(clickEvent.position), viewer.scene);
    position = Cesium.Cartographic.fromCartesian(position);

    // 转换为经纬度
    position = Cesium.Math.toDegrees(position.longitude) + "," + Cesium.Math.toDegrees(position.latitude);
    
    // 取消点击事件
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    
    // 执行回调,返回position
    callback(position);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}
function myFunction2() {
  document.getElementById("ditu").classList.toggle("show");
}
 
function reset() {
  viewer.dataSources.removeAll();
  viewer.entities.removeAll();
}

// 根据坐标位置绘制entity
function addPositionMarker(position, imageUrl) {
  return viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(parseFloat(position.split(',')[0]), parseFloat(position.split(',')[1])),
    billboard: {
      image: imageUrl,
      scale: 0.5,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM
    }
  });
}

function setStartLocation() {  //获取起始坐标点函数
  getPickPosition((position) => {
    startPoint = position;
    if (startMarker != null) {
      viewer.entities.remove(startMarker);
    }
    startMarker = addPositionMarker(position, '../imange/qidinac.png');
  });
}

function setEndLocation() {   //获取目标点函数
  getPickPosition((position) => {
    endPoint = position;
    if (endMarker != null) {
      viewer.entities.remove(endMarker);
    }
    endMarker = addPositionMarker(position, '../imange/end1c.png');
  });
}

function setDataSource(type) {
  dataSource = type;
}

function setMethod(type) {
  method = type;
}


function formatPath(path) {
  var positions = [];
  var pathes = path.split(";");
  for (var i = 0; i < pathes.length; i++) {
    var lon = parseFloat(pathes[i].split(",")[0]);
    var lat = parseFloat(pathes[i].split(",")[1]);
    if (dataSource == "baidu") {
      var g = coordinateTransform.bd09togcj02(lon, lat);  //获取经度
      var w = coordinateTransform.gcj02towgs84(g[0], g[1]); //获取纬度
      positions.push(Cesium.Cartesian3.fromDegrees(w[0], w[1]));
    } else if (dataSource == "gaode" || dataSource == "tengxun") {
      var w = coordinateTransform.gcj02towgs84(lon, lat);
      positions.push(Cesium.Cartesian3.fromDegrees(w[0], w[1]));
    }
  }
  return positions;
}

function analyzeResponseB(data) { //分析数据
  var allPath = "";
  var all_road_name = "";

  if (method == "driving" ) {
    var steps = data.result.routes[0].steps;
    for (var i = 0; i < steps.length; i++) {
      var path = steps[i].path;
      allPath += path + ";";
      all_road_name += "<li>" + steps[i].road_name + "</li>";
    }
  } else if( method == "riding") {
    var steps = data.result.routes[0].steps;
    for (var i = 0; i < steps.length; i++) {
      var path = steps[i].path;
      allPath += path + ";";
      all_road_name += "<li>" + steps[i].name + "</li>";
    }
  }
  else if (method == "transit") {
    var steps = data.result.routes[0].steps;
    for (var i = 0; i < steps.length; i++) {
      var path = steps[i][0].path;
      allPath += path + ";";
      all_road_name += "<li>" + steps[i][0].instructions + "</li>";
    }
  }
  viewer.entities.remove(pathEntity);
  $(".routeInfo ol").html(all_road_name);

  pathEntity = viewer.entities.add({
    polyline: {
      positions: formatPath(allPath.substring(0, allPath.length - 1)),
      width: 5,
      material: Cesium.Color.YELLOW.withAlpha(0.8),
      depthFailMaterial: Cesium.Color.GREEN.withAlpha(0.8)
    }
  });
}

function analyzeResponseA(data) {
  var allPath = "";
  var all_road_name = "";

  if (method == "driving") {
    var steps = data.route.paths[0].steps;
    for (var i = 0; i < steps.length; i++) {
      var path = steps[i].polyline;
      allPath += path + ";";
      all_road_name += "<li>" + steps[i].instruction + "</li>";
    }
  } else if (method == "riding") {
    var steps = data.data.paths[0].steps;
    for (var i = 0; i < steps.length; i++) {
      var path = steps[i].polyline;
      allPath += path + ";";
      all_road_name += "<li>" + steps[i].instruction + "</li>";
    }
  } else if (method == "transit") {
    var transits = data.route.transits;

    // 按照权重进行筛选
    // 价格：cost
    var cost = Math.min.apply(Math, transits.map(function (o) {
      return o.cost
    }));
    // // 时间：duration
    // var duration = Math.min.apply(Math, transits.map(function(o) {return o.duration}));
    // // 距离：distance
    // var distance = Math.min.apply(Math, transits.map(function(o) {return o.distance}));
    // // 步行：walking_distance
    // var walking_distance = Math.min.apply(Math, transits.map(function(o) {return o.walking_distance}));

    var steps = transits.filter(item => item.cost = cost)[0].segments;

    for (var i = 0; i < steps.length; i++) {

      var bus = steps[i].bus.buslines;
      if (bus != undefined && bus.length > 0) {
        for (var k = 0; k < bus.length; k++) {
          var path = bus[k].polyline;
          allPath += path + ";";
          all_road_name += "<li>" + bus[k].name + "</li>";
        }
      }
    }
  }
  viewer.entities.remove(pathEntity);
  $(".routeInfo ol").html(all_road_name);
  pathEntity = viewer.entities.add({
    polyline: {
      positions: formatPath(allPath.substring(0, allPath.length - 1)),
      width: 5,
      material: Cesium.Color.YELLOW.withAlpha(0.8),
      depthFailMaterial: Cesium.Color.RED.withAlpha(0.8)
    }
  });
}

function analyzeResponseT(data) {
  var allPath = "";
  var all_road_name = "";

  if (method == "driving" || method == "riding") {
    var path = data.result.routes[0].polyline;
    for (var i = 2; i < path.length; i++) {
      path[i] = path[i - 2] + path[i] / 1000000
    }
    for (var i = 0; i < path.length; i = i + 2) {
      allPath += path[i + 1] + "," + path[i] + ";";
    }
    var steps = data.result.routes[0].steps;
    for (var i = 0; i < steps.length; i++) {
      all_road_name += "<li>" + steps[i].instruction + "</li>";
    }
  } else if (method == "transit") {
    var transits = data.result.routes;

    // 按照权重进行筛选
    // 时间：duration
    var duration = Math.min.apply(Math, transits.map(function (o) {
      return o.duration
    }));
    // // 距离：distance
    // var distance = Math.min.apply(Math, transits.map(function(o) {return o.distance}));
    // // 步行：walking_distance
    // var walking_distance = Math.min.apply(Math, transits.map(function(o) {return o.walking_distance}));

    var steps = transits.filter(item => item.duration = duration)[0].steps;

    for (var i = 0; i < steps.length; i++) {
      if (steps[i].mode == "WALKING") {
        var path = steps[i].polyline;
        if (path != undefined && path.length > 0) {
          for (var k = 2; k < path.length; k++) {
            path[k] = path[k - 2] + path[k] / 1000000
          }
          for (var k = 0; k < path.length; k = k + 2) {
            allPath += path[k + 1] + "," + path[k] + ";";
          }
        }

        var walking = steps[i].steps;
        if (walking != undefined && walking.length > 0) {
          for (var k = 0; k < walking.length; k++) {
            all_road_name += "<li>" + walking[k].instruction + "</li>";
          }
        }
      } else if (steps[i].mode == "TRANSIT") {
        var lines = steps[i].lines;
        if (lines != undefined && lines.length > 0) {
          for (var k = 0; k < lines.length; k++) {
            var path = lines[k].polyline;
            for (var j = 2; j < path.length; j++) {
              path[j] = path[j - 2] + path[j] / 1000000
            }
            for (var j = 0; j < path.length; j = j + 2) {
              allPath += path[j + 1] + "," + path[j] + ";";
            }
            all_road_name += "<li>" + lines[k].title + "</li>";
          }
        }
      }
    }
  }

  viewer.entities.remove(pathEntity);
  $(".routeInfo ol").html(all_road_name);
  pathEntity = viewer.entities.add({
    polyline: {
      positions: formatPath(allPath.substring(0, allPath.length - 1)),
      width: 5,
      material: Cesium.Color.GREEN.withAlpha(0.8),
      depthFailMaterial: Cesium.Color.GREEN.withAlpha(0.8)
    }
  });
}

function startNavigate() {
  if (dataSource == "baidu") {
    // 调整坐标方向
    var startPointInverse = startPoint.split(",").reverse().join(",");
    var endPointInverse = endPoint.split(",").reverse().join(",");
    var url = routes[dataSource][method].replace("{start}", startPointInverse).replace("{end}", endPointInverse);
    Cesium.Resource.fetchJsonp({
      url: url
    }).then(data => {
      analyzeResponseB(data);
    })
  } else if (dataSource == "gaode") {
    var startPointA = startPoint.split(",");
    var endPointA = endPoint.split(",");
    var w = coordinateTransform.wgs84togcj02(startPointA[0], startPointA[1]);
    var g = coordinateTransform.wgs84togcj02(endPointA[0], endPointA[1]);
    var url = routes[dataSource][method].replace("{start}", w[0] + "," + w[1]).replace("{end}", g[0] + "," + g[1]);
    Cesium.Resource.fetchJsonp({
      url: url
    }).then(data => {
      analyzeResponseA(data);
    })
  } else if (dataSource == "tengxun") {
    var startPointA = startPoint.split(",");
    var endPointA = endPoint.split(",");
    var w = coordinateTransform.wgs84togcj02(startPointA[0], startPointA[1]);
    var g = coordinateTransform.wgs84togcj02(endPointA[0], endPointA[1]);

    // 调整坐标方向
    var startPointInverse = w.reverse().join(",");
    var endPointInverse = g.reverse().join(",");
    var url = routes[dataSource][method].replace("{start}", startPointInverse).replace("{end}", endPointInverse);
    Cesium.Resource.fetchJsonp({
      url: url
    }).then(data => {
      analyzeResponseT(data);
    })
  }
}

