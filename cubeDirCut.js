// Declare global variables for scene, camera, renderer, and cube
let scene, camera, renderer, cube;

// Initialize Three.js scene, camera, renderer, and objects
function init() {
  // Create a new scene
  scene = new THREE.Scene();

  // Initialize camera with field of view, aspect ratio, and near/far clipping planes
  camera = new THREE.PerspectiveCamera(
    75,
    container.innerWidth / container.innerHeight,
    0.1,
    1000
  );

  // Create renderer and set its size
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.innerWidth, container.innerHeight);

  // Append renderer to HTML container
  document.getElementById('three-container').appendChild(renderer.domElement);

  // Create geometry for the cube
  const geometry = new THREE.BoxGeometry();

  // Create material for the cube and set its color
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  // Create mesh by combining geometry and material
  cube = new THREE.Mesh(geometry, material);

  // Add the cube to the scene
  scene.add(cube);

  // Position camera on the z-axis
  camera.position.z = 5;

  // Start animation loop
  animate();
}

// Animation loop
function animate() {
  // Request next animation frame, making this function recursive
  requestAnimationFrame(animate);

  // Increment cube rotation for spinning effect
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Render the scene from the perspective of the camera
  renderer.render(scene, camera);
}

// Call init function to kick things off
init();
