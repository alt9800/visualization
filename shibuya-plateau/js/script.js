//===============================================================
// Global
//===============================================================
var project;

//===============================================================
// BasicView
//===============================================================
(function(project){

	var BasicView = (function(){
		function BasicView(){
			var _this = this;
			var container = document.querySelector('#canvas_wrapper');

			this.scene = new THREE.Scene();

			this.camera = new THREE.PerspectiveCamera(90,window.innerWidth/window.innerHeight,0.1,1000);
			this.camera.position.set(0,4,4);
			this.scene.add(this.camera);

			this.renderer = new THREE.WebGLRenderer({antialias:true});
			this.renderer.setPixelRatio(window.devicePixelRatio);
			this.renderer.setSize(window.innerWidth,window.innerHeight);
			this.renderer.shadowMap.enabled = true;
			this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

			container.appendChild(this.renderer.domElement);

			window.addEventListener('resize',onWindowResize,false);
			function onWindowResize(){
				_this.camera.aspect = window.innerWidth/window.innerHeight;
				_this.camera.updateProjectionMatrix();
				_this.renderer.setSize(window.innerWidth,window.innerHeight);
			}
		}
		BasicView.prototype.startRendering = function () {
			requestAnimationFrame(this.startRendering.bind(this));
			this.render();
			this.onTick();
		};
		BasicView.prototype.render = function(){
			this.renderer.render(this.scene,this.camera);
		}
		BasicView.prototype.onTick = function(){
		}
		return BasicView;
	})();

	project.BasicView = BasicView;
})(project || (project = {}));

//===============================================================
// ThreeWorld extend BasicView
//===============================================================
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

(function(project){

	var ThreeWorld = (function(_super){
		__extends(ThreeWorld, _super);

		var _this;

		function ThreeWorld(){
			_super.call(this);
			_this = this;

			document.addEventListener('touchmove', function(e) {e.preventDefault();}, {passive: false});
			var orbitControls = new THREE.OrbitControls(this.camera);

			setLoading();
			this.startRendering();
		}

		function setLoading(){
			TweenMax.to(".loader",0.1,{opacity:1});

			var manifest = [
				{id:'donut',src:'data/donut.gltf'}
			];
			var loadQueue = new createjs.LoadQueue();

			loadQueue.on('progress',function(e){
				var progress = e.progress;
			});

			loadQueue.on('complete',function(){
				TweenMax.to("#loader_wrapper" , 1 , {opacity:0});

				initObject();
				initLight();
			});

			loadQueue.loadManifest(manifest);
		}

		function initObject(){

			//glTFの読み込み
			var loader = new THREE.GLTFLoader();
			loader.load('data/shibuya.glb',function(data){
				var glb = data;
				var obj = glb.scene;

				// for(var i = 0; i < obj.children.length; i++){

					//var mesh = obj.children[i];
					//console.log(i,mesh.name);

					//if(i >= 1000){
					//	if(i==1014 || i==1019){
					//		mesh.receiveShadow = true;
					//	}
					//	mesh.castShadow = true;
					//}
				//}

				obj.position.set(0,0.1,0);
				obj.scale.set(1,1,1);
				_this.scene.add(obj);
			});

			_this.renderer.gammaOutput = true;
		}

		function initLight(){
			var ambientLight = new THREE.AmbientLight(0x666666);
			_this.scene.add(ambientLight);

			var positionArr = [
					[0,5,0,2],
					[-5,3,2,2],
					[5,3,2,2],
					[0,3,5,1],
					[0,3,-5,2]
				];

			for(var i = 0; i < positionArr.length; i++){
				var directionalLight = new THREE.DirectionalLight(0xFFFFFF, positionArr[i][3]);
				directionalLight.position.set( positionArr[i][0], positionArr[i][1], positionArr[i][2]);

				if(i == 0 || i == 2 || i == 3){
					directionalLight.castShadow = true;
					directionalLight.shadow.camera.top = 50;
					directionalLight.shadow.camera.bottom = -50;
					directionalLight.shadow.camera.right = 50;
					directionalLight.shadow.camera.left = -50;
					directionalLight.shadow.mapSize.set(4096,4096);
				}
				_this.scene.add(directionalLight);

				//var helper = new THREE.DirectionalLightHelper( directionalLight, 1);
				//scene.add(helper);
			}
		}

		ThreeWorld.prototype.onTick = function(){
		}

		return ThreeWorld;

	})(project.BasicView);
	project.ThreeWorld = ThreeWorld;

})(project || (project = {}));

//===============================================================
// init
//==============================================================
window.addEventListener("load", function () {
   var threeWorld = new project.ThreeWorld();
});