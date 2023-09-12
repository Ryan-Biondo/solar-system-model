import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(1200, 1000);
renderer.shadowMap.enabled = true; // Enable Shadow
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Shadow type
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load('./background.jpg');
scene.background = backgroundTexture;

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunTexture = textureLoader.load('./sun.jpg');
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.castShadow = true; // Enable Shadow Casting
scene.add(sun);

// Create Earth
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthTexture = textureLoader.load('./earth.jpg');
const earthMaterial = new THREE.MeshPhongMaterial({
  // Changed to MeshPhongMaterial
  map: earthTexture,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.castShadow = true; // Enable Shadow Casting
earth.receiveShadow = true; // Enable Shadow Receiving
earth.position.set(10, 0, 0);
scene.add(earth);

// Create Moon
const moonGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const moonTexture = textureLoader.load('./moon.jpg');
const moonMaterial = new THREE.MeshPhongMaterial({
  // Changed to MeshPhongMaterial
  map: moonTexture,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.castShadow = true; // Enable Shadow Casting
moon.receiveShadow = true; // Enable Shadow Receiving
scene.add(moon);

// Lighting
const sunLight = new THREE.PointLight(0xffffff, 2000, 0); // 0 as the third argument makes the light affect all objects
// sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 512; // default is 512
sunLight.shadow.mapSize.height = 512; // default is 512
sunLight.shadow.camera.near = 0.5; // default is 0.5
sunLight.shadow.camera.far = 500; // default is 500

sunLight.position.set(0, 0, 0); // make sure the light is at the center
scene.add(sunLight);

const controls = new OrbitControls(camera, renderer.domElement);

document.addEventListener('keydown', function (event) {
  switch (event.code) {
    case 'KeyW':
      camera.position.z -= 1;
      break;
    case 'KeyS':
      camera.position.z += 1;
      break;
    case 'KeyA':
      camera.position.x -= 1;
      break;
    case 'KeyD':
      camera.position.x += 1;
      break;
    case 'ArrowUp':
      camera.position.y += 1;
      break;
    case 'ArrowDown':
      camera.position.y -= 1;
      break;
    default:
      break;
  }
});

let sunSpeed = 0.001; // Set the speed of the large sphere's rotation

document.getElementById('pauseButton').addEventListener('click', function () {
  sunSpeed = 0;
});

document.getElementById('speedUpButton').addEventListener('click', function () {
  sunSpeed += 0.001;
});

document
  .getElementById('slowDownButton')
  .addEventListener('click', function () {
    if (sunSpeed > 0) {
      sunSpeed -= 0.001;
    }
  });

let earthAngle = 0;
const earthOrbitSpeed = sunSpeed * 3.65; // Now much slower than the large sphere's rotation speed
const earthAxisSpeed = sunSpeed * 5 * 2.5; // 25 times faster for axial rotation
const orbitRadius = 20; // Set the distance between the small and large spheres
const earthTilt = 0.1; // Or whatever tilt angle you'd like

let moonAngle = 0;
const moonOrbitSpeed = earthAxisSpeed; // Assuming the moon orbits Earth once every 28 days
function animate() {
  requestAnimationFrame(animate);

  // Set light position to sun's position
  sunLight.position.set(sun.position.x, sun.position.y, sun.position.z);

  // Rotate large sphere only on its axis
  sun.rotation.y += sunSpeed;

  // Update Earth's position to orbit around the Sun
  earth.position.x = sun.position.x + orbitRadius * Math.cos(earthAngle);
  earth.position.y = sun.position.y;
  earth.position.z = sun.position.z + orbitRadius * Math.sin(earthAngle);

  // Apply Earth's orbital tilt
  earth.position.y += earth.position.x * Math.sin(earthTilt); // Add this line

  // Update Moon's position to orbit around Earth
  moon.position.x = earth.position.x + 2 * Math.cos(moonAngle); // 2 is the distance from Earth to Moon
  moon.position.y =
    earth.position.y + 2 * Math.sin(earthTilt) * Math.sin(moonAngle); // Apply the tilt relative to Earth
  moon.position.z = earth.position.z + 2 * Math.sin(moonAngle);

  // Now include the sunSpeed variable in all the speed-affecting lines

  earthAngle -= earthOrbitSpeed * sunSpeed * 1000;
  moonAngle -= moonOrbitSpeed * sunSpeed * 1000;
  earth.rotation.y += earthAxisSpeed * sunSpeed * 1000;
  controls.update();
  renderer.render(scene, camera);
}

animate();
