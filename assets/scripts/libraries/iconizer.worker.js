var offscreenCanvas
var [width, height]= [0,0]
function resizeImage(imageBitmap) {
  const ctx = offscreenCanvas.getContext('2d');
  ctx.drawImage(imageBitmap, 0, 0, width, height);
  return offscreenCanvas.convertToBlob();
}
function resizeImageWithWebGL(imageBitmap) {
  const gl = offscreenCanvas.getContext('webgl');

  if (!gl) {
    throw new Error('WebGL not supported');
  }

  const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
          v_texCoord = a_texCoord;
      }
  `;

  const fragmentShaderSource = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform sampler2D u_image;
      void main() {
          gl_FragColor = texture2D(u_image, v_texCoord);
      }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createProgram(gl, vertexShader, fragmentShader);

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord');
  const imageLocation = gl.getUniformLocation(program, 'u_image');

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1
  ]), gl.STATIC_DRAW);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 1,
    1, 1,
    0, 0,
    0, 0,
    1, 1,
    1, 0
  ]), gl.STATIC_DRAW);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageBitmap);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.viewport(0, 0, width, height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(texCoordAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1i(imageLocation, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  return offscreenCanvas.convertToBlob();
}
async function resizeImageWithWebGL2(imageBitmap) {
  const gl = offscreenCanvas.getContext('webgl2');

  // Vertex shader source code
  const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      void main() {
          gl_Position = vec4(a_position, 0.0, 1.0);
          v_texCoord = a_texCoord;
      }
  `;

  // Fragment shader source code
  const fragmentShaderSource = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform sampler2D u_image;
      void main() {
          gl_FragColor = texture2D(u_image, v_texCoord);
      }
  `;

  // Compile shader
  function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  // Create and link program
  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  // Look up where the vertex data needs to go.
  const positionLocation = gl.getAttribLocation(program, "a_position");
  const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

  // Provide texture coordinates for the rectangle.
  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,
  ]), gl.STATIC_DRAW);

  // Create a buffer for the position of the rectangle corners.
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1.0, -1.0,
    1.0, -1.0,
    -1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    1.0, 1.0,
  ]), gl.STATIC_DRAW);

  // Create a texture and put the image in it.
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageBitmap);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, width, height);

  // Clear the canvas
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionLocation);
  gl.enableVertexAttribArray(texCoordLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Bind the texcoord buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

  // Draw the rectangle.
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  // Read the pixels
  const pixels = new Uint8Array(width * height * 4);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

  // Create a new ImageData object
  const imageData = new ImageData(new Uint8ClampedArray(pixels), width, height);

  // Draw the ImageData to an offscreen canvas
  const outputCanvas = new OffscreenCanvas(width, height);
  const outputCtx = outputCanvas.getContext('2d');
  outputCtx.putImageData(imageData, 0, 0);

  // Convert to a blob
  return outputCanvas.convertToBlob();
}


async function resizeImageWithWebGPU(imageBitmap) {
  const context = offscreenCanvas.getContext('webgpu');

  if (!context) {
    throw new Error('WebGPU not supported');
  }

  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();

  const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device: device,
    format: canvasFormat,
    alphaMode: 'premultiplied'
  });

  const vertexShaderCode = `
      @stage(vertex)
      fn main(@location(0) position: vec2<f32>, @location(1) texCoord: vec2<f32>)
          -> @builtin(position) vec4<f32>, @location(0) vec2<f32> {
          return (vec4<f32>(position, 0.0, 1.0), texCoord);
      }
  `;

  const fragmentShaderCode = `
      @stage(fragment)
      fn main(@location(0) texCoord: vec2<f32>, @binding(0) image: texture_2d<f32>)
          -> @location(0) vec4<f32> {
          return textureSample(image, textureSampler(image), texCoord);
      }
  `;

  const shaderModule = device.createShaderModule({
    code: `
          ${vertexShaderCode}
          ${fragmentShaderCode}
      `
  });

  const pipeline = device.createRenderPipeline({
    vertex: {
      module: shaderModule,
      entryPoint: 'main',
      buffers: [{
        arrayStride: 4 * 4,
        attributes: [
          { shaderLocation: 0, offset: 0, format: 'float32x2' },
          { shaderLocation: 1, offset: 2 * 4, format: 'float32x2' }
        ]
      }]
    },
    fragment: {
      module: shaderModule,
      entryPoint: 'main',
      targets: [{ format: canvasFormat }]
    },
    primitive: { topology: 'triangle-list' },
    layout: 'auto'
  });

  const vertices = new Float32Array([
    -1, -1, 0, 1,
    1, -1, 1, 1,
    -1, 1, 0, 0,
    -1, 1, 0, 0,
    1, -1, 1, 1,
    1, 1, 1, 0
  ]);

  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
  });

  device.queue.writeBuffer(vertexBuffer, 0, vertices);

  const texture = device.createTexture({
    size: [imageBitmap.width, imageBitmap.height, 1],
    format: 'rgba8unorm',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
  });

  device.queue.copyExternalImageToTexture(
    { source: imageBitmap },
    { texture: texture },
    [imageBitmap.width, imageBitmap.height, 1]
  );

  const sampler = device.createSampler({
    magFilter: 'linear',
    minFilter: 'linear'
  });

  const bindGroupLayout = pipeline.getBindGroupLayout(0);
  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      { binding: 0, resource: texture.createView() },
      { binding: 1, resource: sampler }
    ]
  });

  const commandEncoder = device.createCommandEncoder();
  const textureView = context.getCurrentTexture().createView();
  const renderPassDescriptor = {
    colorAttachments: [{
      view: textureView,
      loadOp: 'clear',
      clearValue: { r: 0, g: 0, b: 0, a: 0 },
      storeOp: 'store'
    }]
  };

  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  passEncoder.setPipeline(pipeline);
  passEncoder.setVertexBuffer(0, vertexBuffer);
  passEncoder.setBindGroup(0, bindGroup);
  passEncoder.draw(6);
  passEncoder.end();

  device.queue.submit([commandEncoder.finish()]);

  return offscreenCanvas.convertToBlob();
}


// Listen for messages from the main thread
self.onmessage = async function (data) {
  const start = Date.now()
  console.log(data)
  const e = data.data[0]
  const apps = e;
  const resizedImages = {};
  for (let i = 0; i < apps.length; i++) {
    try {
      const response = await fetch(apps[i].icon);
      const blob = await response.blob();
      const imageBitmap = await createImageBitmap(blob);

      const scale = 1//data.data[1]
      width = scale * 60;
      height = width;

      offscreenCanvas = new OffscreenCanvas(width, height);


      const resizedBlob = await resizeImage(imageBitmap);
      resizedImages[apps[i].packageName] = resizedBlob;

      // Log percentage completion
      const progress = ((i + 1) / apps.length) * 100;
      console.log(`Image ${i + 1} processed of ${apps.length}. Progress: ${progress.toFixed(2)}%`);
    } catch (error) {
      console.error('Error processing image:', error);
      return Promise.reject(error);
    }
  }
  console.log(`Finished in ${Date.now() - start}ms`)
  // Send resized images back to the main thread
  postMessage(resizedImages);
};
