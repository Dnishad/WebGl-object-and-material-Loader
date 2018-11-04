
var camera, scene, renderer, control, orbit;

 var objects = [];
 var raycaster = new THREE.Raycaster();
			var mouse = new THREE.Vector2(),
			offset = new THREE.Vector3(),
			INTERSECTED, SELECTED;
var forSize=[];
var projector, mouse = { x: 0, y: 0 }, INTERSECTED;
			init();
			animate();
			function init() {
				renderer = new THREE.WebGLRenderer({antialias: true});
				renderer.setClearColor(0x000000);
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.shadowMap.enabled = true;
				renderer.shadowMap.type = THREE.PCFSoftShadowMap;
				
				document.body.appendChild( renderer.domElement );
				camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 300000 );
				camera.position.set( 50, 50, 50 );
			//	camera.lookAt( 0, 200, 0 );
				scene = new THREE.Scene();
				 var ambientLight = new THREE.AmbientLight( 0x353535 );
        scene.add( ambientLight );
				scene.background = new THREE.CubeTextureLoader()
	.setPath( 'tex/' )
	.load( [		
			
		'pos-y.png',
		'neg-y.png',
		'pos-z.png',
		'neg-z.png',
		'pos-x.png',
		'neg-x.png'	
	] );
				

		var light = new THREE.DirectionalLight( 0xffffff, 1 );
			light.position.set( 20, 20, 20 );
			light.castShadow = true;
			light.shadow.mapSize.width = 1024;
			light.shadow.mapSize.height = 1024;
			light.shadow.camera.near = 0.5;       // default
			light.shadow.camera.far = 500;  
			light.shadowCameraLeft = -100;
			light.shadowCameraRight = 100;
			light.shadowCameraTop = -100;
			light.shadowCameraBottom = 100;
			scene.add( light );
		
		var lightTwo = new THREE.DirectionalLight( 0xffffff, .5 );
			lightTwo.position.set( -20, -20, -20 );
			
			scene.add( lightTwo );       
				
				orbit = new THREE.OrbitControls(camera, renderer.domElement);
				orbit.maxPolarAngle = Math.PI/2 * 115/120;
				orbit.addEventListener( 'change', render );
				control = new THREE.TransformControls( camera, renderer.domElement );
				control.addEventListener( 'change', render );
				control.addEventListener( 'dragging-changed', function ( event ) {
					orbit.enabled = !event.value;
				} );	
				
			var groundTex = new THREE.TextureLoader().load( 'tex/ground-tex.jpg', render );
				groundTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
				groundTex.wrapS = THREE.RepeatWrapping; 
				groundTex.wrapT = THREE.RepeatWrapping;
				groundTex.repeat.set( 100, 100 ); 
			var geometry = new THREE.CircleGeometry( 700, 700, 32 );
			var material = new THREE.MeshPhongMaterial( {map:groundTex} );
			var plane = new THREE.Mesh( geometry, material );
			plane.receiveShadow = true;		
			plane.rotation.x=-Math.PI/2;
			plane.position.y=-0;
			scene.add( plane );
				window.addEventListener( 'resize', onWindowResize, false );
				renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);			
			}			
			function onDocumentMouseDown(event){
				event.preventDefault();
				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
				var vector = new THREE.Vector3( mouse.x, mouse.y, 1 ).unproject(camera);;
				var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );						
				var intersects = raycaster.intersectObjects( objects,true );
				if ( intersects.length > 0 ) {					
					SELECTED = intersects[ 0 ].object.name;					
					 for(var i=0;i<objects.length;i++){
						 if(objects[i].name == SELECTED){
								document.getElementById("size").innerHTML = "Size : "+forSize[i];
								control.attach( objects[i]);
								scene.add( control );
						}
					 }
				}
			}					
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
				
			}
			function animate(){
				orbit.update();
				render();
			}
			function render() {
				for(var i=0;i<objects.length;i++){
					if(objects[i].position.y < 0 ){
						objects[i].position.y = 0;
					}
				}
				renderer.render( scene, camera );
			}
$(function (){
	$(".icons-container").on('click',function(e){
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.load('assets/' + models[e.target.id].mtl, function (materials) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('assets/');
    objLoader.load(models[e.target.id].obj, function (object) {		
		objects.push(object);
		object.name = models[e.target.id].name;
		forSize.push(models[e.target.id].size);
		document.getElementById("size").innerHTML = "Size : "+models[e.target.id].size;
		SELECTED = object.name;
		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.castShadow = true;				
		}
	});
        scene.add(object);		
		object.scale.set(1,1,1);
		control.attach( object);
		scene.add( control );
    });
});
	
});	
$(".color").on('click',function(e){
	requestAnimationFrame( animate );
	objects.forEach(function(data){
		if(data.name == SELECTED){
			data.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				var w = child.material.length;
				console.log(w);
				for(var i=0;i<w;i++){	
				 child.material[i].color.setHex('0x' + e.target.id);
				 child.material[i].needsUpdate = true;				 
			}
		}
	});
		}
	});
cancelAnimationFrame( animate );
});
$(".transform").on("click",function(e){
	control.setMode(e.target.id);
});
});			
		
