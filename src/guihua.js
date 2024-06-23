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


//flyto相机方法
const position=Cesium.Cartesian3.fromDegrees(116.40,39.90,8000)//设置一个坐标
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




var startPoint = null; //起点坐标
var endPoint = null;//终点坐标
var wayPoint=[];//途径点坐标
var domint=[];
var tra=null;
var tran=null;
var z=null;//途径点个数
var typ=null;
var num=null;//记录点击的途径点，上限
var way=null;



var startMarker = null;//起点对应绘制的实体
var endMarker = null;//终点对应绘制的实体
var wayMarker=[];//途径点对应绘制的实体


var dataSource = "baidu"; // 默认的数据源
var method = "driving"; // 默认的出行方式
var policy=0;//默认的出行策略


var pathEntity = null; // 路径

// 每种途径的url(只返回一条记录即可)
var routes = {
  "baidu": {
    "driving": "http://api.map.baidu.com/direction/v2/driving?&origin={start}&destination={end}&waypoints={way}&tactics={policy}&coord_type=wgs84&page_size=1&ak=x3VOQlvZ6HVzYoTuEMGUeDl9TGVrZ8y7",
  }
};

//点击获取坐标点
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


//根据坐标位置绘制entity
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

//起始点调用函数
function setStartLocation() { 
  getPickPosition((position) => {
    startPoint = position;
    if (startMarker != null) {
      viewer.entities.remove(startMarker);
    }
    startMarker = addPositionMarker(position, '../imange/qidinac.png');
  });
}

//终点调用函数
function setEndLocation() {  
  getPickPosition((position) => {
    endPoint = position;
    if (endMarker != null) {
      viewer.entities.remove(endMarker);
    }
    endMarker = addPositionMarker(position, '../imange/end1c.png');
  });
}

//途径点调用函数
function setWayLocation(one) { 
z=one;
num=one;
  getPickPosition((position) => {
    wayPoint[0]= position;
    if (wayMarker[0] != null) {
      viewer.entities.remove(wayMarker[0]);
    }
    wayMarker [0]= addPositionMarker(position, '../imange/dian1c.png');
  });
  return z;
}
function setWayLocation2(two) { 
  z=two;
  num=two;
  getPickPosition((position) => {
    wayPoint[1]= position;
    if (wayMarker[1]!= null) {
      viewer.entities.remove(wayMarker[1]);
    }
    wayMarker[1] = addPositionMarker(position, '../imange/dian2c.png');
  });
  return z;
}
function setWayLocation3(three) { 
  z=three;
  num=three;
  getPickPosition((position) => {
    wayPoint[2]= position;

    if (wayMarker[2]!= null) {
      viewer.entities.remove(wayMarker[2]);
    }
    wayMarker[2] = addPositionMarker(position, '../imange/dian3c.png');
  });
  return z;
}
function setWayLocation4(four) { 
  z=four;
  num=four;
  getPickPosition((position) => {
    wayPoint[3]= position;

    if (wayMarker[3]!= null) {
      viewer.entities.remove(wayMarker[3]);
    }
    wayMarker[3] = addPositionMarker(position, '../imange/dian4.png');
  });
  return z;
}
function setWayLocation5(five) { 
  z=five;
  num=five;
  getPickPosition((position) => {
    wayPoint[4]= position;

    if (wayMarker[4]!= null) {
      viewer.entities.remove(wayMarker[4]);
    }
    wayMarker[4] = addPositionMarker(position, '../imange/dian5.png');
  });
  return z;
}






/*
//数据源的切换
function setDataSource(type) {
  dataSource = type;
}
*/
//出行方式的切换
//出行策略
function setWay(type) {
  tran=type;
  return tran;
 }
 

//坐标的转换
function formatPath(path) {
  var positions = [];
  var pathes = path.split(";");
  for (var i = 0; i < pathes.length; i++) {
    var lon = parseFloat(pathes[i].split(",")[0]);
    var lat = parseFloat(pathes[i].split(",")[1]);
    if (dataSource == "baidu") {
      var g = coordinateTransform.bd09togcj02(lon, lat);
      var w = coordinateTransform.gcj02towgs84(g[0], g[1]);
      positions.push(Cesium.Cartesian3.fromDegrees(w[0], w[1]));
    } 
  }
  return positions;
}


function analyzeResponseB(data) {
  var allPath = "";
  var all_road_name = "";
  //驾驶或者骑行
  if (method == "driving" ) {
    var steps = data.result.routes[0].steps;
    for (var i = 0; i < steps.length; i++) {
      var path = steps[i].path;
      allPath += path + ";";
      all_road_name += "<li>" + steps[i].road_name + "</li>";
    }
  //公交出行
  } 
  viewer.entities.remove(pathEntity);
  $(".routeInfo ol").html(all_road_name);
  //path名字的输出
  pathEntity = viewer.entities.add({
    polyline: {
      positions: formatPath(allPath.substring(0, allPath.length - 1)),
      width: 5,
      material: Cesium.Color.YELLOW.withAlpha(0.8),
      depthFailMaterial: Cesium.Color.GREEN.withAlpha(0.8)
    }
  });
}


//途径点的处理
function addpoint(domint){
  for(i=0;i<=z;i++){
    domint[i]=wayPoint[i].split(",").reverse().join(",");
}
if(z==0){
  var wpoints=(domint[0]);//将数组变为字符串
viewer.entities.remove(wayMarker[1]);
viewer.entities.remove(wayMarker[2]);
viewer.entities.remove(wayMarker[3]);
viewer.entities.remove(wayMarker[4]);
}else if(z==1){
  var wpoints=(domint[0]+"|"+domint[1]);//将数组变为字符串
  viewer.entities.remove(wayMarker[2]);
  viewer.entities.remove(wayMarker[3]);
  viewer.entities.remove(wayMarker[4]);
}else if(z==2){
  var wpoints=(domint[0]+"|"+domint[1]+"|"+domint[2]);//将数组变为字符串
  viewer.entities.remove(wayMarker[3]);
  viewer.entities.remove(wayMarker[4]);
}else if(z==3){
  var wpoints=(domint[0]+"|"+domint[1]+"|"+domint[2]+"|"+domint[3]);//将数组变为字符串
  viewer.entities.remove(wayMarker[4]);
}else if(z==4){
  var wpoints=(domint[0]+"|"+domint[1]+"|"+domint[2]+"|"+domint[3]+"|"+domint[4]);//将数组变为字符串
}
 return wpoints;
}

//出行策略函数
function addWat(tra){
      if(tran==null){
          tra=0;//取到出行的默认值
      }else{
        tra=tran;
      }
      return tra;
}


function startNavigate() {
  if (dataSource == "baidu") {
    var tractWAy=addWat(tra);
    var startPointInverse = startPoint.split(",").reverse().join(",");
    var wayPointInverse=addpoint(domint); 
    var endPointInverse = endPoint.split(",").reverse().join(",");
    var url = routes[dataSource][method].replace("{start}", startPointInverse).replace("{way}", wayPointInverse).replace("{end}",endPointInverse).replace("{policy}",tractWAy);
    Cesium.Resource.fetchJsonp({
      url: url
    }).then(data => {
      analyzeResponseB(data);
    })
  } 
}
