<svelte:options tag="my-smog" />

<script lang="ts">
	import type { IGlobParam } from './gl_types';
	import { onMount, onDestroy } from 'svelte'
	import { clearGl, init, onChRes, onChTime, onIndicesCountChange, onIndicesStartChange } from './gl'

	const vertShader = `attribute vec4 a_Position;
void main(){
    gl_Position=a_Position;
}`
	const fragShader = `
#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives:enable

uniform float u_time;
uniform vec2 u_resolution;

float snow(vec2 uv,float scale)
{
  float _t=u_time*.05;
  uv.x+=_t/scale;
  uv*=scale;
  vec2 s=floor(uv),f=fract(uv),p;
  float k=40.,d;
  p=.5+.35*sin(8.*fract(sin((s+p+scale)*mat2(2,4,7,6))*6.))-f;
  d=length(p);
  k=min(d,k);
  k=smoothstep(0.,k,sin(f.x+f.y)*.009);
  return k;
}

void main(void)
{
  vec2 uv=(gl_FragCoord.xy*.2-u_resolution.xy)/min(u_resolution.x,u_resolution.y);
  float dd=1.-length(uv);
  uv.x+=sin(u_time*.00003); // speed
  uv.y+=sin(uv.x*1.4)*.2;
  float c=snow(uv,90.)*.3;
  c+=snow(uv,25.)*.5;
  c+=snow(uv,15.)*.8;
  c+=snow(uv,10.);
  c+=snow(uv,10.);
  c+=snow(uv,6.);
  c+=snow(uv,5.);
  vec3 finalColor=(vec3(.2,.2,.2))*c*3.5;
  gl_FragColor=vec4(finalColor,c*0.9);
}`
	export let width: string = '320px'
	export let height: string = '240px'
	export let indicesCount: number = 5
	export let indicesStart: number = 0
	export let time: number = 0
	export let resolutionWH: [number, number] = [320, 240]
	export let canvasEl: HTMLCanvasElement

	let globParam: IGlobParam = {
		glSrv: null,
		indicesStart: indicesStart,
		indicesCount: indicesCount
	}
	let timerTime: NodeJS.Timer

	onMount(() => {
		globParam.glSrv = init(canvasEl, vertShader, fragShader, indicesStart, indicesCount)

		timerTime = setInterval(() => {
      time += 0.03
    }, 16)
	})

	onDestroy(() => {
		clearInterval(timerTime)
		clearGl(globParam)
	})

	$: indicesCount && onIndicesCountChange(globParam)
	$: indicesStart && onIndicesStartChange(globParam)

	$: time && onChTime(globParam, 'u_time', time)
	$: resolutionWH && onChRes(globParam, 'u_resolution', resolutionWH)
</script>

<canvas bind:this={canvasEl} width={width} height={height}></canvas>

<style>
	canvas {
		background-color: black;
	}
</style>