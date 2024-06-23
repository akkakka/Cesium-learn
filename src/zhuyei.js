Cesium.Ion.defaultAccessToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNDBjNjg0ZC1iODNlLTQ3NTMtOTU1Ny02NzVjMzI0ZDMyNTUiLCJpZCI6NTkxNTQsImlhdCI6MTY0MDY5ODIyNn0.JFAkOoVRCkKM-25T3oX5XxbPXk6RCIuTCLpVdvv4AoU';
var viewer = new Cesium.Viewer('cesiumContainer', {
  animation: false,//控制视图动画的播放速度
  timeline: false,//时间线，指示当前时间
  homeButton: true,//视角返回初始位置
  navigationHelpButton: false,//导航帮助按钮
  geocoder:true,//查找工具
  sceneModePicker:true, //选择视角模式
  fullscreenButton:false,//全屏按钮
  baseLayerPicker:true,//图层按钮
  terrainProvider:new Cesium.CesiumTerrainProvider({
    url:Cesium.IonResource.fromAssetId(1)            //地形服务器地址
                          
})   
});

var kz=null;
//flyto相机方法
const position=Cesium.Cartesian3.fromDegrees(116.40,39.90,8000000)//设置一个坐标
          viewer.camera.flyTo
          ({
              destination:position,//坐标
              orientation:position,//(z轴，y轴，x轴)
              orientation:{           //视口方向
                  heading:Cesium.Math.toRadians(0),//偏航角，正北为0（左右）
                  pitch:Cesium.Math.toRadians(-90),//俯仰角（前后空翻）
                  roll:(0)//翻滚角（侧空翻）
              },
             duration:6    //飞行时间

          })
//点击按钮，下拉菜单在 显示/隐藏 之间切换
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}
// 点击下拉菜单意外区域隐藏
window.onclick = function(e) {
if (!e.target.matches('.dropbtn')) {
  var myDropdown = document.getElementById("myDropdown");
    if (myDropdown.classList.contains('show')) {
      myDropdown.classList.remove('show');
    }
}
}


var dataPromise = Cesium.GeoJsonDataSource.load('../zg.json', geojsonOptions);
function jiazai(){
  viewer.scene.globe.depthTestAgainstTerrain = false;
  if(kz==null){
  viewer.dataSources.add(
    Cesium.GeoJsonDataSource.load("zg.json", {
      stroke: Cesium.Color.WHITE,
      fill: Cesium.Color.GREEN.withAlpha(0.5),
      strokeWidth: 5,
    })
  )
  kz=1;
  return kz;
  }
  else{
    viewer.dataSources.removeAll();
    kz=null;
    return kz;
  }
};
//纽约建筑物
function jianzhuwu(){
const tileset = viewer.scene.primitives.add(
  new Cesium.Cesium3DTileset({
    url: Cesium.IonResource.fromAssetId(75343),//地址
    //url:Cesium.IonResource.fromAssetId()
  })
);

var position=Cesium.Cartesian3.fromDegrees(-74.01881302800248,40.69114333714821, 753)//设置一个坐标
var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
  21.27879878293835,-21.34390550872461,0.0716951918898415
  );
          viewer.camera.flyTo
          ({
              destination:position,
              orientation:initialOrientation,//(z轴，y轴，x轴)
              duration:6    //飞行时间

          })
        tileset.style = new Cesium.Cesium3DTileStyle({
            color:{
                conditions:[
          ['${Height} >= 300', 'rgba(45,0,75,0.5)'],
          ['${Height} >= 200', 'rgb(102, 71, 151)'],
					['${Height} >= 100', 'rgb(170, 162, 204)'],
					['${Height} >= 50', 'rgb(224, 226, 238)'],
					['${Height} >= 25', 'rgb(252, 230, 200)'],
					['${Height} >= 10', 'rgb(248, 176, 87)'],
					['${Height} >= 5', 'rgb(198, 106, 11)'],
					['true', 'rgb(127, 59, 8)']
                ]
            },
            show:'${Height} >= 100'
        })
      }

 function zhufeng(){
        const position=Cesium.Cartesian3.fromDegrees(86.94563, 27.98121, 10000)//设置一个坐标
        
                  viewer.camera.flyTo
                  ({
                      destination:position,
                      orientation:position,
                      orientation: {
                        heading: 3.8455,//z
                        pitch: -0.4535,//y
                        roll: 0.0,//x
                      },
                     duration:6    //飞行时间
        
               
                    })
                  }
                
//开启地形
viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.terrainProvider = Cesium.createWorldTerrain({
  requestWaterMask : true, // 水面
  requestVertexNormals : false // 光照
});

