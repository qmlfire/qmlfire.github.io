import * as THREE from "https://cdn.skypack.dev/three@0.133.1/build/three.module";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls";

// var one = document.getElementById("canvas_wrapper");
// var two = document.getElementById("3d");
// style = window.getComputedStyle(one);
// wdt = style.getPropertyValue('width');
// two.style.width = wdt;

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.IcosahedronGeometry(10, 10);
//new THREE.IcosahedronGeometry(10, 1); // new THREE.SphereGeometry(1.5, 100, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uColor: {
      value: new THREE.Color(0xffffff)
    },
    uTime: {
      value: 0
    }
  },
  vertexShader: `
            // attribute vec2 uv;
            attribute float scale;
            uniform float uTime;
            
            varying vec2 vUv;

            const float PI = 3.1415926535897932384626433832795;

            void main(){
              vUv = uv;

              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              // gl_PointSize = scale * (300.0 / - mvPosition.z);
              gl_PointSize = abs(sin(uTime)) * vUv.x * 4.0;
              gl_Position = projectionMatrix * mvPosition;
              
              // gl_Position.x += sin(position.x + uTime) * 0.1;
              // gl_Position.x += sin(uTime);
              gl_Position.y += tan(position.y + uTime) * 0.01;
              // gl_Position.z += cos(position.z + uTime) * 0.1;

              // gl_Position.x += tan(position.x + uTime) * 0.1;
              // gl_Position.y += tan(position.y + uTime) * 0.1;
              // gl_Position.z += tan(position.z + uTime) * 0.1;
            }
              `,
  fragmentShader: `
            vec3 uColor;

            varying vec2 vUv;
            uniform float uTime;
            vec3 colorA = vec3(0.937,0.859,0.);
            vec3 colorB = vec3(0.008,0.933,0.145);


            void main(){
              // circle
              if(length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;

              //gl_FragColor = vec4(vUv.x, vUv.y, 1.0, vUv.x);
              uColor = mix(colorA, colorB, sin(uTime));
              gl_FragColor = vec4(uColor, 1.0);
            }
              `
});
const particles = new THREE.Points(geometry, shaderMaterial);
scene.add(particles);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};


var overlay = document.getElementById("overlay");
overlay.style.width = sizes.width;
console.log(overlay.style.width)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 10;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// Events
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // update material
  shaderMaterial.uniforms.uTime.value = elapsedTime;

  particles.rotation.x = Math.sin(elapsedTime * 0.05);
  particles.rotation.y = elapsedTime * 0.07;
  particles.rotation.z = elapsedTime * 0.04;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
