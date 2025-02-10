let scene, camera, renderer, player, maze, moveSpeed, mazeSize;
let clock = new THREE.Clock();

// Initialize maze size based on difficulty
function init() {
  scene = new THREE.Scene();
  
  // Set up the camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(mazeSize / 2, mazeSize / 2, mazeSize * 2);
  camera.lookAt(mazeSize / 2, mazeSize / 2, 0);
  
  // Set up the renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('mazeCanvas') });
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Set up the 3D background
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('path/to/your/background.jpg', function(texture) {
    scene.background = texture;
  });

  // Lighting
  const light = new THREE.AmbientLight(0x404040);
  scene.add(light);

  // Create the maze
  createMaze(mazeSize);
  
  // Create the player
  const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
  const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  player = new THREE.Mesh(playerGeometry, playerMaterial);
  player.position.set(mazeSize / 2, 0.5, mazeSize / 2);
  scene.add(player);

  // Event listeners for player movement and resizing
  window.addEventListener('keydown', onKeyDown, false);
  window.addEventListener('resize', onWindowResize, false);
}

// Maze Generation using Prim's Algorithm
function createMaze(size) {
  maze = new THREE.Group();
  const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => ({ walls: [true, true, true, true] })));

  const startX = Math.floor(Math.random() * size);
  const startY = Math.floor(Math.random() * size);
  grid[startX][startY].walls = [false, false, false, false];

  const walls = [];
  if (startX > 0) walls.push([startX - 1, startY, 1]); 
  if (startX < size - 1) walls.push([startX + 1, startY, 3]); 
  if (startY > 0) walls.push([startX, startY - 1, 2]); 
  if (startY < size - 1) walls.push([startX, startY + 1, 0]); 

  // Prim's algorithm
  while (walls.length > 0) {
    const [x, y, direction] = walls.splice(Math.floor(Math.random() * walls.length), 1)[0];
    const oppositeDirection = (direction + 2) % 4;

    if (grid[x][y].walls[direction]) {
      grid[x][y].walls[direction] = false;
      if (x > 0 && grid[x - 1][y].walls[1]) walls.push([x - 1, y, 1]);
      if (x < size - 1 && grid[x + 1][y].walls[3]) walls.push([x + 1, y, 3]);
      if (y > 0 && grid[x][y - 1].walls[2]) walls.push([x, y - 1, 2]);
      if (y < size - 1 && grid[x][y + 1].walls[0]) walls.push([x, y + 1, 0]);
    }
  }

  // Build walls in the scene
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const cell = grid[x][y];
      const wallHeight = 2;
      const wallThickness = 0.1;

      if (cell.walls[0]) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, 1), wallMaterial);
        wall.position.set(x, wallHeight / 2, y + 0.5);
        maze.add(wall);
      }
      if (cell.walls[1]) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, 1), wallMaterial);
        wall.position.set(x, wallHeight / 2, y - 0.5);
        maze.add(wall);
      }
      if (cell.walls[2]) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(1, wallHeight, wallThickness), wallMaterial);
        wall.position.set(x - 0.5, wallHeight / 2, y);
        maze.add(wall);
      }
      if (cell.walls[3]) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(1, wallHeight, wallThickness), wallMaterial);
        wall.position.set(x + 0.5, wallHeight / 2, y);
        maze.add(wall);
      }
    }
  }

  scene.add(maze);
}

// Player movement logic
function onKeyDown(event) {
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

  // Prevent player from moving through walls
  player.position.x = Math.max(0, Math.min(mazeSize - 1, player.position.x));
  player.position.z = Math.max(0, Math.min(mazeSize - 1, player.position.z));
}

// Adjust camera and renderer size when the window is resized
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update camera position
  camera.position.x = player.position.x;
  camera.position.z = player.position.z + mazeSize;
  camera.lookAt(player.position);
  
  renderer.render(scene, camera);
}

// Start game logic when button is clicked
window.onload = function() {
  document.getElementById('startBtn').addEventListener('click', function() {
    mazeSize = parseInt(document.getElementById('difficulty').value);
    moveSpeed = mazeSize <= 10 ? 0.1 : (mazeSize <= 20 ? 0.08 : 0.05);
    init();
    animate();
  });
};
