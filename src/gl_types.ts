export interface IGlSrv {
  gl: WebGLRenderingContext
  glProgram: WebGLProgram
}

export interface IGlobParam {
  glSrv: IGlSrv | null
  indicesStart: number
  indicesCount: number
}