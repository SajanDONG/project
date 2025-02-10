// app.js
let scene, camera, renderer, model;

// Initialize the 3D scene
function init() {
  scene = new THREE.Scene();

  // Set up the camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Set up the renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('3dCanvas') });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Set up lighting
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  // Load the 3D model
  const loader = new THREE.GLTFLoader();
  loader.load('assets/scene.gltf', (gltf) => {
    model = gltf.scene;
    scene.add(model);
  }, undefined, (error) => {
    console.error('Error loading model:', error);
  });

  // Handle resizing
  window.addEventListener('resize', onWindowResize);

  animate();
}

// Resize the canvas when the window is resized
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animate the scene
function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.rotation.y += 0.01; // Rotate the model
  }

  renderer.render(scene, camera);
}

// Start the scene when the page loads
window.onload = init;
