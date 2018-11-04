window.onload=function(){
function exportGLTF( input ) {
				var gltfExporter = new THREE.GLTFExporter();
				var options = {
					onlyVisible: true,
					//truncateDrawRange: true,
					binary:true,
					forcePowerOfTwoTextures: true
				};
				gltfExporter.parse( input, function( result ) {
					if ( result instanceof ArrayBuffer ) {
						saveArrayBuffer( result, 'down.glb' );
					} else {
						var output = JSON.stringify( result, null, 2 );
						console.log( output );
						saveString( output, 'scene.gltf' );
					}
				}, options );
			}
			document.getElementById( 'GLB_export' ).addEventListener( 'click', function () {		
				exportGLTF( objects );
			} );
			
			var link = document.createElement( 'a' );
			link.style.display = 'none';
			document.body.appendChild( link ); 
			function save( blob, filename ) {
				link.href = URL.createObjectURL( blob );
				link.download = filename;
				link.click();
			}
			function saveString( text, filename ) {
				save( new Blob( [ text ], { type: 'text/plain' } ), filename );
			}
			function saveArrayBuffer( buffer, filename ) {
				save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
			}
			
}	

	