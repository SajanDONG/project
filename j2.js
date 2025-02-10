let scene, camera, renderer, player, maze;
let clock = new THREE.Clock();
let mazeSize = 10; // Initial maze size (can be modified based on difficulty)
let moveSpeed = 0.1; // Player movement speed

// Start the game
function startGame() {
  init();
  animate();
  createMaze(mazeSize);
  player.position.set(mazeSize / 2, 0.5, mazeSize / 2); // Start player at the center
}

// Initialize Three.js and the scene
function init() {
  // Create the scene
  scene = new THREE.Scene();
  const envMap = cubeTextureLoader.load([
    'bull1.jpg',  // positive X
    'bull3.jpg',  // negative X
    'bull4.jpg',  // positive Y
    'bull2.jpg',  // negative Y
    'bull5.jpg',  // positive Z
    'bull6.jpg'   // negative Z
  ]);
  scene.environment = envMap;
  
  // Load and set the background texture
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('bagh.jpg', function(texture) {
    scene.background = texture;
  });

  // Create camera, renderer, lights, and any other scene setup...
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  
  // Lighting
  const light = new THREE.AmbientLight(0x404040); // Ambient light
  scene.add(light);

  // Player cube
  player = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.5), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
  scene.add(player);
  
  // Camera position
  camera.position.z = mazeSize * 2;
  camera.position.y = 2; // Elevate the camera for a better view
  camera.lookAt(player.position);

  // Event listener for keypresses
  window.addEventListener('keydown', onKeyDown, false);
  window.addEventListener('resize', onWindowResize, false);
}

// Generate the maze
function createMaze(size) {
  maze = new THREE.Group();
  let wallMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });

  // Generate walls (this is a basic generation; you can replace this with a more complex algorithm)
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (Math.random() > 0.7) {
        let wall = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), wallMaterial);
        wall.position.set(i, 1, j); // Position walls randomly in the grid
        maze.add(wall);
      }
    }
  }

  // Add maze to the scene
  scene.add(maze);
}

// Handle keypress for movement (WASD or Arrow keys)
function onKeyDown(event) {
  // Control the player with arrow keys or WASD
  if (event.key === "ArrowUp" || event.key === "w") {
    player.position.z -= moveSpeed;
  }
  if (event.key === "ArrowDown" || event.key === "s") {
    player.position.z += moveSpeed;
  }
  if (event.key === "ArrowLeft" || event.key === "a") {
    player.position.x -= moveSpeed;
  }
  if (event.key === "ArrowRight" || event.key === "d") {
    player.position.x += moveSpeed;
  }

  // Make sure the player stays within the bounds of the maze
  player.position.x = Math.max(0, Math.min(mazeSize - 1, player.position.x));
  player.position.z = Math.max(0, Math.min(mazeSize - 1, player.position.z));
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update camera position to follow the player
  camera.position.x = player.position.x;
  camera.position.z = player.position.z + mazeSize;
  
  // Look at the player
  camera.lookAt(player.position);

  // Render the scene
  let delta = clock.getDelta();
  renderer.render(scene, camera);
}

// Adjust the camera and renderer size when the window is resized
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the game when the page is loaded
window.onload = function() {
  startGame();
};
