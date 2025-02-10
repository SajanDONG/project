let mouseX = 0, mouseY = 0;
let sensitivity = 0.1;  // Adjust sensitivity for smoother/rougher movement

// Initialize Three.js
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Maze dimensions
  const mazeSize = 10;

  // Create the maze
  createMaze(mazeSize);
  
  // Set up player (a simple cube for the player)
  player = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.5), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
  player.position.set(mazeSize / 2, 0.5, mazeSize / 2);
  scene.add(player);

  // Set the camera position
  camera.position.set(player.position.x, player.position.y + 1, player.position.z + 2);

  // Add light
  const light = new THREE.AmbientLight(0x404040);
  scene.add(light);

  // Event listeners
  window.addEventListener('keydown', onKeyDown, false);
  window.addEventListener('mousemove', onMouseMove, false);
}

// Mouse move handler to track cursor movement
function onMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;  // Normalize to range [-1, 1]
  mouseY = (event.clientY / window.innerHeight) * 2 - 1; // Normalize to range [-1, 1]

  // Apply rotation based on mouse movement
  camera.rotation.y = mouseX * Math.PI; // Rotate around the Y-axis (left-right)
  camera.rotation.x = -mouseY * Math.PI / 2; // Rotate around the X-axis (up-down)

  // Clamp the vertical rotation to prevent flipping upside-down
  camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
}

// Player movement logic
function onKeyDown(event) {
  if (event.key === "ArrowUp" || event.key === "w") {
    player.position.z -= 0.1;
  }
  if (event.key === "ArrowDown" || event.key === "s") {
    player.position.z += 0.1;
  }
  if (event.key === "ArrowLeft" || event.key === "a") {
    player.position.x -= 0.1;
  }
  if (event.key === "ArrowRight" || event.key === "d") {
    player.position.x += 0.1;
  }

  // Update camera position to follow the player
  camera.position.set(player.position.x, player.position.y + 1, player.position.z + 2);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);  // Keep calling animate() to render the scene
  
  camera.lookAt(player.position);  // Make the camera always look at the player
  renderer.render(scene, camera);  // Render the scene from the camera's perspective
}

window.onload = function() {
  init();
  animate();
};
