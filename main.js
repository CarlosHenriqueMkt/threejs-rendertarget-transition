import * as THREE from 'three';

// Basic setup
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Create render targets for each scene
const renderTarget1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
const renderTarget2 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

// Scene 1
const scene1 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera1.position.z = 5;
const geometry1 = new THREE.BoxGeometry();
const material1 = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue
const cube1 = new THREE.Mesh(geometry1, material1);
scene1.add(cube1);

// Scene 2
const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera2.position.z = 5;
const geometry2 = new THREE.BoxGeometry();
const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green
const cube2 = new THREE.Mesh(geometry2, material2);
scene2.add(cube2);

// Quad to display the render targets
const quadGeometry = new THREE.PlaneGeometry(2, 2);
const quadMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTexture: { value: null }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D uTexture;
        varying vec2 vUv;
        void main() {
            gl_FragColor = texture2D(uTexture, vUv);
        }
    `
});
const quadMesh = new THREE.Mesh(quadGeometry, quadMaterial);
const screenScene = new THREE.Scene();
const screenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
screenScene.add(quadMesh);

// Initial render target
let currentRenderTarget = renderTarget1;

// Render function
function render() {
    // Render Scene 1 to its render target
    renderer.setRenderTarget(renderTarget1);
    renderer.render(scene1, camera1);

    // Render Scene 2 to its render target
    renderer.setRenderTarget(renderTarget2);
    renderer.render(scene2, camera2);

    // Render the selected render target to the screen
    quadMaterial.uniforms.uTexture.value = currentRenderTarget.texture;
    renderer.setRenderTarget(null);
    renderer.render(screenScene, screenCamera);

    requestAnimationFrame(render);
}

// Event listeners for buttons
document.getElementById('scene1Button').addEventListener('click', () => {
    currentRenderTarget = renderTarget1;
});

document.getElementById('scene2Button').addEventListener('click', () => {
    currentRenderTarget = renderTarget2;
});

// Start the rendering loop
render();

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera1.aspect = width / height;
    camera1.updateProjectionMatrix();
    camera2.aspect = width / height;
    camera2.updateProjectionMatrix();
    renderTarget1.setSize(width, height);
    renderTarget2.setSize(width, height);
});
