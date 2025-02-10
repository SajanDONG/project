let scene, camera, renderer, player, maze;
let clock = new THREE.Clock();

// Start the game
function startGame() {
  init();
  animate();
}

let mouseX = 0, mouseY = 0;
let sensitivity = 0.1;  // Adjust sensitivity for smoother/rougher movement
let rotationY = 0; // Store the rotation in variables to update incrementally
let rotationX = 0;

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

  // Apply rotation based on mouse movement with sensitivity adjustment
  rotationY = mouseX * Math.PI * sensitivity; // Rotate around the Y-axis (left-right)
  rotationX = -mouseY * Math.PI / 2 * sensitivity; // Rotate around the X-axis (up-down)

  // Clamp the vertical rotation to prevent flipping upside-down
  rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationX));
}

// Update function to apply the rotation to the camera
function updateCameraRotation() {
  camera.rotation.y = rotationY;  // Apply horizontal rotation (left-right)
  camera.rotation.x = rotationX;  // Apply vertical rotation (up-down)
}

// Player movement logic
function onKeyDown(event) {
  let speed = 0.1;
  if (event.key === "ArrowUp" || event.key === "w") {
    player.position.z -= speed;
  }
  if (event.key === "ArrowDown" || event.key === "s") {
    player.position.z += speed;
  }
  if (event.key === "ArrowLeft" || event.key === "a") {
    player.position.x -= speed;
  }
  if (event.key === "ArrowRight" || event.key === "d") {
    player.position.x += speed;
  }

  // Update camera position to follow the player
  camera.position.set(player.position.x, player.position.y + 1, player.position.z + 2);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  let delta = clock.getDelta();
  updateCameraRotation();

  // Set the camera's position to the player's position, and offset it slightly behind
  camera.position.set(player.position.x, player.position.y + 1, player.position.z + 2);

  // Render the scene from the camera's perspective
  renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Generate the maze
function createMaze(size) {
  maze = new THREE.Group();
  let wallMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });

  // Create the maze walls (this is a placeholder for maze generation logic)
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (Math.random() > 0.7) {
        let wall = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), wallMaterial);
        wall.position.set(i, 1, j);
        maze.add(wall);
      }
    }
  }

  scene.add(maze);
}
