import type { IGlobParam, IGlSrv } from "./gl_types"

function init (canvas: HTMLCanvasElement, vertexShader: string, fragmentShader: string, indicesStart: number, indicesCount: number): IGlSrv {
  //获取webgl上下文
  const gl = canvas.getContext('webgl');
  const vertShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertShader, vertexShader);
  gl.compileShader(vertShader);
  const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragShader, fragmentShader);
  gl.compileShader(fragShader);
  const glProgram = gl.createProgram();
  gl.attachShader(glProgram, vertShader);
  gl.attachShader(glProgram, fragShader);
  gl.linkProgram(glProgram);
  gl.useProgram(glProgram);
  const a_PointSize = gl.getAttribLocation(glProgram,'a_PointSize');
  gl.vertexAttrib1f(a_PointSize,30.0);
  //1.创建缓冲区对象
  const vertexBuffer = gl.createBuffer();
  // 2.绑定缓冲区对象（表明了缓冲区对象的用途）
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // 3.向缓冲区对象中写入数据
  const tempData=new Float32Array([
      -1, -1, 
      -1, 1,
      1, 1,
      1, -1,
      -1, -1
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, tempData, gl.STATIC_DRAW);
  // 4.获取变量存储位置
  const a_Position = gl.getAttribLocation(glProgram, 'a_Position');
  // 5.把缓冲区对象分配给a_Position变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  // 6.连接缓冲区对象和a_Position变量
  gl.enableVertexAttribArray(a_Position);
  gl.drawArrays(gl.TRIANGLE_STRIP, indicesStart, indicesCount);
  //gl.drawArrays(gl.POINTS, 0, 3);

  return {
    gl,
    glProgram,
  }
}

function onIndicesCountChange (globParam: IGlobParam) {
  const { glSrv, indicesCount, indicesStart } = globParam
  if (!glSrv || !glSrv.gl) return
  glSrv.gl.drawArrays(glSrv.gl.TRIANGLE_STRIP, indicesStart, indicesCount);
}

function onIndicesStartChange (globParam: IGlobParam) {
  const { glSrv, indicesCount, indicesStart } = globParam
  if (!glSrv || !glSrv.gl) return
  glSrv.gl.drawArrays(glSrv.gl.TRIANGLE_STRIP, indicesStart, indicesCount);
}

function onChangeUniform<T>(globParam: IGlobParam, valueName: string, newVal: T, unifFn: (gl: WebGLRenderingContext, uniform: WebGLUniformLocation, val: T) => void) {
  const { glSrv, indicesCount, indicesStart } = globParam
  if (!glSrv || !glSrv.gl) return
  const uniformVal = glSrv.gl.getUniformLocation(glSrv.glProgram, valueName);
  unifFn(glSrv.gl, uniformVal, newVal)
  glSrv.gl.drawArrays(glSrv.gl.TRIANGLE_STRIP, indicesStart, indicesCount);
}

function onChTime(globParam: IGlobParam, valueName: string, newVal: number) {
  onChangeUniform<number>(globParam, valueName, newVal, (gl: WebGLRenderingContext, uniform: WebGLUniformLocation, val: number) => {
    gl.uniform1f(uniform, val);
  })
}
function onChRes(globParam: IGlobParam, valueName: string, newVal: [number, number]) {
  onChangeUniform<[number, number]>(globParam, valueName, newVal, (gl: WebGLRenderingContext, uniform: WebGLUniformLocation, val: [number, number]) => {
    gl.uniform2fv(uniform, val);
  })
}

function clearGl(globParam: IGlobParam) {
  const { glSrv } = globParam
  if (!glSrv || !glSrv.gl) return
  glSrv.gl.deleteProgram(glSrv.glProgram)
}

export {
  init,
  onIndicesCountChange,
  onIndicesStartChange,
  onChTime,
  onChRes,
  clearGl
}