var cena = new THREE.Scene();
var meuCanvas = document.getElementById("meuCanvas");
var camara = new THREE.PerspectiveCamera(70, meuCanvas.offsetWidth / meuCanvas.offsetHeight, 0.1, 500);
var renderer = new THREE.WebGLRenderer({ canvas: meuCanvas, antialias: true });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(meuCanvas.offsetWidth, meuCanvas.offsetHeight, false);

renderer.shadowMap.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.physicallyCorrectLights = true;
renderer.toneMappingExposure = 1.8;

camara.position.x = 0;
camara.position.y = 1;
camara.position.z = 2;
camara.lookAt(0, 0, 0);

const backgroundColor = new THREE.Color("white");
cena.background = backgroundColor;

var luzAmbiente = new THREE.AmbientLight("white");
luzAmbiente.intensity = 1;
luzAmbiente.position.set(0, 0, 0);
cena.add(luzAmbiente);

cor1 = new THREE.Color(0xffe7e7);
var luzPonto1 = new THREE.PointLight(cor1);
luzPonto1.intensity = 0.6;
luzPonto1.position.set(0, 5, 2);
cena.add(luzPonto1);
luzPonto1.shadow.mapSize.width = 4096;
luzPonto1.shadow.mapSize.height = 4096;
luzPonto1.castShadow = true;
luzPonto1.shadow.bias = -0.001;
luzPonto1.power = 10;

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 2, 1);
directionalLight.castShadow = true;
cena.add(directionalLight);
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
directionalLight.shadow.bias = -0.001;

var controlos = new THREE.OrbitControls(camara, renderer.domElement);


controlos.maxDistance = 2.5;
controlos.minDistance = 1.5;
controlos.enablePan = false;
controlos.maxPolarAngle = Math.PI / (2 + 0.1);

var carregador = new THREE.GLTFLoader();
var relogio = new THREE.Clock();
var controlos = [];
var wood_material = null;

carregador.load("móvel.gltf", function (gltf) {
  misturador = new THREE.AnimationMixer(gltf.scene);

  gltf.scene.traverse(function (x) {
    if (x instanceof THREE.Light) x.visible = false;
    if (x.isMesh) {
      x.castShadow = true;
      x.receiveShadow = true;

      //Obter o material "wood"
      if (x.material.name == "wood" && wood_material == null) {
        wood_material = x.material;
      }

      if (x.name == "Plane") {
        x.castShadow = false;
      }
    }
    if (x.name.includes("Ctrl")) {
      x.castShadow = false;
      x.receiveShadow = false;
      controlos.push(x);
    }
    porta1Clipe = THREE.AnimationClip.findByName(gltf.animations, "Porta1Action");
    porta1 = misturador.clipAction(porta1Clipe);

    porta1ClipeFechar = THREE.AnimationClip.findByName(gltf.animations, "Porta1ActionReverse");
    porta1Fechar = misturador.clipAction(porta1ClipeFechar);


    porta2Clipe = THREE.AnimationClip.findByName(gltf.animations, "Porta2Action");
    porta2 = misturador.clipAction(porta2Clipe);

    porta2ClipeFechar = THREE.AnimationClip.findByName(gltf.animations, "Porta2ActionReverse");
    porta2Fechar = misturador.clipAction(porta2ClipeFechar);


    gaveta1Clipe = THREE.AnimationClip.findByName(gltf.animations, "Gaveta1Action");
    gaveta1 = misturador.clipAction(gaveta1Clipe);

    gaveta1ClipeFechar = THREE.AnimationClip.findByName(gltf.animations, "Gaveta1ActionReverse");
    gaveta1Fechar = misturador.clipAction(gaveta1ClipeFechar);


    gaveta2Clipe = THREE.AnimationClip.findByName(gltf.animations, "Gaveta2Action");
    gaveta2 = misturador.clipAction(gaveta2Clipe);

    gaveta2ClipeFechar = THREE.AnimationClip.findByName(gltf.animations, "Gaveta2ActionReverse");
    gaveta2Fechar = misturador.clipAction(gaveta2ClipeFechar);


    gaveta3Clipe = THREE.AnimationClip.findByName(gltf.animations, "Gaveta3Action");
    gaveta3 = misturador.clipAction(gaveta3Clipe);

    gaveta3ClipeFechar = THREE.AnimationClip.findByName(gltf.animations, "Gaveta3ActionReverse");
    gaveta3Fechar = misturador.clipAction(gaveta3ClipeFechar);

  });
  cena.add(gltf.scene);
  animar();
  //console.log(controlos);
  //console.log(wood_material);
});

ultimo_btn = 2;
function alterarTextura(button) {
  if (ultimo_btn == button) {
    //Se a textura pretendida já está a ser exibida
    return;
  }
  ultimo_btn = button;

  if (button == 0) {
    wood_material.map = new THREE.TextureLoader().load("Texture/image_texture_dark.jpg");
    document.getElementById("btn_txt_0").style.border = "1px solid black";
    document.getElementById("btn_txt_1").style.border = "";
    document.getElementById("btn_txt_2").style.border = "";
  }
  if (button == 1) {
    wood_material.map = new THREE.TextureLoader().load("Texture/image_texture_red.jpg");
    document.getElementById("btn_txt_1").style.border = "1px solid black";
    document.getElementById("btn_txt_0").style.border = "";
    document.getElementById("btn_txt_2").style.border = "";
  }
  if (button == 2) {
    wood_material.map = new THREE.TextureLoader().load("Texture/image_texture_light.jpg");
    document.getElementById("btn_txt_2").style.border = "1px solid black";
    document.getElementById("btn_txt_1").style.border = "";
    document.getElementById("btn_txt_0").style.border = "";
  }
}

function alterarBackground(corHex) {
  cena.getObjectByName("Plane").material.color.setHex(corHex);
}

var raycastar = new THREE.Raycaster();
var rato = new THREE.Vector2();

window.addEventListener("click", interacao3D);

function interacao3D(evento) {
  let canvasBounds = this.renderer.getContext().canvas.getBoundingClientRect();

  rato.x = ((evento.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1;
  rato.y = -((evento.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1;

  pegarPrimeiro(rato, camara);
}

function pegarPrimeiro() {
  raycastar.setFromCamera(rato, camara);
  var intersetados = raycastar.intersectObjects(controlos);

  if (intersetados.length > 0) {
    console.log("Detetou CLICK de " + intersetados[0].object.name);
    if (intersetados[0].object.name == "Ctrl_Porta1") {
      if (!porta1Fechar.isRunning() || porta1Fechar.paused) {
        porta1Fechar.stop();
        porta1.setLoop(THREE.LoopOnce);
        porta1.clampWhenFinished = true;
        porta1.timeScale = 2.5;
        porta1.play();
      }
      if (!porta1.isRunning() || porta1.paused) {
        porta1.stop();
        porta1Fechar.setLoop(THREE.LoopOnce);
        porta1Fechar.clampWhenFinished = true;
        porta1Fechar.timeScale = 2.5;
        porta1Fechar.play();
      }
    }
    if (intersetados[0].object.name == "Ctrl_Porta2") {
      if (!porta2Fechar.isRunning() || porta2Fechar.paused) {
        porta2Fechar.stop();
        porta2.setLoop(THREE.LoopOnce);
        porta2.clampWhenFinished = true;
        porta2.timeScale = 2.5;
        porta2.play();
      }
      if (!porta2.isRunning() || porta2.paused) {
        porta2.stop();
        porta2Fechar.setLoop(THREE.LoopOnce);
        porta2Fechar.clampWhenFinished = true;
        porta2Fechar.timeScale = 2.5;
        porta2Fechar.play();
      }
    }
    if (intersetados[0].object.name == "Ctrl_Gaveta1") {
      if (!gaveta1Fechar.isRunning() || gaveta1Fechar.paused) {
        gaveta1Fechar.stop();
        gaveta1.setLoop(THREE.LoopOnce);
        gaveta1.clampWhenFinished = true;
        gaveta1.timeScale = 2.5;
        gaveta1.play();
      }
      if (!gaveta1.isRunning() || gaveta1.paused) {
        gaveta1.stop();
        gaveta1Fechar.setLoop(THREE.LoopOnce);
        gaveta1Fechar.clampWhenFinished = true;
        gaveta1Fechar.timeScale = 2.5;
        gaveta1Fechar.play();
      }
    }
    if (intersetados[0].object.name == "Ctrl_Gaveta2") {
      if (!gaveta2Fechar.isRunning() || gaveta2Fechar.paused) {
        gaveta2Fechar.stop();
        gaveta2.setLoop(THREE.LoopOnce);
        gaveta2.clampWhenFinished = true;
        gaveta2.timeScale = 2.5;
        gaveta2.play();
      }
      if (!gaveta2.isRunning() || gaveta2.paused) {
        gaveta2.stop();
        gaveta2Fechar.setLoop(THREE.LoopOnce);
        gaveta2Fechar.clampWhenFinished = true;
        gaveta2Fechar.timeScale = 2.5;
        gaveta2Fechar.play();
      }
    }
    if (intersetados[0].object.name == "Ctrl_Gaveta3") {
      if (!gaveta3Fechar.isRunning() || gaveta3Fechar.paused) {
        gaveta3Fechar.stop();
        gaveta3.setLoop(THREE.LoopOnce);
        gaveta3.clampWhenFinished = true;
        gaveta3.timeScale = 2.5;
        gaveta3.play();
      }
      if (!gaveta3.isRunning() || gaveta3.paused) {
        gaveta3.stop();
        gaveta3Fechar.setLoop(THREE.LoopOnce);
        gaveta3Fechar.clampWhenFinished = true;
        gaveta3Fechar.timeScale = 2.5;
        gaveta3Fechar.play();
      }
    }
  }
}

document.getElementById("btn_max").onclick = function () {
  console.log("Detetou click no btn_max");
  luzAmbiente.intensity = 1.5;
  luzPonto1.power = 15;

  document.getElementById("btn_max").style.border = "2px dotted gray";
  document.getElementById("btn_max").style.backgroundColor = "#bdbdbd";

  document.getElementById("btn_medio").style.border = "0px";
  document.getElementById("btn_medio").style.backgroundColor = "";

  document.getElementById("btn_min").style.border = "0px";
  document.getElementById("btn_min").style.backgroundColor = "";

};

document.getElementById("btn_medio").onclick = function () {
  console.log("Detetou click no btn_medio");
  luzAmbiente.intensity = 1;
  luzPonto1.power = 10;

  document.getElementById("btn_medio").style.border = "2px dotted gray";
  document.getElementById("btn_medio").style.backgroundColor = "#bdbdbd";

  document.getElementById("btn_max").style.border = "0px";
  document.getElementById("btn_max").style.backgroundColor = "";

  document.getElementById("btn_min").style.border = "0px";
  document.getElementById("btn_min").style.backgroundColor = "";
};

document.getElementById("btn_min").onclick = function () {
  console.log("Detetou click no btn_min");
  luzAmbiente.intensity = 0.5;
  luzPonto1.power = 5;

  document.getElementById("btn_min").style.border = "2px dotted gray";
  document.getElementById("btn_min").style.backgroundColor = "#bdbdbd";

  document.getElementById("btn_medio").style.border = "0px";
  document.getElementById("btn_medio").style.backgroundColor = "";

  document.getElementById("btn_max").style.border = "0px";
  document.getElementById("btn_max").style.backgroundColor = "";

};

aux = 1;
document.getElementById("btn_controlos").onclick = function () {
  console.log("Detetou click no btn_controlos");
  for (let i = 0; i < controlos.length; i++) {
    controlos[i].visible = !controlos[i].visible;
  }
  if (aux == 1) {
    document.getElementById("btn_controlos").style.backgroundImage = "url('CanvasBotoes/eye2.svg')";
  } else {
    document.getElementById("btn_controlos").style.backgroundImage = "url('CanvasBotoes/eye.svg')";
    aux = 2;
  }
  aux--;
};

function animar() {
  renderer.setSize(meuCanvas.offsetWidth, meuCanvas.offsetHeight, false);
  requestAnimationFrame(animar);
  misturador.update(relogio.getDelta());
  renderer.render(cena, camara);
  cena.getObjectByName("Ctrl_Porta1").lookAt(camara.position);
  cena.getObjectByName("Ctrl_Porta2").lookAt(camara.position);
  cena.getObjectByName("Ctrl_Gaveta1").lookAt(camara.position);
  cena.getObjectByName("Ctrl_Gaveta2").lookAt(camara.position);
  cena.getObjectByName("Ctrl_Gaveta3").lookAt(camara.position);
}

