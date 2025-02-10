let scene, camera, renderer, player, maze;
let clock = new THREE.Clock();
let mazeSize = 10; // Initial maze size (can be modified based on difficulty)
let moveSpeed = 0.1; // Player movement speed

// Start the game
function startGame() {
  init();
  animate();
  generateMaze(mazeSize);
  player.position.set(mazeSize / 2, 0.5, mazeSize / 2); // Start player at the center
}

// Initialize Three.js and the scene
function init() {
  scene = new THREE.Scene();

  // Camera: Perspective view
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Renderer
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

// Generate the maze using recursive backtracking
function generateMaze(size) {
  maze = new THREE.Group();
  let wallMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });
  let mazeArray = [];

  // Initialize maze grid
  for (let i = 0; i < size; i++) {
    mazeArray[i] = [];
    for (let j = 0; j < size; j++) {
      mazeArray[i][j] = { visited: false, walls: { n: true, s: true, e: true, w: true } };
    }
  }

  function carveMaze(x, y) {
    mazeArray[x][y].visited = true;
    
    // Directions to explore
    let directions = [{dx: 0, dy: -1, wall: 'n'}, {dx: 0, dy: 1, wall: 's'}, {dx: -1, dy: 0, wall: 'w'}, {dx: 1, dy: 0, wall: 'e'}];
    directions = shuffle(directions); // Shuffle directions to randomize the path

    for (let dir of directions) {
      let nx = x + dir.dx;
      let ny = y + dir.dy;

      if (nx >= 0 && nx < size && ny >= 0 && ny < size && !mazeArray[nx][ny].visited) {
        mazeArray[x][y].walls[dir.wall] = false;
        mazeArray[nx][ny].walls[oppositeWall(dir.wall)] = false;

        // Recursively carve the maze
        carveMaze(nx, ny);
      }
    }
  }

  function oppositeWall(wall) {
    switch (wall) {
      case 'n': return 's';
      case 's': return 'n';
      case 'e': return 'w';
      case 'w': return 'e';
    }
  }

  // Shuffle array using Fisher-Yates algorithm
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Carve maze from the center
  carveMaze(Math.floor(size / 2), Math.floor(size / 2));

  // Create walls based on the maze data
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let cell = mazeArray[i][j];
      if (cell.walls.n) {
        createWall(i, j - 0.5, 1, 2); // Top wall
      }
      if (cell.walls.s) {
        createWall(i, j + 0.5, 1, 2); // Bottom wall
      }
      if (cell.walls.e) {
        createWall(i + 0.5, j, 1, 2); // Right wall
      }
      if (cell.walls.w) {
        createWall(i - 0.5, j, 1, 2); // Left wall
      }
    }
  }

  scene.add(maze);
}

// Create wall helper function
function createWall(x, y, width, height) {
  let wallMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });
  let wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, 1), wallMaterial);
  wall.position.set(x, height / 2, y);
  maze.add(wall);
}

// Update camera to smoothly follow the player
function updateCamera() {
  let targetPosition = new THREE.Vector3(player.position.x, player.position.y + 2, player.position.z + mazeSize);
  camera.position.lerp(targetPosition, 0.1); // Smooth transition to target position
  camera.lookAt(player.position);
}

// Handle keypress for movement (WASD or Arrow keys)
function onKeyDown(event) {
  let nextX = player.position.x;
  let nextZ = player.position.z;

  if (event.key === "ArrowUp" || event.key === "w") {
    nextZ -= moveSpeed;
  }
  if (event.key === "ArrowDown" || event.key === "s") {
    nextZ += moveSpeed;
  }
  if (event.key === "ArrowLeft" || event.key === "a") {
    nextX -= moveSpeed;
  }
  if (event.key === "ArrowRight" || event.key === "d") {
    nextX += moveSpeed;
  }

  if (!isColliding(nextX, nextZ)) {
    player.position.x = nextX;
    player.position.z = nextZ;
  }

  // Keep player inside bounds
  player.position.x = Math.max(0, Math.min(mazeSize - 1, player.position.x));
  player.position.z = Math.max(0, Math.min(mazeSize - 1, player.position.z));
}

// Check for collision with walls
function isColliding(x, z) {
  let playerBox = new THREE.Box3().setFromObject(player);

  // Check each wall for collision
  for (let wall of maze.children) {
    let wallBox = new THREE.Box3().setFromObject(wall);
    if (playerBox.intersectsBox(wallBox)) {
      return true;
    }
  }
  return false;
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update camera position to follow the player smoothly
  updateCamera();

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
