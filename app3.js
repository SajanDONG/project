let scene, camera, renderer, player, maze;
let clock = new THREE.Clock();
let mazeSize = 10; // Default size
let moveSpeed = 0.1;

// Event listener for difficulty selection and game start
document.getElementById("startBtn").addEventListener("click", () => {
  mazeSize = parseInt(document.getElementById("difficulty").value);
  document.getElementById("menu").style.display = "none"; // Hide menu
  startGame(mazeSize);
});

// Start the game
function startGame(size) {
  init(size);
  createMaze(size);
  animate();
  player.position.set(size / 2, 0.5, size / 2);
}

// Initialize Three.js and the scene
function init(size) {
  scene = new THREE.Scene();

  // Load background texture
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("bagh.jpg", (texture) => {
    scene.background = texture;
  });

  // Set up camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(size / 2, 5, size + 5);
  camera.lookAt(size / 2, 0, size / 2);

  // Set up renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("gameArea").appendChild(renderer.domElement);

  // Lighting
  const light = new THREE.AmbientLight(0x404040);
  scene.add(light);

  // Create player
  player = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.5), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
  scene.add(player);

  // Event listeners
  window.addEventListener("keydown", onKeyDown, false);
  window.addEventListener("resize", onWindowResize, false);
}

// Generate the maze
function createMaze(size) {
  maze = new THREE.Group();
  let wallMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });

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

// Player movement
function onKeyDown(event) {
  let newX = player.position.x;
  let newZ = player.position.z;

  if (event.key === "ArrowUp" || event.key === "w") newZ -= moveSpeed;
  if (event.key === "ArrowDown" || event.key === "s") newZ += moveSpeed;
  if (event.key === "ArrowLeft" || event.key === "a") newX -= moveSpeed;
  if (event.key === "ArrowRight" || event.key === "d") newX += moveSpeed;

  // Keep the player inside the maze boundaries
  player.position.x = Math.max(0, Math.min(mazeSize - 1, newX));
  player.position.z = Math.max(0, Math.min(mazeSize - 1, newZ));
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  camera.lookAt(player.position);
  renderer.render(scene, camera);
}

// Handle window resizing
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
