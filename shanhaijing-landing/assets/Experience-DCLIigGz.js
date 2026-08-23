import{$ as e,$n as t,A as n,An as r,B as i,Bn as a,C as o,Cn as s,Ct as c,D as l,Dn as u,Dt as d,E as f,En as p,F as m,Fn as h,Gn as g,H as _,Hn as v,I as y,In as b,J as x,Jn as S,K as C,Kn as w,L as T,Ln as E,M as D,Mn as ee,N as O,O as k,On as A,Ot as te,P as j,Pn as ne,Q as re,Qn as ie,R as M,Rn as N,Sn as P,T as F,Tn as ae,U as oe,Un as se,V as I,Vn as ce,W as L,Wn as R,X as le,Xn as ue,Yn as de,Z as fe,Zn as z,_n as pe,_t as me,a as B,an as he,at as ge,b as V,bt as _e,c as ve,ct as ye,d as be,dn as xe,dt as Se,er as Ce,et as we,f as Te,ft as Ee,g as H,gn as De,gt as Oe,h as U,ht as ke,i as Ae,in as je,it as W,j as Me,k as Ne,kn as Pe,l as G,ln as Fe,lt as Ie,m as K,mt as q,n as Le,nt as Re,o as ze,on as Be,ot as J,p as Ve,pt as He,q as Ue,qn as Y,r as We,rt as Ge,s as Ke,sn as qe,st as Je,tt as Ye,u as Xe,un as Ze,ut as Qe,v as $e,vn as et,vt as X,w as tt,wn as nt,x as rt,xn as it,xt as at,y as ot,yn as st,yt as ct,z as lt,zn as Z}from"./createPangu-DWnQ6X4q.js";function ut(){let e=null,t=!1,n=null,r=null;function i(t,a){n(t,a),r=e.requestAnimationFrame(i)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function dt(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Q={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},$={common:{diffuse:{value:new f(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new W},alphaMap:{value:null},alphaMapTransform:{value:new W},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new W}},envmap:{envMap:{value:null},envMapRotation:{value:new W},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new W}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new W}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new W},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new W},normalScale:{value:new N(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new W},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new W}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new W}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new W}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new f(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new Z},probesMax:{value:new Z},probesResolution:{value:new Z}},points:{diffuse:{value:new f(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new W},alphaTest:{value:0},uvTransform:{value:new W}},sprite:{diffuse:{value:new f(16777215)},opacity:{value:1},center:{value:new N(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new W},alphaMap:{value:null},alphaMapTransform:{value:new W},alphaTest:{value:0}}},ft={basic:{uniforms:z([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.fog]),vertexShader:Q.meshbasic_vert,fragmentShader:Q.meshbasic_frag},lambert:{uniforms:z([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.fog,$.lights,{emissive:{value:new f(0)},envMapIntensity:{value:1}}]),vertexShader:Q.meshlambert_vert,fragmentShader:Q.meshlambert_frag},phong:{uniforms:z([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.fog,$.lights,{emissive:{value:new f(0)},specular:{value:new f(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Q.meshphong_vert,fragmentShader:Q.meshphong_frag},standard:{uniforms:z([$.common,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.roughnessmap,$.metalnessmap,$.fog,$.lights,{emissive:{value:new f(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Q.meshphysical_vert,fragmentShader:Q.meshphysical_frag},toon:{uniforms:z([$.common,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.gradientmap,$.fog,$.lights,{emissive:{value:new f(0)}}]),vertexShader:Q.meshtoon_vert,fragmentShader:Q.meshtoon_frag},matcap:{uniforms:z([$.common,$.bumpmap,$.normalmap,$.displacementmap,$.fog,{matcap:{value:null}}]),vertexShader:Q.meshmatcap_vert,fragmentShader:Q.meshmatcap_frag},points:{uniforms:z([$.points,$.fog]),vertexShader:Q.points_vert,fragmentShader:Q.points_frag},dashed:{uniforms:z([$.common,$.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Q.linedashed_vert,fragmentShader:Q.linedashed_frag},depth:{uniforms:z([$.common,$.displacementmap]),vertexShader:Q.depth_vert,fragmentShader:Q.depth_frag},normal:{uniforms:z([$.common,$.bumpmap,$.normalmap,$.displacementmap,{opacity:{value:1}}]),vertexShader:Q.meshnormal_vert,fragmentShader:Q.meshnormal_frag},sprite:{uniforms:z([$.sprite,$.fog]),vertexShader:Q.sprite_vert,fragmentShader:Q.sprite_frag},background:{uniforms:{uvTransform:{value:new W},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Q.background_vert,fragmentShader:Q.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new W}},vertexShader:Q.backgroundCube_vert,fragmentShader:Q.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Q.cube_vert,fragmentShader:Q.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Q.equirect_vert,fragmentShader:Q.equirect_frag},distance:{uniforms:z([$.common,$.displacementmap,{referencePosition:{value:new Z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Q.distance_vert,fragmentShader:Q.distance_frag},shadow:{uniforms:z([$.lights,$.fog,{color:{value:new f(0)},opacity:{value:1}}]),vertexShader:Q.shadow_vert,fragmentShader:Q.shadow_frag}};ft.physical={uniforms:z([ft.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new W},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new W},clearcoatNormalScale:{value:new N(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new W},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new W},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new W},sheen:{value:0},sheenColor:{value:new f(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new W},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new W},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new W},transmissionSamplerSize:{value:new N},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new W},attenuationDistance:{value:0},attenuationColor:{value:new f(0)},specularColor:{value:new f(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new W},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new W},anisotropyVector:{value:new N},anisotropyMap:{value:null},anisotropyMapTransform:{value:new W}}]),vertexShader:Q.meshphysical_vert,fragmentShader:Q.meshphysical_frag};var pt={r:0,b:0,g:0},mt=new ge,ht=new W;ht.set(-1,0,0,0,1,0,0,0,1);function gt(e,t,n,r,i,a){let o=new f(0),s=i===!0?0:1,c,u,d=null,p=0,m=null;function h(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function g(t){let r=!1,i=h(t);i===null?v(o,s):i&&i.isColor&&(v(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function _(t,n){let i=h(n);i&&(i.isCubeTexture||i.mapping===306)?(u===void 0&&(u=new J(new ot(1,1,1),new st({name:`BackgroundCubeMaterial`,uniforms:R(ft.backgroundCube.uniforms),vertexShader:ft.backgroundCube.vertexShader,fragmentShader:ft.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute(`normal`),u.geometry.deleteAttribute(`uv`),u.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),u.material.uniforms.envMap.value=i,u.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(mt.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&u.material.uniforms.backgroundRotation.value.premultiply(ht),u.material.toneMapped=l.getTransfer(i.colorSpace)!==pe,(d!==i||p!==i.version||m!==e.toneMapping)&&(u.material.needsUpdate=!0,d=i,p=i.version,m=e.toneMapping),u.layers.enableAll(),t.unshift(u,u.geometry,u.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new J(new X(2,2),new st({name:`BackgroundMaterial`,uniforms:R(ft.background.uniforms),vertexShader:ft.background.vertexShader,fragmentShader:ft.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=l.getTransfer(i.colorSpace)!==pe,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(d!==i||p!==i.version||m!==e.toneMapping)&&(c.material.needsUpdate=!0,d=i,p=i.version,m=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function v(t,r){t.getRGB(pt,de(e)),n.buffers.color.setClear(pt.r,pt.g,pt.b,r,a)}function y(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,v(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,v(o,s)},render:g,addToRenderList:_,dispose:y}}function _t(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function vt(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function yt(e,n,r,i){let a;function o(){if(a!==void 0)return a;if(n.has(`EXT_texture_filter_anisotropic`)===!0){let t=n.get(`EXT_texture_filter_anisotropic`);a=e.getParameter(t.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function s(t){return t===1023||i.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function c(t){let r=t===1016&&(n.has(`EXT_color_buffer_half_float`)||n.has(`EXT_color_buffer_float`));return!(t!==1009&&i.convert(t)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&t!==1015&&!r)}function l(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let u=r.precision===void 0?`highp`:r.precision,d=l(u);d!==u&&(t(`WebGLRenderer:`,u,`not supported, using`,d,`instead.`),u=d);let f=r.logarithmicDepthBuffer===!0,p=r.reversedDepthBuffer===!0&&n.has(`EXT_clip_control`);r.reversedDepthBuffer===!0&&p===!1&&t(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let m=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=e.getParameter(e.MAX_TEXTURE_SIZE),_=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),v=e.getParameter(e.MAX_VERTEX_ATTRIBS),y=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),b=e.getParameter(e.MAX_VARYING_VECTORS),x=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),S=e.getParameter(e.MAX_SAMPLES),C=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:l,textureFormatReadable:s,textureTypeReadable:c,precision:u,logarithmicDepthBuffer:f,reversedDepthBuffer:p,maxTextures:m,maxVertexTextures:h,maxTextureSize:g,maxCubemapSize:_,maxAttributes:v,maxVertexUniforms:y,maxVaryings:b,maxFragmentUniforms:x,maxSamples:S,samples:C}}function bt(e){let t=this,n=null,r=0,i=!1,a=!1,o=new me,s=new W,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var xt=4,St=[.125,.215,.35,.446,.526,.582],Ct=20,wt=256,Tt=new ke,Et=new f,Dt=null,Ot=0,kt=0,At=!1,jt=new Z,Mt=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=jt}=i;Dt=this._renderer.getRenderTarget(),Ot=this._renderer.getActiveCubeFace(),kt=this._renderer.getActiveMipmapLevel(),At=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=zt(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Rt(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Dt,Ot,kt),this._renderer.xr.enabled=At,e.scissorTest=!1,Ft(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Dt=this._renderer.getRenderTarget(),Ot=this._renderer.getActiveCubeFace(),kt=this._renderer.getActiveMipmapLevel(),At=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,r={magFilter:e,minFilter:e,generateMipmaps:!1,type:Ue,format:d,colorSpace:Re,depthBuffer:!1},i=Pt(t,n,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Pt(t,n,r);let{_lodMax:e}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Nt(e)),this._blurMaterial=Lt(e,t,n),this._ggxMaterial=It(e,t,n)}return i}_compileMaterial(e){let t=new J(new rt,e);this._renderer.compile(t,Tt)}_sceneToCubeUV(e,t,n,r,i){let a=new Oe(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(Et),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new J(new ot,new Je({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(Et),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;Ft(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=zt()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Rt());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Ft(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Tt)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(0+c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-xt?n-d+xt:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,Ft(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Tt),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,Ft(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Tt)}_blur(e,t,n,r,i){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,`latitudinal`,i),this._halfBlur(a,e,n,n,r,`longitudinal`,i)}_halfBlur(e,n,r,i,a,o,s){let c=this._renderer,l=this._blurMaterial;o!==`latitudinal`&&o!==`longitudinal`&&Y(`blur direction must be either latitudinal or longitudinal!`);let u=this._lodMeshes[i];u.material=l;let d=l.uniforms,f=this._sizeLods[r]-1,p=isFinite(a)?Math.PI/(2*f):2*Math.PI/39,m=a/p,h=isFinite(a)?1+Math.floor(3*m):Ct;h>Ct&&t(`sigmaRadians, ${a}, is too large and will clip, as it requested ${h} samples when the maximum is set to ${Ct}`);let g=[],_=0;for(let e=0;e<Ct;++e){let t=e/m,n=Math.exp(-t*t/2);g.push(n),e===0?_+=n:e<h&&(_+=2*n)}for(let e=0;e<g.length;e++)g[e]=g[e]/_;d.envMap.value=e.texture,d.samples.value=h,d.weights.value=g,d.latitudinal.value=o===`latitudinal`,s&&(d.poleAxis.value=s);let{_lodMax:v}=this;d.dTheta.value=p,d.mipInt.value=v-r;let y=this._sizeLods[i];Ft(n,3*y*(i>v-xt?i-v+xt:0),4*(this._cubeSize-y),3*y,2*y),c.setRenderTarget(n),c.render(u,Tt)}};function Nt(e){let t=[],n=[],r=[],i=e,a=e-xt+1+St.length;for(let o=0;o<a;o++){let a=2**i;t.push(a);let s=1/a;o>e-xt?s=St[o-e+xt-1]:o===0&&(s=0),n.push(s);let c=1/(a-2),l=-c,u=1+c,d=[l,l,u,l,u,u,l,l,u,u,l,u],f=new Float32Array(108),p=new Float32Array(72),m=new Float32Array(36);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];f.set(r,18*e),p.set(d,12*e);let i=[e,e,e,e,e,e];m.set(i,6*e)}let h=new rt;h.setAttribute(`position`,new V(f,3)),h.setAttribute(`uv`,new V(p,2)),h.setAttribute(`faceIndex`,new V(m,1)),r.push(new J(h,null)),i>xt&&i--}return{lodMeshes:r,sizeLods:t,sigmas:n}}function Pt(e,t,n){let r=new v(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Ft(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function It(e,t,n){return new st({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:wt,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Bt(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Lt(e,t,n){let r=new Float32Array(Ct),i=new Z(0,1,0);return new st({name:`SphericalGaussianBlur`,defines:{n:Ct,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Bt(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Rt(){return new st({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Bt(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function zt(){return new st({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Bt(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Bt(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var Vt=class extends v{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Me(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;let r={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new ot(5,5,5),a=new st({name:`CubemapFromEquirect`,uniforms:R(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:1,blending:0});a.uniforms.tEquirect.value=n;let o=new J(i,a),s=n.minFilter;return n.minFilter===1008&&(n.minFilter=e),new Ne(1,10,this).update(t,o),n.minFilter=s,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function Ht(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Vt(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Mt(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Mt(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Ut(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Ce(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Wt(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?A:u)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function d(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:d}}function Gt(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Kt(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:Y(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function qt(e,t,n){let r=new WeakMap,i=new a;function o(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new O(h,p,m,u);g.type=_,g.needsUpdate=!0;let v=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*v;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new N(p,m)},r.set(o,d);function y(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,y)}o.addEventListener(`dispose`,y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:o}}function Jt(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Yt={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Xt(e,t,n,r,i){let a=new v(t,n,{type:e,depthBuffer:r,stencilBuffer:i,depthTexture:r?new T(t,n):void 0}),o=new v(t,n,{type:Ue,depthBuffer:!1,stencilBuffer:!1}),s=new rt;s.setAttribute(`position`,new I([-1,3,0,-1,-1,0,3,-1,0],3)),s.setAttribute(`uv`,new I([0,2,0,0,2,0],2));let c=new Be({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new J(s,c),d=new ke(-1,1,1,-1,0,1),f=null,p=null,m=!1,h,g=null,_=[],y=!1;this.setSize=function(e,t){a.setSize(e,t),o.setSize(e,t);for(let n=0;n<_.length;n++){let r=_[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){_=e,y=_.length>0&&_[0].isRenderPass===!0;let t=a.width,n=a.height;for(let e=0;e<_.length;e++){let r=_[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(m||e.toneMapping===0&&_.length===0)return!1;if(g=t,t!==null){let e=t.width,n=t.height;(a.width!==e||a.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(a),h=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=h,m=!0;let n=a,r=o;for(let i=0;i<_.length;i++){let a=_[i];if(a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1)){let e=n;n=r,r=e}}if(f!==e.outputColorSpace||p!==e.toneMapping){f=e.outputColorSpace,p=e.toneMapping,c.defines={},l.getTransfer(f)===`srgb`&&(c.defines.SRGB_TRANSFER=``);let t=Yt[p];t&&(c.defines[t]=``),c.needsUpdate=!0}c.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(g),e.render(u,d),g=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),s.dispose(),c.dispose()}}var Zt=new nt,Qt=new T(1,1),$t=new O,en=new D,tn=new Me,nn=[],rn=[],an=new Float32Array(16),on=new Float32Array(9),sn=new Float32Array(4);function cn(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=nn[i];if(a===void 0&&(a=new Float32Array(i),nn[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function ln(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function un(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function dn(e,t){let n=rn[t];n===void 0&&(n=new Int32Array(t),rn[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function fn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function pn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(ln(n,t))return;e.uniform2fv(this.addr,t),un(n,t)}}function mn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(ln(n,t))return;e.uniform3fv(this.addr,t),un(n,t)}}function hn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(ln(n,t))return;e.uniform4fv(this.addr,t),un(n,t)}}function gn(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(ln(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),un(n,t)}else{if(ln(n,r))return;sn.set(r),e.uniformMatrix2fv(this.addr,!1,sn),un(n,r)}}function _n(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(ln(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),un(n,t)}else{if(ln(n,r))return;on.set(r),e.uniformMatrix3fv(this.addr,!1,on),un(n,r)}}function vn(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(ln(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),un(n,t)}else{if(ln(n,r))return;an.set(r),e.uniformMatrix4fv(this.addr,!1,an),un(n,r)}}function yn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function bn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(ln(n,t))return;e.uniform2iv(this.addr,t),un(n,t)}}function xn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(ln(n,t))return;e.uniform3iv(this.addr,t),un(n,t)}}function Sn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(ln(n,t))return;e.uniform4iv(this.addr,t),un(n,t)}}function Cn(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function wn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(ln(n,t))return;e.uniform2uiv(this.addr,t),un(n,t)}}function Tn(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(ln(n,t))return;e.uniform3uiv(this.addr,t),un(n,t)}}function En(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(ln(n,t))return;e.uniform4uiv(this.addr,t),un(n,t)}}function Dn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(Qt.compareFunction=n.isReversedDepthBuffer()?518:515,a=Qt):a=Zt,n.setTexture2D(t||a,i)}function On(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||en,i)}function kn(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||tn,i)}function An(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||$t,i)}function jn(e){switch(e){case 5126:return fn;case 35664:return pn;case 35665:return mn;case 35666:return hn;case 35674:return gn;case 35675:return _n;case 35676:return vn;case 5124:case 35670:return yn;case 35667:case 35671:return bn;case 35668:case 35672:return xn;case 35669:case 35673:return Sn;case 5125:return Cn;case 36294:return wn;case 36295:return Tn;case 36296:return En;case 35678:case 36198:case 36298:case 36306:case 35682:return Dn;case 35679:case 36299:case 36307:return On;case 35680:case 36300:case 36308:case 36293:return kn;case 36289:case 36303:case 36311:case 36292:return An}}function Mn(e,t){e.uniform1fv(this.addr,t)}function Nn(e,t){let n=cn(t,this.size,2);e.uniform2fv(this.addr,n)}function Pn(e,t){let n=cn(t,this.size,3);e.uniform3fv(this.addr,n)}function Fn(e,t){let n=cn(t,this.size,4);e.uniform4fv(this.addr,n)}function In(e,t){let n=cn(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Ln(e,t){let n=cn(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Rn(e,t){let n=cn(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function zn(e,t){e.uniform1iv(this.addr,t)}function Bn(e,t){e.uniform2iv(this.addr,t)}function Vn(e,t){e.uniform3iv(this.addr,t)}function Hn(e,t){e.uniform4iv(this.addr,t)}function Un(e,t){e.uniform1uiv(this.addr,t)}function Wn(e,t){e.uniform2uiv(this.addr,t)}function Gn(e,t){e.uniform3uiv(this.addr,t)}function Kn(e,t){e.uniform4uiv(this.addr,t)}function qn(e,t,n){let r=this.cache,i=t.length,a=dn(n,i);ln(r,a)||(e.uniform1iv(this.addr,a),un(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Qt:Zt;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Jn(e,t,n){let r=this.cache,i=t.length,a=dn(n,i);ln(r,a)||(e.uniform1iv(this.addr,a),un(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||en,a[e])}function Yn(e,t,n){let r=this.cache,i=t.length,a=dn(n,i);ln(r,a)||(e.uniform1iv(this.addr,a),un(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||tn,a[e])}function Xn(e,t,n){let r=this.cache,i=t.length,a=dn(n,i);ln(r,a)||(e.uniform1iv(this.addr,a),un(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||$t,a[e])}function Zn(e){switch(e){case 5126:return Mn;case 35664:return Nn;case 35665:return Pn;case 35666:return Fn;case 35674:return In;case 35675:return Ln;case 35676:return Rn;case 5124:case 35670:return zn;case 35667:case 35671:return Bn;case 35668:case 35672:return Vn;case 35669:case 35673:return Hn;case 5125:return Un;case 36294:return Wn;case 36295:return Gn;case 36296:return Kn;case 35678:case 36198:case 36298:case 36306:case 35682:return qn;case 35679:case 36299:case 36307:return Jn;case 35680:case 36300:case 36308:case 36293:return Yn;case 36289:case 36303:case 36311:case 36292:return Xn}}var Qn=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=jn(t.type)}},$n=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Zn(t.type)}},er=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},tr=/(\w+)(\])?(\[|\.)?/g;function nr(e,t){e.seq.push(t),e.map[t.id]=t}function rr(e,t,n){let r=e.name,i=r.length;for(tr.lastIndex=0;;){let a=tr.exec(r),o=tr.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){nr(n,l===void 0?new Qn(s,e,t):new $n(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new er(s),nr(n,e)),n=e}}}var ir=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);rr(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function ar(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var or=37297,sr=0;function cr(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var lr=new W;function ur(e){l._getMatrix(lr,l.workingColorSpace,e);let n=`mat3( ${lr.elements.map(e=>e.toFixed(4))} )`;switch(l.getTransfer(e)){case Ge:return[n,`LinearTransferOETF`];case pe:return[n,`sRGBTransferOETF`];default:return t(`WebGLProgram: Unsupported color space: `,e),[n,`LinearTransferOETF`]}}function dr(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+cr(e.getShaderSource(t),r)}return i}function fr(e,t){let n=ur(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var pr={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function mr(e,n){let r=pr[n];return r===void 0?(t(`WebGLProgram: Unsupported toneMapping:`,n),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+r+`ToneMapping( color ); }`}var hr=new Z;function gr(){return l.getLuminanceCoefficients(hr),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${hr.x.toFixed(4)}, ${hr.y.toFixed(4)}, ${hr.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function _r(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(br).join(`
`)}function vr(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function yr(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function br(e){return e!==``}function xr(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Sr(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Cr=/^[ \t]*#include +<([\w\d./]+)>/gm;function wr(e){return e.replace(Cr,Er)}var Tr=new Map;function Er(e,n){let r=Q[n];if(r===void 0){let e=Tr.get(n);if(e!==void 0)r=Q[e],t(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,n,e);else throw Error(`Can not resolve #include <`+n+`>`)}return wr(r)}var Dr=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Or(e){return e.replace(Dr,kr)}function kr(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Ar(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var jr={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Mr(e){return jr[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Nr={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function Pr(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:Nr[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var Fr={302:`ENVMAP_MODE_REFRACTION`};function Ir(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Fr[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var Lr={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Rr(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:Lr[e.combine]||`ENVMAP_BLENDING_NONE`}function zr(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Br(e,n,r,i){let a=e.getContext(),o=r.defines,s=r.vertexShader,c=r.fragmentShader,l=Mr(r),u=Pr(r),d=Ir(r),f=Rr(r),p=zr(r),m=_r(r),h=vr(o),g=a.createProgram(),_,v,y=r.glslVersion?`#version `+r.glslVersion+`
`:``;r.isRawShaderMaterial?(_=[`#define SHADER_TYPE `+r.shaderType,`#define SHADER_NAME `+r.shaderName,h].filter(br).join(`
`),_.length>0&&(_+=`
`),v=[`#define SHADER_TYPE `+r.shaderType,`#define SHADER_NAME `+r.shaderName,h].filter(br).join(`
`),v.length>0&&(v+=`
`)):(_=[Ar(r),`#define SHADER_TYPE `+r.shaderType,`#define SHADER_NAME `+r.shaderName,h,r.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,r.batching?`#define USE_BATCHING`:``,r.batchingColor?`#define USE_BATCHING_COLOR`:``,r.instancing?`#define USE_INSTANCING`:``,r.instancingColor?`#define USE_INSTANCING_COLOR`:``,r.instancingMorph?`#define USE_INSTANCING_MORPH`:``,r.useFog&&r.fog?`#define USE_FOG`:``,r.useFog&&r.fogExp2?`#define FOG_EXP2`:``,r.map?`#define USE_MAP`:``,r.envMap?`#define USE_ENVMAP`:``,r.envMap?`#define `+d:``,r.lightMap?`#define USE_LIGHTMAP`:``,r.aoMap?`#define USE_AOMAP`:``,r.bumpMap?`#define USE_BUMPMAP`:``,r.normalMap?`#define USE_NORMALMAP`:``,r.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,r.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,r.displacementMap?`#define USE_DISPLACEMENTMAP`:``,r.emissiveMap?`#define USE_EMISSIVEMAP`:``,r.anisotropy?`#define USE_ANISOTROPY`:``,r.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,r.clearcoatMap?`#define USE_CLEARCOATMAP`:``,r.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,r.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,r.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,r.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,r.specularMap?`#define USE_SPECULARMAP`:``,r.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,r.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,r.roughnessMap?`#define USE_ROUGHNESSMAP`:``,r.metalnessMap?`#define USE_METALNESSMAP`:``,r.alphaMap?`#define USE_ALPHAMAP`:``,r.alphaHash?`#define USE_ALPHAHASH`:``,r.transmission?`#define USE_TRANSMISSION`:``,r.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,r.thicknessMap?`#define USE_THICKNESSMAP`:``,r.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,r.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,r.mapUv?`#define MAP_UV `+r.mapUv:``,r.alphaMapUv?`#define ALPHAMAP_UV `+r.alphaMapUv:``,r.lightMapUv?`#define LIGHTMAP_UV `+r.lightMapUv:``,r.aoMapUv?`#define AOMAP_UV `+r.aoMapUv:``,r.emissiveMapUv?`#define EMISSIVEMAP_UV `+r.emissiveMapUv:``,r.bumpMapUv?`#define BUMPMAP_UV `+r.bumpMapUv:``,r.normalMapUv?`#define NORMALMAP_UV `+r.normalMapUv:``,r.displacementMapUv?`#define DISPLACEMENTMAP_UV `+r.displacementMapUv:``,r.metalnessMapUv?`#define METALNESSMAP_UV `+r.metalnessMapUv:``,r.roughnessMapUv?`#define ROUGHNESSMAP_UV `+r.roughnessMapUv:``,r.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+r.anisotropyMapUv:``,r.clearcoatMapUv?`#define CLEARCOATMAP_UV `+r.clearcoatMapUv:``,r.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+r.clearcoatNormalMapUv:``,r.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+r.clearcoatRoughnessMapUv:``,r.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+r.iridescenceMapUv:``,r.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+r.iridescenceThicknessMapUv:``,r.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+r.sheenColorMapUv:``,r.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+r.sheenRoughnessMapUv:``,r.specularMapUv?`#define SPECULARMAP_UV `+r.specularMapUv:``,r.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+r.specularColorMapUv:``,r.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+r.specularIntensityMapUv:``,r.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+r.transmissionMapUv:``,r.thicknessMapUv?`#define THICKNESSMAP_UV `+r.thicknessMapUv:``,r.vertexTangents&&r.flatShading===!1?`#define USE_TANGENT`:``,r.vertexNormals?`#define HAS_NORMAL`:``,r.vertexColors?`#define USE_COLOR`:``,r.vertexAlphas?`#define USE_COLOR_ALPHA`:``,r.vertexUv1s?`#define USE_UV1`:``,r.vertexUv2s?`#define USE_UV2`:``,r.vertexUv3s?`#define USE_UV3`:``,r.pointsUvs?`#define USE_POINTS_UV`:``,r.flatShading?`#define FLAT_SHADED`:``,r.skinning?`#define USE_SKINNING`:``,r.morphTargets?`#define USE_MORPHTARGETS`:``,r.morphNormals&&r.flatShading===!1?`#define USE_MORPHNORMALS`:``,r.morphColors?`#define USE_MORPHCOLORS`:``,r.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+r.morphTextureStride:``,r.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+r.morphTargetsCount:``,r.doubleSided?`#define DOUBLE_SIDED`:``,r.flipSided?`#define FLIP_SIDED`:``,r.shadowMapEnabled?`#define USE_SHADOWMAP`:``,r.shadowMapEnabled?`#define `+l:``,r.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,r.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,r.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,r.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(br).join(`
`),v=[Ar(r),`#define SHADER_TYPE `+r.shaderType,`#define SHADER_NAME `+r.shaderName,h,r.useFog&&r.fog?`#define USE_FOG`:``,r.useFog&&r.fogExp2?`#define FOG_EXP2`:``,r.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,r.map?`#define USE_MAP`:``,r.matcap?`#define USE_MATCAP`:``,r.envMap?`#define USE_ENVMAP`:``,r.envMap?`#define `+u:``,r.envMap?`#define `+d:``,r.envMap?`#define `+f:``,p?`#define CUBEUV_TEXEL_WIDTH `+p.texelWidth:``,p?`#define CUBEUV_TEXEL_HEIGHT `+p.texelHeight:``,p?`#define CUBEUV_MAX_MIP `+p.maxMip+`.0`:``,r.lightMap?`#define USE_LIGHTMAP`:``,r.aoMap?`#define USE_AOMAP`:``,r.bumpMap?`#define USE_BUMPMAP`:``,r.normalMap?`#define USE_NORMALMAP`:``,r.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,r.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,r.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,r.emissiveMap?`#define USE_EMISSIVEMAP`:``,r.anisotropy?`#define USE_ANISOTROPY`:``,r.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,r.clearcoat?`#define USE_CLEARCOAT`:``,r.clearcoatMap?`#define USE_CLEARCOATMAP`:``,r.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,r.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,r.dispersion?`#define USE_DISPERSION`:``,r.iridescence?`#define USE_IRIDESCENCE`:``,r.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,r.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,r.specularMap?`#define USE_SPECULARMAP`:``,r.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,r.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,r.roughnessMap?`#define USE_ROUGHNESSMAP`:``,r.metalnessMap?`#define USE_METALNESSMAP`:``,r.alphaMap?`#define USE_ALPHAMAP`:``,r.alphaTest?`#define USE_ALPHATEST`:``,r.alphaHash?`#define USE_ALPHAHASH`:``,r.sheen?`#define USE_SHEEN`:``,r.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,r.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,r.transmission?`#define USE_TRANSMISSION`:``,r.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,r.thicknessMap?`#define USE_THICKNESSMAP`:``,r.vertexTangents&&r.flatShading===!1?`#define USE_TANGENT`:``,r.vertexColors||r.instancingColor?`#define USE_COLOR`:``,r.vertexAlphas||r.batchingColor?`#define USE_COLOR_ALPHA`:``,r.vertexUv1s?`#define USE_UV1`:``,r.vertexUv2s?`#define USE_UV2`:``,r.vertexUv3s?`#define USE_UV3`:``,r.pointsUvs?`#define USE_POINTS_UV`:``,r.gradientMap?`#define USE_GRADIENTMAP`:``,r.flatShading?`#define FLAT_SHADED`:``,r.doubleSided?`#define DOUBLE_SIDED`:``,r.flipSided?`#define FLIP_SIDED`:``,r.shadowMapEnabled?`#define USE_SHADOWMAP`:``,r.shadowMapEnabled?`#define `+l:``,r.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,r.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,r.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,r.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,r.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,r.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,r.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,r.toneMapping===0?``:`#define TONE_MAPPING`,r.toneMapping===0?``:Q.tonemapping_pars_fragment,r.toneMapping===0?``:mr(`toneMapping`,r.toneMapping),r.dithering?`#define DITHERING`:``,r.opaque?`#define OPAQUE`:``,Q.colorspace_pars_fragment,fr(`linearToOutputTexel`,r.outputColorSpace),gr(),r.useDepthPacking?`#define DEPTH_PACKING `+r.depthPacking:``,`
`].filter(br).join(`
`)),s=wr(s),s=xr(s,r),s=Sr(s,r),c=wr(c),c=xr(c,r),c=Sr(c,r),s=Or(s),c=Or(c),r.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,_=[m,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+_,v=[`#define varying in`,r.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,r.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+v);let b=y+_+s,x=y+v+c,S=ar(a,a.VERTEX_SHADER,b),C=ar(a,a.FRAGMENT_SHADER,x);a.attachShader(g,S),a.attachShader(g,C),r.index0AttributeName===void 0?r.morphTargets===!0&&a.bindAttribLocation(g,0,`position`):a.bindAttribLocation(g,0,r.index0AttributeName),a.linkProgram(g);function w(n){if(e.debug.checkShaderErrors){let r=a.getProgramInfoLog(g)||``,i=a.getShaderInfoLog(S)||``,o=a.getShaderInfoLog(C)||``,s=r.trim(),c=i.trim(),l=o.trim(),u=!0,d=!0;if(a.getProgramParameter(g,a.LINK_STATUS)===!1){if(u=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(a,g,S,C);else{let e=dr(a,S,`vertex`),t=dr(a,C,`fragment`);Y(`THREE.WebGLProgram: Shader Error `+a.getError()+` - VALIDATE_STATUS `+a.getProgramParameter(g,a.VALIDATE_STATUS)+`

Material Name: `+n.name+`
Material Type: `+n.type+`

Program Info Log: `+s+`
`+e+`
`+t)}}else s===``?(c===``||l===``)&&(d=!1):t(`WebGLProgram: Program Info Log:`,s);d&&(n.diagnostics={runnable:u,programLog:s,vertexShader:{log:c,prefix:_},fragmentShader:{log:l,prefix:v}})}a.deleteShader(S),a.deleteShader(C),T=new ir(a,g),E=yr(a,g)}let T;this.getUniforms=function(){return T===void 0&&w(this),T};let E;this.getAttributes=function(){return E===void 0&&w(this),E};let D=r.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=a.getProgramParameter(g,or)),D},this.destroy=function(){i.releaseStatesOfProgram(this),a.deleteProgram(g),this.program=void 0},this.type=r.shaderType,this.name=r.shaderName,this.id=sr++,this.cacheKey=n,this.usedTimes=1,this.program=g,this.vertexShader=S,this.fragmentShader=C,this}var Vr=0,Hr=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),i=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(i)===!1&&(a.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Ur(e),t.set(e,n)),n}},Ur=class{constructor(e){this.id=Vr++,this.code=e,this.usedTimes=0}};function Wr(e){return e===1030||e===37490||e===36285}function Gr(e,n,r,i,a,o){let s=new le,c=new Hr,u=new Set,d=[],f=new Map,p=i.logarithmicDepthBuffer,m=i.precision,h={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function g(e){return u.add(e),e===0?`uv`:`uv${e}`}function _(a,s,d,f,_,v){let y=f.fog,b=_.geometry,x=a.isMeshStandardMaterial||a.isMeshLambertMaterial||a.isMeshPhongMaterial?f.environment:null,S=a.isMeshStandardMaterial||a.isMeshLambertMaterial&&!a.envMap||a.isMeshPhongMaterial&&!a.envMap,C=n.get(a.envMap||x,S),w=C&&C.mapping===306?C.image.height:null,T=h[a.type];a.precision!==null&&(m=i.getMaxPrecision(a.precision),m!==a.precision&&t(`WebGLProgram.getParameters:`,a.precision,`not supported, using`,m,`instead.`));let E=b.morphAttributes.position||b.morphAttributes.normal||b.morphAttributes.color,D=E===void 0?0:E.length,ee=0;b.morphAttributes.position!==void 0&&(ee=1),b.morphAttributes.normal!==void 0&&(ee=2),b.morphAttributes.color!==void 0&&(ee=3);let O,k,A,te;if(T){let e=ft[T];O=e.vertexShader,k=e.fragmentShader}else O=a.vertexShader,k=a.fragmentShader,c.update(a),A=c.getVertexShaderID(a),te=c.getFragmentShaderID(a);let j=e.getRenderTarget(),ne=e.state.buffers.depth.getReversed(),re=_.isInstancedMesh===!0,ie=_.isBatchedMesh===!0,M=!!a.map,N=!!a.matcap,P=!!C,F=!!a.aoMap,ae=!!a.lightMap,oe=!!a.bumpMap,se=!!a.normalMap,I=!!a.displacementMap,ce=!!a.emissiveMap,L=!!a.metalnessMap,R=!!a.roughnessMap,le=a.anisotropy>0,ue=a.clearcoat>0,de=a.dispersion>0,fe=a.iridescence>0,z=a.sheen>0,pe=a.transmission>0,me=le&&!!a.anisotropyMap,B=ue&&!!a.clearcoatMap,he=ue&&!!a.clearcoatNormalMap,ge=ue&&!!a.clearcoatRoughnessMap,V=fe&&!!a.iridescenceMap,_e=fe&&!!a.iridescenceThicknessMap,ve=z&&!!a.sheenColorMap,ye=z&&!!a.sheenRoughnessMap,be=!!a.specularMap,xe=!!a.specularColorMap,Se=!!a.specularIntensityMap,Ce=pe&&!!a.transmissionMap,we=pe&&!!a.thicknessMap,Te=!!a.gradientMap,Ee=!!a.alphaMap,H=a.alphaTest>0,De=!!a.alphaHash,Oe=!!a.extensions,U=0;a.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(U=e.toneMapping);let ke={shaderID:T,shaderType:a.type,shaderName:a.name,vertexShader:O,fragmentShader:k,defines:a.defines,customVertexShaderID:A,customFragmentShaderID:te,isRawShaderMaterial:a.isRawShaderMaterial===!0,glslVersion:a.glslVersion,precision:m,batching:ie,batchingColor:ie&&_._colorsTexture!==null,instancing:re,instancingColor:re&&_.instanceColor!==null,instancingMorph:re&&_.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:l.workingColorSpace,alphaToCoverage:!!a.alphaToCoverage,map:M,matcap:N,envMap:P,envMapMode:P&&C.mapping,envMapCubeUVHeight:w,aoMap:F,lightMap:ae,bumpMap:oe,normalMap:se,displacementMap:I,emissiveMap:ce,normalMapObjectSpace:se&&a.normalMapType===1,normalMapTangentSpace:se&&a.normalMapType===0,packedNormalMap:se&&a.normalMapType===0&&Wr(a.normalMap.format),metalnessMap:L,roughnessMap:R,anisotropy:le,anisotropyMap:me,clearcoat:ue,clearcoatMap:B,clearcoatNormalMap:he,clearcoatRoughnessMap:ge,dispersion:de,iridescence:fe,iridescenceMap:V,iridescenceThicknessMap:_e,sheen:z,sheenColorMap:ve,sheenRoughnessMap:ye,specularMap:be,specularColorMap:xe,specularIntensityMap:Se,transmission:pe,transmissionMap:Ce,thicknessMap:we,gradientMap:Te,opaque:a.transparent===!1&&a.blending===1&&a.alphaToCoverage===!1,alphaMap:Ee,alphaTest:H,alphaHash:De,combine:a.combine,mapUv:M&&g(a.map.channel),aoMapUv:F&&g(a.aoMap.channel),lightMapUv:ae&&g(a.lightMap.channel),bumpMapUv:oe&&g(a.bumpMap.channel),normalMapUv:se&&g(a.normalMap.channel),displacementMapUv:I&&g(a.displacementMap.channel),emissiveMapUv:ce&&g(a.emissiveMap.channel),metalnessMapUv:L&&g(a.metalnessMap.channel),roughnessMapUv:R&&g(a.roughnessMap.channel),anisotropyMapUv:me&&g(a.anisotropyMap.channel),clearcoatMapUv:B&&g(a.clearcoatMap.channel),clearcoatNormalMapUv:he&&g(a.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ge&&g(a.clearcoatRoughnessMap.channel),iridescenceMapUv:V&&g(a.iridescenceMap.channel),iridescenceThicknessMapUv:_e&&g(a.iridescenceThicknessMap.channel),sheenColorMapUv:ve&&g(a.sheenColorMap.channel),sheenRoughnessMapUv:ye&&g(a.sheenRoughnessMap.channel),specularMapUv:be&&g(a.specularMap.channel),specularColorMapUv:xe&&g(a.specularColorMap.channel),specularIntensityMapUv:Se&&g(a.specularIntensityMap.channel),transmissionMapUv:Ce&&g(a.transmissionMap.channel),thicknessMapUv:we&&g(a.thicknessMap.channel),alphaMapUv:Ee&&g(a.alphaMap.channel),vertexTangents:!!b.attributes.tangent&&(se||le),vertexNormals:!!b.attributes.normal,vertexColors:a.vertexColors,vertexAlphas:a.vertexColors===!0&&!!b.attributes.color&&b.attributes.color.itemSize===4,pointsUvs:_.isPoints===!0&&!!b.attributes.uv&&(M||Ee),fog:!!y,useFog:a.fog===!0,fogExp2:!!y&&y.isFogExp2,flatShading:a.wireframe===!1&&(a.flatShading===!0||b.attributes.normal===void 0&&se===!1&&(a.isMeshLambertMaterial||a.isMeshPhongMaterial||a.isMeshStandardMaterial||a.isMeshPhysicalMaterial)),sizeAttenuation:a.sizeAttenuation===!0,logarithmicDepthBuffer:p,reversedDepthBuffer:ne,skinning:_.isSkinnedMesh===!0,morphTargets:b.morphAttributes.position!==void 0,morphNormals:b.morphAttributes.normal!==void 0,morphColors:b.morphAttributes.color!==void 0,morphTargetsCount:D,morphTextureStride:ee,numDirLights:s.directional.length,numPointLights:s.point.length,numSpotLights:s.spot.length,numSpotLightMaps:s.spotLightMap.length,numRectAreaLights:s.rectArea.length,numHemiLights:s.hemi.length,numDirLightShadows:s.directionalShadowMap.length,numPointLightShadows:s.pointShadowMap.length,numSpotLightShadows:s.spotShadowMap.length,numSpotLightShadowsWithMaps:s.numSpotLightShadowsWithMaps,numLightProbes:s.numLightProbes,numLightProbeGrids:v.length,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:a.dithering,shadowMapEnabled:e.shadowMap.enabled&&d.length>0,shadowMapType:e.shadowMap.type,toneMapping:U,decodeVideoTexture:M&&a.map.isVideoTexture===!0&&l.getTransfer(a.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:ce&&a.emissiveMap.isVideoTexture===!0&&l.getTransfer(a.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:a.premultipliedAlpha,doubleSided:a.side===2,flipSided:a.side===1,useDepthPacking:a.depthPacking>=0,depthPacking:a.depthPacking||0,index0AttributeName:a.index0AttributeName,extensionClipCullDistance:Oe&&a.extensions.clipCullDistance===!0&&r.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Oe&&a.extensions.multiDraw===!0||ie)&&r.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:r.has(`KHR_parallel_shader_compile`),customProgramCacheKey:a.customProgramCacheKey()};return ke.vertexUv1s=u.has(1),ke.vertexUv2s=u.has(2),ke.vertexUv3s=u.has(3),u.clear(),ke}function v(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(y(n,t),b(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function y(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function b(e,t){s.disableAll(),t.instancing&&s.enable(0),t.instancingColor&&s.enable(1),t.instancingMorph&&s.enable(2),t.matcap&&s.enable(3),t.envMap&&s.enable(4),t.normalMapObjectSpace&&s.enable(5),t.normalMapTangentSpace&&s.enable(6),t.clearcoat&&s.enable(7),t.iridescence&&s.enable(8),t.alphaTest&&s.enable(9),t.vertexColors&&s.enable(10),t.vertexAlphas&&s.enable(11),t.vertexUv1s&&s.enable(12),t.vertexUv2s&&s.enable(13),t.vertexUv3s&&s.enable(14),t.vertexTangents&&s.enable(15),t.anisotropy&&s.enable(16),t.alphaHash&&s.enable(17),t.batching&&s.enable(18),t.dispersion&&s.enable(19),t.batchingColor&&s.enable(20),t.gradientMap&&s.enable(21),t.packedNormalMap&&s.enable(22),t.vertexNormals&&s.enable(23),e.push(s.mask),s.disableAll(),t.fog&&s.enable(0),t.useFog&&s.enable(1),t.flatShading&&s.enable(2),t.logarithmicDepthBuffer&&s.enable(3),t.reversedDepthBuffer&&s.enable(4),t.skinning&&s.enable(5),t.morphTargets&&s.enable(6),t.morphNormals&&s.enable(7),t.morphColors&&s.enable(8),t.premultipliedAlpha&&s.enable(9),t.shadowMapEnabled&&s.enable(10),t.doubleSided&&s.enable(11),t.flipSided&&s.enable(12),t.useDepthPacking&&s.enable(13),t.dithering&&s.enable(14),t.transmission&&s.enable(15),t.sheen&&s.enable(16),t.opaque&&s.enable(17),t.pointsUvs&&s.enable(18),t.decodeVideoTexture&&s.enable(19),t.decodeVideoTextureEmissive&&s.enable(20),t.alphaToCoverage&&s.enable(21),t.numLightProbeGrids>0&&s.enable(22),e.push(s.mask)}function x(e){let t=h[e.type],n;if(t){let e=ft[t];n=Pe.clone(e.uniforms)}else n=e.uniforms;return n}function S(t,n){let r=f.get(n);return r===void 0?(r=new Br(e,n,t,a),d.push(r),f.set(n,r)):++r.usedTimes,r}function C(e){if(--e.usedTimes===0){let t=d.indexOf(e);d[t]=d[d.length-1],d.pop(),f.delete(e.cacheKey),e.destroy()}}function w(e){c.remove(e)}function T(){c.dispose()}return{getParameters:_,getProgramCacheKey:v,getUniforms:x,acquireProgram:S,releaseProgram:C,releaseShaderCache:w,programs:d,dispose:T}}function Kr(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function qr(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Jr(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Yr(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.push(u):a.transparent===!0?i.push(u):n.push(u)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||qr),r.length>1&&r.sort(t||Jr),i.length>1&&i.sort(t||Jr)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Xr(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Yr,e.set(t,[i])):n>=r.length?(i=new Yr,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Zr(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={direction:new Z,color:new f};break;case`SpotLight`:n={position:new Z,direction:new Z,color:new f,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new Z,color:new f,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new Z,skyColor:new f,groundColor:new f};break;case`RectAreaLight`:n={color:new f,position:new Z,halfWidth:new Z,halfHeight:new Z}}return e[t.id]=n,n}}}function Qr(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new N};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new N};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new N,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var $r=0;function ei(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function ti(e){let t=new Zr,n=Qr(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new Z);let i=new Z,a=new ge,o=new ge;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;i.sort(ei);for(let e=0,y=i.length;e<y;e++){let y=i[e],b=y.color,x=y.intensity,S=y.distance,C=null;if(y.shadow&&y.shadow.map&&(C=y.shadow.map.texture.format===1030?y.shadow.map.texture:y.shadow.map.depthTexture||y.shadow.map.texture),y.isAmbientLight)a+=b.r*x,o+=b.g*x,s+=b.b*x;else if(y.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(y.sh.coefficients[e],x);v++}else if(y.isDirectionalLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[c]=t,r.directionalShadowMap[c]=C,r.directionalShadowMatrix[c]=y.shadow.matrix,p++}r.directional[c]=e,c++}else if(y.isSpotLight){let e=t.get(y);e.position.setFromMatrixPosition(y.matrixWorld),e.color.copy(b).multiplyScalar(x),e.distance=S,e.coneCos=Math.cos(y.angle),e.penumbraCos=Math.cos(y.angle*(1-y.penumbra)),e.decay=y.decay,r.spot[u]=e;let i=y.shadow;if(y.map&&(r.spotLightMap[g]=y.map,g++,i.updateMatrices(y),y.castShadow&&_++),r.spotLightMatrix[u]=i.matrix,y.castShadow){let e=n.get(y);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[u]=e,r.spotShadowMap[u]=C,h++}u++}else if(y.isRectAreaLight){let e=t.get(y);e.color.copy(b).multiplyScalar(x),e.halfWidth.set(y.width*.5,0,0),e.halfHeight.set(0,y.height*.5,0),r.rectArea[d]=e,d++}else if(y.isPointLight){let e=t.get(y);if(e.color.copy(y.color).multiplyScalar(y.intensity),e.distance=y.distance,e.decay=y.decay,y.castShadow){let e=y.shadow,t=n.get(y);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[l]=t,r.pointShadowMap[l]=C,r.pointShadowMatrix[l]=y.shadow.matrix,m++}r.point[l]=e,l++}else if(y.isHemisphereLight){let e=t.get(y);e.skyColor.copy(y.color).multiplyScalar(x),e.groundColor.copy(y.groundColor).multiplyScalar(x),r.hemi[f]=e,f++}}d>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=$.LTC_FLOAT_1,r.rectAreaLTC2=$.LTC_FLOAT_2):(r.rectAreaLTC1=$.LTC_HALF_1,r.rectAreaLTC2=$.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let y=r.hash;(y.directionalLength!==c||y.pointLength!==l||y.spotLength!==u||y.rectAreaLength!==d||y.hemiLength!==f||y.numDirectionalShadows!==p||y.numPointShadows!==m||y.numSpotShadows!==h||y.numSpotMaps!==g||y.numLightProbes!==v)&&(r.directional.length=c,r.spot.length=u,r.rectArea.length=d,r.point.length=l,r.hemi.length=f,r.directionalShadow.length=p,r.directionalShadowMap.length=p,r.pointShadow.length=m,r.pointShadowMap.length=m,r.spotShadow.length=h,r.spotShadowMap.length=h,r.directionalShadowMatrix.length=p,r.pointShadowMatrix.length=m,r.spotLightMatrix.length=h+g-_,r.spotLightMap.length=g,r.numSpotLightShadowsWithMaps=_,r.numLightProbes=v,y.directionalLength=c,y.pointLength=l,y.spotLength=u,y.rectAreaLength=d,y.hemiLength=f,y.numDirectionalShadows=p,y.numPointShadows=m,y.numSpotShadows=h,y.numSpotMaps=g,y.numLightProbes=v,r.version=$r++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=t.matrixWorldInverse;for(let t=0,f=e.length;t<f;t++){let f=e[t];if(f.isDirectionalLight){let e=r.directional[n];e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),n++}else if(f.isSpotLight){let e=r.spot[c];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),e.direction.setFromMatrixPosition(f.matrixWorld),i.setFromMatrixPosition(f.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(d),c++}else if(f.isRectAreaLight){let e=r.rectArea[l];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),o.identity(),a.copy(f.matrixWorld),a.premultiply(d),o.extractRotation(a),e.halfWidth.set(f.width*.5,0,0),e.halfHeight.set(0,f.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),l++}else if(f.isPointLight){let e=r.point[s];e.position.setFromMatrixPosition(f.matrixWorld),e.position.applyMatrix4(d),s++}else if(f.isHemisphereLight){let e=r.hemi[u];e.direction.setFromMatrixPosition(f.matrixWorld),e.direction.transformDirection(d),u++}}}return{setup:s,setupView:c,state:r}}function ni(e){let t=new ti(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function ri(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new ni(e),t.set(n,[a])):r>=i.length?(a=new ni(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var ii=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ai=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,oi=[new Z(1,0,0),new Z(-1,0,0),new Z(0,1,0),new Z(0,-1,0),new Z(0,0,1),new Z(0,0,-1)],si=[new Z(0,-1,0),new Z(0,-1,0),new Z(0,0,1),new Z(0,0,-1),new Z(0,-1,0),new Z(0,-1,0)],ci=new ge,li=new Z,ui=new Z;function di(r,i,o){let s=new L,c=new N,l=new N,u=new a,d=new ye,f=new Ie,p={},h=o.maxTextureSize,g={0:1,1:0,2:2},y=new st({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new N},radius:{value:4}},vertexShader:ii,fragmentShader:ai}),b=y.clone();b.defines.HORIZONTAL_PASS=1;let x=new rt;x.setAttribute(`position`,new V(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let S=new J(x,y),C=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let w=this.type;this.render=function(i,a,o){if(C.enabled===!1||C.autoUpdate===!1&&C.needsUpdate===!1||i.length===0)return;this.type===2&&(t(`WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.`),this.type=1);let d=r.getRenderTarget(),f=r.getActiveCubeFace(),p=r.getActiveMipmapLevel(),g=r.state;g.setBlending(0),g.buffers.depth.getReversed()===!0?g.buffers.color.setClear(0,0,0,0):g.buffers.color.setClear(1,1,1,1),g.buffers.depth.setTest(!0),g.setScissorTest(!1);let y=w!==this.type;y&&a.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let d=0,f=i.length;d<f;d++){let f=i[d],p=f.shadow;if(p===void 0){t(`WebGLShadowMap:`,f,`has no shadow.`);continue}if(p.autoUpdate===!1&&p.needsUpdate===!1)continue;c.copy(p.mapSize);let b=p.getFrameExtents();c.multiply(b),l.copy(p.mapSize),(c.x>h||c.y>h)&&(c.x>h&&(l.x=Math.floor(h/b.x),c.x=l.x*b.x,p.mapSize.x=l.x),c.y>h&&(l.y=Math.floor(h/b.y),c.y=l.y*b.y,p.mapSize.y=l.y));let x=r.state.buffers.depth.getReversed();if(p.camera._reversedDepth=x,p.map===null||y===!0){if(p.map!==null&&(p.map.depthTexture!==null&&(p.map.depthTexture.dispose(),p.map.depthTexture=null),p.map.dispose()),this.type===3){if(f.isPointLight){t(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}p.map=new v(c.x,c.y,{format:je,type:Ue,minFilter:e,magFilter:e,generateMipmaps:!1}),p.map.texture.name=f.name+`.shadowMap`,p.map.depthTexture=new T(c.x,c.y,_),p.map.depthTexture.name=f.name+`.shadowMapDepth`,p.map.depthTexture.format=m,p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=Ee,p.map.depthTexture.magFilter=Ee}else f.isPointLight?(p.map=new Vt(c.x),p.map.depthTexture=new n(c.x,ne)):(p.map=new v(c.x,c.y),p.map.depthTexture=new T(c.x,c.y,ne)),p.map.depthTexture.name=f.name+`.shadowMap`,p.map.depthTexture.format=m,this.type===1?(p.map.depthTexture.compareFunction=x?518:515,p.map.depthTexture.minFilter=e,p.map.depthTexture.magFilter=e):(p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=Ee,p.map.depthTexture.magFilter=Ee);p.camera.updateProjectionMatrix()}let S=p.map.isWebGLCubeRenderTarget?6:1;for(let e=0;e<S;e++){if(p.map.isWebGLCubeRenderTarget)r.setRenderTarget(p.map,e),r.clear();else{e===0&&(r.setRenderTarget(p.map),r.clear());let t=p.getViewport(e);u.set(l.x*t.x,l.y*t.y,l.x*t.z,l.y*t.w),g.viewport(u)}if(f.isPointLight){let t=p.camera,n=p.matrix,r=f.distance||t.far;r!==t.far&&(t.far=r,t.updateProjectionMatrix()),li.setFromMatrixPosition(f.matrixWorld),t.position.copy(li),ui.copy(t.position),ui.add(oi[e]),t.up.copy(si[e]),t.lookAt(ui),t.updateMatrixWorld(),n.makeTranslation(-li.x,-li.y,-li.z),ci.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),p._frustum.setFromProjectionMatrix(ci,t.coordinateSystem,t.reversedDepth)}else p.updateMatrices(f);s=p.getFrustum(),ee(a,o,p.camera,f,this.type)}p.isPointLightShadow!==!0&&this.type===3&&E(p,o),p.needsUpdate=!1}w=this.type,C.needsUpdate=!1,r.setRenderTarget(d,f,p)};function E(e,t){let n=i.update(S);y.defines.VSM_SAMPLES!==e.blurSamples&&(y.defines.VSM_SAMPLES=e.blurSamples,b.defines.VSM_SAMPLES=e.blurSamples,y.needsUpdate=!0,b.needsUpdate=!0),e.mapPass===null&&(e.mapPass=new v(c.x,c.y,{format:je,type:Ue})),y.uniforms.shadow_pass.value=e.map.depthTexture,y.uniforms.resolution.value=e.mapSize,y.uniforms.radius.value=e.radius,r.setRenderTarget(e.mapPass),r.clear(),r.renderBufferDirect(t,null,n,y,S,null),b.uniforms.shadow_pass.value=e.mapPass.texture,b.uniforms.resolution.value=e.mapSize,b.uniforms.radius.value=e.radius,r.setRenderTarget(e.map),r.clear(),r.renderBufferDirect(t,null,n,b,S,null)}function D(e,t,n,i){let a=null,o=n.isPointLight===!0?e.customDistanceMaterial:e.customDepthMaterial;if(o!==void 0)a=o;else if(a=n.isPointLight===!0?f:d,r.localClippingEnabled&&t.clipShadows===!0&&Array.isArray(t.clippingPlanes)&&t.clippingPlanes.length!==0||t.displacementMap&&t.displacementScale!==0||t.alphaMap&&t.alphaTest>0||t.map&&t.alphaTest>0||t.alphaToCoverage===!0){let e=a.uuid,n=t.uuid,r=p[e];r===void 0&&(r={},p[e]=r);let i=r[n];i===void 0&&(i=a.clone(),r[n]=i,t.addEventListener(`dispose`,O)),a=i}if(a.visible=t.visible,a.wireframe=t.wireframe,i===3?a.side=t.shadowSide===null?t.side:t.shadowSide:a.side=t.shadowSide===null?g[t.side]:t.shadowSide,a.alphaMap=t.alphaMap,a.alphaTest=t.alphaToCoverage===!0?.5:t.alphaTest,a.map=t.map,a.clipShadows=t.clipShadows,a.clippingPlanes=t.clippingPlanes,a.clipIntersection=t.clipIntersection,a.displacementMap=t.displacementMap,a.displacementScale=t.displacementScale,a.displacementBias=t.displacementBias,a.wireframeLinewidth=t.wireframeLinewidth,a.linewidth=t.linewidth,n.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let e=r.properties.get(a);e.light=n}return a}function ee(e,t,n,a,o){if(e.visible===!1)return;if(e.layers.test(t.layers)&&(e.isMesh||e.isLine||e.isPoints)&&(e.castShadow||e.receiveShadow&&o===3)&&(!e.frustumCulled||s.intersectsObject(e))){e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld);let s=i.update(e),c=e.material;if(Array.isArray(c)){let i=s.groups;for(let l=0,u=i.length;l<u;l++){let u=i[l],d=c[u.materialIndex];if(d&&d.visible){let i=D(e,d,a,o);e.onBeforeShadow(r,e,t,n,s,i,u),r.renderBufferDirect(n,null,s,i,e,u),e.onAfterShadow(r,e,t,n,s,i,u)}}}else if(c.visible){let i=D(e,c,a,o);e.onBeforeShadow(r,e,t,n,s,i,null),r.renderBufferDirect(n,null,s,i,e,null),e.onAfterShadow(r,e,t,n,s,i,null)}}let c=e.children;for(let e=0,r=c.length;e<r;e++)ee(c[e],t,n,a,o)}function O(e){e.target.removeEventListener(`dispose`,O);for(let t in p){let n=p[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function fi(e,t){function n(){let t=!1,n=new a,r=null,i=new a(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?L(e.DEPTH_TEST):R(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=xe[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?L(e.STENCIL_TEST):R(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let o=new n,s=new r,c=new i,l=new WeakMap,u=new WeakMap,d={},p={},m={},h=new WeakMap,g=[],_=null,v=!1,y=null,b=null,x=null,S=null,C=null,w=null,T=null,E=new f(0,0,0),D=0,ee=!1,O=null,k=null,A=null,te=null,j=null,ne=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),re=!1,ie=0,M=e.getParameter(e.VERSION);M.indexOf(`WebGL`)===-1?M.indexOf(`OpenGL ES`)!==-1&&(ie=parseFloat(/^OpenGL ES (\d)/.exec(M)[1]),re=ie>=2):(ie=parseFloat(/^WebGL (\d)/.exec(M)[1]),re=ie>=1);let N=null,P={},F=e.getParameter(e.SCISSOR_BOX),ae=e.getParameter(e.VIEWPORT),oe=new a().fromArray(F),se=new a().fromArray(ae);function I(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let ce={};ce[e.TEXTURE_2D]=I(e.TEXTURE_2D,e.TEXTURE_2D,1),ce[e.TEXTURE_CUBE_MAP]=I(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[e.TEXTURE_2D_ARRAY]=I(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ce[e.TEXTURE_3D]=I(e.TEXTURE_3D,e.TEXTURE_3D,1,1),o.setClear(0,0,0,1),s.setClear(1),c.setClear(0),L(e.DEPTH_TEST),s.setFunc(3),B(!1),he(1),L(e.CULL_FACE),pe(0);function L(t){d[t]!==!0&&(e.enable(t),d[t]=!0)}function R(t){d[t]!==!1&&(e.disable(t),d[t]=!1)}function le(t,n){return m[t]!==n&&(e.bindFramebuffer(t,n),m[t]=n,t===e.DRAW_FRAMEBUFFER&&(m[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(m[e.DRAW_FRAMEBUFFER]=n),!0)}function ue(t,n){let r=g,i=!1;if(t){r=h.get(n),r===void 0&&(r=[],h.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function de(t){return _!==t&&(e.useProgram(t),_=t,!0)}let fe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};fe[103]=e.MIN,fe[104]=e.MAX;let z={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function pe(t,n,r,i,a,o,s,c,l,u){if(t===0){v===!0&&(R(e.BLEND),v=!1);return}if(v===!1&&(L(e.BLEND),v=!0),t!==5){if(t!==y||u!==ee){if((b!==100||C!==100)&&(e.blendEquation(e.FUNC_ADD),b=100,C=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Y(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:Y(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:Y(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:Y(`WebGLState: Invalid blending: `,t)}x=null,S=null,w=null,T=null,E.set(0,0,0),D=0,y=t,ee=u}return}a||=n,o||=r,s||=i,(n!==b||a!==C)&&(e.blendEquationSeparate(fe[n],fe[a]),b=n,C=a),(r!==x||i!==S||o!==w||s!==T)&&(e.blendFuncSeparate(z[r],z[i],z[o],z[s]),x=r,S=i,w=o,T=s),(c.equals(E)===!1||l!==D)&&(e.blendColor(c.r,c.g,c.b,l),E.copy(c),D=l),y=t,ee=!1}function me(t,n){t.side===2?R(e.CULL_FACE):L(e.CULL_FACE);let r=t.side===1;n&&(r=!r),B(r),t.blending===1&&t.transparent===!1?pe(0):pe(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),s.setFunc(t.depthFunc),s.setTest(t.depthTest),s.setMask(t.depthWrite),o.setMask(t.colorWrite);let i=t.stencilWrite;c.setTest(i),i&&(c.setMask(t.stencilWriteMask),c.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),c.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),V(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?L(e.SAMPLE_ALPHA_TO_COVERAGE):R(e.SAMPLE_ALPHA_TO_COVERAGE)}function B(t){O!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),O=t)}function he(t){t===0?R(e.CULL_FACE):(L(e.CULL_FACE),t!==k&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),k=t}function ge(t){t!==A&&(re&&e.lineWidth(t),A=t)}function V(t,n,r){t?(L(e.POLYGON_OFFSET_FILL),(te!==n||j!==r)&&(te=n,j=r,s.getReversed()&&(n=-n),e.polygonOffset(n,r))):R(e.POLYGON_OFFSET_FILL)}function _e(t){t?L(e.SCISSOR_TEST):R(e.SCISSOR_TEST)}function ve(t){t===void 0&&(t=e.TEXTURE0+ne-1),N!==t&&(e.activeTexture(t),N=t)}function ye(t,n,r){r===void 0&&(r=N===null?e.TEXTURE0+ne-1:N);let i=P[r];i===void 0&&(i={type:void 0,texture:void 0},P[r]=i),(i.type!==t||i.texture!==n)&&(N!==r&&(e.activeTexture(r),N=r),e.bindTexture(t,n||ce[t]),i.type=t,i.texture=n)}function be(){let t=P[N];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Se(){try{e.compressedTexImage2D(...arguments)}catch(e){Y(`WebGLState:`,e)}}function Ce(){try{e.compressedTexImage3D(...arguments)}catch(e){Y(`WebGLState:`,e)}}function we(){try{e.texSubImage2D(...arguments)}catch(e){Y(`WebGLState:`,e)}}function Te(){try{e.texSubImage3D(...arguments)}catch(e){Y(`WebGLState:`,e)}}function Ee(){try{e.compressedTexSubImage2D(...arguments)}catch(e){Y(`WebGLState:`,e)}}function H(){try{e.compressedTexSubImage3D(...arguments)}catch(e){Y(`WebGLState:`,e)}}function De(){try{e.texStorage2D(...arguments)}catch(e){Y(`WebGLState:`,e)}}function Oe(){try{e.texStorage3D(...arguments)}catch(e){Y(`WebGLState:`,e)}}function U(){try{e.texImage2D(...arguments)}catch(e){Y(`WebGLState:`,e)}}function ke(){try{e.texImage3D(...arguments)}catch(e){Y(`WebGLState:`,e)}}function Ae(t){return p[t]===void 0?e.getParameter(t):p[t]}function je(t,n){p[t]!==n&&(e.pixelStorei(t,n),p[t]=n)}function W(t){oe.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),oe.copy(t))}function Me(t){se.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),se.copy(t))}function Ne(t,n){let r=u.get(n);r===void 0&&(r=new WeakMap,u.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Pe(t,n){let r=u.get(n).get(t);l.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),l.set(n,r))}function G(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),s.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),d={},p={},N=null,P={},m={},h=new WeakMap,g=[],_=null,v=!1,y=null,b=null,x=null,S=null,C=null,w=null,T=null,E=new f(0,0,0),D=0,ee=!1,O=null,k=null,A=null,te=null,j=null,oe.set(0,0,e.canvas.width,e.canvas.height),se.set(0,0,e.canvas.width,e.canvas.height),o.reset(),s.reset(),c.reset()}return{buffers:{color:o,depth:s,stencil:c},enable:L,disable:R,bindFramebuffer:le,drawBuffers:ue,useProgram:de,setBlending:pe,setMaterial:me,setFlipSided:B,setCullFace:he,setLineWidth:ge,setPolygonOffset:V,setScissorTest:_e,activeTexture:ve,bindTexture:ye,unbindTexture:be,compressedTexImage2D:Se,compressedTexImage3D:Ce,texImage2D:U,texImage3D:ke,pixelStorei:je,getParameter:Ae,updateUBOMapping:Ne,uniformBlockBinding:Pe,texStorage2D:De,texStorage3D:Oe,texSubImage2D:we,texSubImage3D:Te,compressedTexSubImage2D:Ee,compressedTexSubImage3D:H,scissor:W,viewport:Me,reset:G}}function pi(n,r,i,a,o,s,c){let u=r.has(`WEBGL_multisampled_render_to_texture`)?r.get(`WEBGL_multisampled_render_to_texture`):null,d=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),f=new N,p=new WeakMap,m=new Set,h,g=new WeakMap,_=!1;try{_=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function v(e,t){return _?new OffscreenCanvas(e,t):w(`canvas`)}function b(e,n,r){let i=1,a=U(e);if((a.width>r||a.height>r)&&(i=r/Math.max(a.width,a.height)),i<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let r=Math.floor(i*a.width),o=Math.floor(i*a.height);h===void 0&&(h=v(r,o));let s=n?v(r,o):h;return s.width=r,s.height=o,s.getContext(`2d`).drawImage(e,0,0,r,o),t(`WebGLRenderer: Texture has been resized from (`+a.width+`x`+a.height+`) to (`+r+`x`+o+`).`),s}return`data`in e&&t(`WebGLRenderer: Image in DataTexture is too big (`+a.width+`x`+a.height+`).`),e}return e}function x(e){return e.generateMipmaps}function C(e){n.generateMipmap(e)}function T(e){return e.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:e.isWebGL3DRenderTarget?n.TEXTURE_3D:e.isWebGLArrayRenderTarget||e.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function E(e,i,a,o,s,c=!1){if(e!==null){if(n[e]!==void 0)return n[e];t(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+e+`'`)}let u;o&&(u=r.get(`EXT_texture_norm16`),u||t(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let d=i;if(i===n.RED&&(a===n.FLOAT&&(d=n.R32F),a===n.HALF_FLOAT&&(d=n.R16F),a===n.UNSIGNED_BYTE&&(d=n.R8),a===n.UNSIGNED_SHORT&&u&&(d=u.R16_EXT),a===n.SHORT&&u&&(d=u.R16_SNORM_EXT)),i===n.RED_INTEGER&&(a===n.UNSIGNED_BYTE&&(d=n.R8UI),a===n.UNSIGNED_SHORT&&(d=n.R16UI),a===n.UNSIGNED_INT&&(d=n.R32UI),a===n.BYTE&&(d=n.R8I),a===n.SHORT&&(d=n.R16I),a===n.INT&&(d=n.R32I)),i===n.RG&&(a===n.FLOAT&&(d=n.RG32F),a===n.HALF_FLOAT&&(d=n.RG16F),a===n.UNSIGNED_BYTE&&(d=n.RG8),a===n.UNSIGNED_SHORT&&u&&(d=u.RG16_EXT),a===n.SHORT&&u&&(d=u.RG16_SNORM_EXT)),i===n.RG_INTEGER&&(a===n.UNSIGNED_BYTE&&(d=n.RG8UI),a===n.UNSIGNED_SHORT&&(d=n.RG16UI),a===n.UNSIGNED_INT&&(d=n.RG32UI),a===n.BYTE&&(d=n.RG8I),a===n.SHORT&&(d=n.RG16I),a===n.INT&&(d=n.RG32I)),i===n.RGB_INTEGER&&(a===n.UNSIGNED_BYTE&&(d=n.RGB8UI),a===n.UNSIGNED_SHORT&&(d=n.RGB16UI),a===n.UNSIGNED_INT&&(d=n.RGB32UI),a===n.BYTE&&(d=n.RGB8I),a===n.SHORT&&(d=n.RGB16I),a===n.INT&&(d=n.RGB32I)),i===n.RGBA_INTEGER&&(a===n.UNSIGNED_BYTE&&(d=n.RGBA8UI),a===n.UNSIGNED_SHORT&&(d=n.RGBA16UI),a===n.UNSIGNED_INT&&(d=n.RGBA32UI),a===n.BYTE&&(d=n.RGBA8I),a===n.SHORT&&(d=n.RGBA16I),a===n.INT&&(d=n.RGBA32I)),i===n.RGB&&(a===n.UNSIGNED_SHORT&&u&&(d=u.RGB16_EXT),a===n.SHORT&&u&&(d=u.RGB16_SNORM_EXT),a===n.UNSIGNED_INT_5_9_9_9_REV&&(d=n.RGB9_E5),a===n.UNSIGNED_INT_10F_11F_11F_REV&&(d=n.R11F_G11F_B10F)),i===n.RGBA){let e=c?Ge:l.getTransfer(s);a===n.FLOAT&&(d=n.RGBA32F),a===n.HALF_FLOAT&&(d=n.RGBA16F),a===n.UNSIGNED_BYTE&&(d=e===`srgb`?n.SRGB8_ALPHA8:n.RGBA8),a===n.UNSIGNED_SHORT&&u&&(d=u.RGBA16_EXT),a===n.SHORT&&u&&(d=u.RGBA16_SNORM_EXT),a===n.UNSIGNED_SHORT_4_4_4_4&&(d=n.RGBA4),a===n.UNSIGNED_SHORT_5_5_5_1&&(d=n.RGB5_A1)}return(d===n.R16F||d===n.R32F||d===n.RG16F||d===n.RG32F||d===n.RGBA16F||d===n.RGBA32F)&&r.get(`EXT_color_buffer_float`),d}function D(e,r){let i;return e?r===null||r===1014||r===1020?i=n.DEPTH24_STENCIL8:r===1015?i=n.DEPTH32F_STENCIL8:r===1012&&(i=n.DEPTH24_STENCIL8,t(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):r===null||r===1014||r===1020?i=n.DEPTH_COMPONENT24:r===1015?i=n.DEPTH_COMPONENT32F:r===1012&&(i=n.DEPTH_COMPONENT16),i}function ee(e,t){return x(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function O(e){let t=e.target;t.removeEventListener(`dispose`,O),A(t),t.isVideoTexture&&p.delete(t),t.isHTMLTexture&&m.delete(t)}function k(e){let t=e.target;t.removeEventListener(`dispose`,k),j(t)}function A(e){let t=a.get(e);if(t.__webglInit===void 0)return;let n=e.source,r=g.get(n);if(r){let i=r[t.__cacheKey];i.usedTimes--,i.usedTimes===0&&te(e),Object.keys(r).length===0&&g.delete(n)}a.remove(e)}function te(e){let t=a.get(e);n.deleteTexture(t.__webglTexture);let r=e.source,i=g.get(r);delete i[t.__cacheKey],c.memory.textures--}function j(e){let t=a.get(e);if(e.depthTexture&&(e.depthTexture.dispose(),a.remove(e.depthTexture)),e.isWebGLCubeRenderTarget)for(let e=0;e<6;e++){if(Array.isArray(t.__webglFramebuffer[e]))for(let r=0;r<t.__webglFramebuffer[e].length;r++)n.deleteFramebuffer(t.__webglFramebuffer[e][r]);else n.deleteFramebuffer(t.__webglFramebuffer[e]);t.__webglDepthbuffer&&n.deleteRenderbuffer(t.__webglDepthbuffer[e])}else{if(Array.isArray(t.__webglFramebuffer))for(let e=0;e<t.__webglFramebuffer.length;e++)n.deleteFramebuffer(t.__webglFramebuffer[e]);else n.deleteFramebuffer(t.__webglFramebuffer);if(t.__webglDepthbuffer&&n.deleteRenderbuffer(t.__webglDepthbuffer),t.__webglMultisampledFramebuffer&&n.deleteFramebuffer(t.__webglMultisampledFramebuffer),t.__webglColorRenderbuffer)for(let e=0;e<t.__webglColorRenderbuffer.length;e++)t.__webglColorRenderbuffer[e]&&n.deleteRenderbuffer(t.__webglColorRenderbuffer[e]);t.__webglDepthRenderbuffer&&n.deleteRenderbuffer(t.__webglDepthRenderbuffer)}let r=e.textures;for(let e=0,t=r.length;e<t;e++){let t=a.get(r[e]);t.__webglTexture&&(n.deleteTexture(t.__webglTexture),c.memory.textures--),a.remove(r[e])}a.remove(e)}let ne=0;function re(){ne=0}function ie(){return ne}function M(e){ne=e}function P(){let e=ne;return e>=o.maxTextures&&t(`WebGLTextures: Trying to use `+e+` texture units while this GPU supports only `+o.maxTextures),ne+=1,e}function ae(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function oe(e,r){let o=a.get(e);if(e.isVideoTexture&&De(e),e.isRenderTargetTexture===!1&&e.isExternalTexture!==!0&&e.version>0&&o.__version!==e.version){let n=e.image;if(n===null)t(`WebGLRenderer: Texture marked for update but no image data found.`);else if(n.complete===!1)t(`WebGLRenderer: Texture marked for update but image is incomplete`);else{pe(o,e,r);return}}else e.isExternalTexture&&(o.__webglTexture=e.sourceTexture?e.sourceTexture:null);i.bindTexture(n.TEXTURE_2D,o.__webglTexture,n.TEXTURE0+r)}function se(e,t){let r=a.get(e);if(e.isRenderTargetTexture===!1&&e.version>0&&r.__version!==e.version){pe(r,e,t);return}e.isExternalTexture&&(r.__webglTexture=e.sourceTexture?e.sourceTexture:null),i.bindTexture(n.TEXTURE_2D_ARRAY,r.__webglTexture,n.TEXTURE0+t)}function I(e,t){let r=a.get(e);if(e.isRenderTargetTexture===!1&&e.version>0&&r.__version!==e.version){pe(r,e,t);return}i.bindTexture(n.TEXTURE_3D,r.__webglTexture,n.TEXTURE0+t)}function ce(e,t){let r=a.get(e);if(e.isCubeDepthTexture!==!0&&e.version>0&&r.__version!==e.version){me(r,e,t);return}i.bindTexture(n.TEXTURE_CUBE_MAP,r.__webglTexture,n.TEXTURE0+t)}let L={[Ze]:n.REPEAT,[F]:n.CLAMP_TO_EDGE,[Se]:n.MIRRORED_REPEAT},R={[Ee]:n.NEAREST,[q]:n.NEAREST_MIPMAP_NEAREST,[He]:n.NEAREST_MIPMAP_LINEAR,[e]:n.LINEAR,[Ye]:n.LINEAR_MIPMAP_NEAREST,[we]:n.LINEAR_MIPMAP_LINEAR},le={512:n.NEVER,519:n.ALWAYS,513:n.LESS,515:n.LEQUAL,514:n.EQUAL,518:n.GEQUAL,516:n.GREATER,517:n.NOTEQUAL};function ue(e,i){if(i.type===1015&&r.has(`OES_texture_float_linear`)===!1&&(i.magFilter===1006||i.magFilter===1007||i.magFilter===1005||i.magFilter===1008||i.minFilter===1006||i.minFilter===1007||i.minFilter===1005||i.minFilter===1008)&&t(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),n.texParameteri(e,n.TEXTURE_WRAP_S,L[i.wrapS]),n.texParameteri(e,n.TEXTURE_WRAP_T,L[i.wrapT]),(e===n.TEXTURE_3D||e===n.TEXTURE_2D_ARRAY)&&n.texParameteri(e,n.TEXTURE_WRAP_R,L[i.wrapR]),n.texParameteri(e,n.TEXTURE_MAG_FILTER,R[i.magFilter]),n.texParameteri(e,n.TEXTURE_MIN_FILTER,R[i.minFilter]),i.compareFunction&&(n.texParameteri(e,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(e,n.TEXTURE_COMPARE_FUNC,le[i.compareFunction])),r.has(`EXT_texture_filter_anisotropic`)===!0){if(i.magFilter===1003||i.minFilter!==1005&&i.minFilter!==1008||i.type===1015&&r.has(`OES_texture_float_linear`)===!1)return;if(i.anisotropy>1||a.get(i).__currentAnisotropy){let t=r.get(`EXT_texture_filter_anisotropic`);n.texParameterf(e,t.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(i.anisotropy,o.getMaxAnisotropy())),a.get(i).__currentAnisotropy=i.anisotropy}}}function de(e,t){let r=!1;e.__webglInit===void 0&&(e.__webglInit=!0,t.addEventListener(`dispose`,O));let i=t.source,a=g.get(i);a===void 0&&(a={},g.set(i,a));let o=ae(t);if(o!==e.__cacheKey){a[o]===void 0&&(a[o]={texture:n.createTexture(),usedTimes:0},c.memory.textures++,r=!0),a[o].usedTimes++;let i=a[e.__cacheKey];i!==void 0&&(a[e.__cacheKey].usedTimes--,i.usedTimes===0&&te(t)),e.__cacheKey=o,e.__webglTexture=a[o].texture}return r}function fe(e,t,n){return Math.floor(Math.floor(e/n)/t)}function z(e,t,r,a){let o=e.updateRanges;if(o.length===0)i.texSubImage2D(n.TEXTURE_2D,0,0,0,t.width,t.height,r,a,t.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let n=o[s],r=o[e],i=n.start+n.count,a=fe(r.start,t.width,4),c=fe(n.start,t.width,4);r.start<=i+1&&a===c&&fe(r.start+r.count-1,t.width,4)===a?n.count=Math.max(n.count,r.start+r.count-n.start):(++s,o[s]=r)}o.length=s+1;let c=i.getParameter(n.UNPACK_ROW_LENGTH),l=i.getParameter(n.UNPACK_SKIP_PIXELS),u=i.getParameter(n.UNPACK_SKIP_ROWS);i.pixelStorei(n.UNPACK_ROW_LENGTH,t.width);for(let e=0,s=o.length;e<s;e++){let s=o[e],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%t.width,d=Math.floor(c/t.width),f=l;i.pixelStorei(n.UNPACK_SKIP_PIXELS,u),i.pixelStorei(n.UNPACK_SKIP_ROWS,d),i.texSubImage2D(n.TEXTURE_2D,0,u,d,f,1,r,a,t.data)}e.clearUpdateRanges(),i.pixelStorei(n.UNPACK_ROW_LENGTH,c),i.pixelStorei(n.UNPACK_SKIP_PIXELS,l),i.pixelStorei(n.UNPACK_SKIP_ROWS,u)}}function pe(e,r,c){let u=n.TEXTURE_2D;(r.isDataArrayTexture||r.isCompressedArrayTexture)&&(u=n.TEXTURE_2D_ARRAY),r.isData3DTexture&&(u=n.TEXTURE_3D);let d=de(e,r),f=r.source;i.bindTexture(u,e.__webglTexture,n.TEXTURE0+c);let p=a.get(f);if(f.version!==p.__version||d===!0){if(i.activeTexture(n.TEXTURE0+c),!(typeof ImageBitmap<`u`&&r.image instanceof ImageBitmap)){let e=l.getPrimaries(l.workingColorSpace),t=r.colorSpace===``?null:l.getPrimaries(r.colorSpace),a=r.colorSpace===``||e===t?n.NONE:n.BROWSER_DEFAULT_WEBGL;i.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,r.flipY),i.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultiplyAlpha),i.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,a)}i.pixelStorei(n.UNPACK_ALIGNMENT,r.unpackAlignment);let e=b(r.image,!1,o.maxTextureSize);e=Oe(r,e);let a=s.convert(r.format,r.colorSpace),h=s.convert(r.type),g=E(r.internalFormat,a,h,r.normalized,r.colorSpace,r.isVideoTexture);ue(u,r);let _,v=r.mipmaps,w=r.isVideoTexture!==!0,T=p.__version===void 0||d===!0,O=f.dataReady,k=ee(r,e);if(r.isDepthTexture)g=D(r.format===y,r.type),T&&(w?i.texStorage2D(n.TEXTURE_2D,1,g,e.width,e.height):i.texImage2D(n.TEXTURE_2D,0,g,e.width,e.height,0,a,h,null));else if(r.isDataTexture){if(v.length>0){w&&T&&i.texStorage2D(n.TEXTURE_2D,k,g,v[0].width,v[0].height);for(let e=0,t=v.length;e<t;e++)_=v[e],w?O&&i.texSubImage2D(n.TEXTURE_2D,e,0,0,_.width,_.height,a,h,_.data):i.texImage2D(n.TEXTURE_2D,e,g,_.width,_.height,0,a,h,_.data);r.generateMipmaps=!1}else w?(T&&i.texStorage2D(n.TEXTURE_2D,k,g,e.width,e.height),O&&z(r,e,a,h)):i.texImage2D(n.TEXTURE_2D,0,g,e.width,e.height,0,a,h,e.data)}else if(r.isCompressedTexture){if(r.isCompressedArrayTexture){w&&T&&i.texStorage3D(n.TEXTURE_2D_ARRAY,k,g,v[0].width,v[0].height,e.depth);for(let o=0,s=v.length;o<s;o++)if(_=v[o],r.format!==1023){if(a!==null){if(w){if(O){if(r.layerUpdates.size>0){let e=S(_.width,_.height,r.format,r.type);for(let t of r.layerUpdates){let r=_.data.subarray(t*e/_.data.BYTES_PER_ELEMENT,(t+1)*e/_.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,o,0,0,t,_.width,_.height,1,a,r)}r.clearLayerUpdates()}else i.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,o,0,0,0,_.width,_.height,e.depth,a,_.data)}}else i.compressedTexImage3D(n.TEXTURE_2D_ARRAY,o,g,_.width,_.height,e.depth,0,_.data,0,0)}else t(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else w?O&&i.texSubImage3D(n.TEXTURE_2D_ARRAY,o,0,0,0,_.width,_.height,e.depth,a,h,_.data):i.texImage3D(n.TEXTURE_2D_ARRAY,o,g,_.width,_.height,e.depth,0,a,h,_.data)}else{w&&T&&i.texStorage2D(n.TEXTURE_2D,k,g,v[0].width,v[0].height);for(let e=0,o=v.length;e<o;e++)_=v[e],r.format===1023?w?O&&i.texSubImage2D(n.TEXTURE_2D,e,0,0,_.width,_.height,a,h,_.data):i.texImage2D(n.TEXTURE_2D,e,g,_.width,_.height,0,a,h,_.data):a===null?t(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):w?O&&i.compressedTexSubImage2D(n.TEXTURE_2D,e,0,0,_.width,_.height,a,_.data):i.compressedTexImage2D(n.TEXTURE_2D,e,g,_.width,_.height,0,_.data)}}else if(r.isDataArrayTexture){if(w){if(T&&i.texStorage3D(n.TEXTURE_2D_ARRAY,k,g,e.width,e.height,e.depth),O){if(r.layerUpdates.size>0){let t=S(e.width,e.height,r.format,r.type);for(let o of r.layerUpdates){let r=e.data.subarray(o*t/e.data.BYTES_PER_ELEMENT,(o+1)*t/e.data.BYTES_PER_ELEMENT);i.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,o,e.width,e.height,1,a,h,r)}r.clearLayerUpdates()}else i.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,e.width,e.height,e.depth,a,h,e.data)}}else i.texImage3D(n.TEXTURE_2D_ARRAY,0,g,e.width,e.height,e.depth,0,a,h,e.data)}else if(r.isData3DTexture)w?(T&&i.texStorage3D(n.TEXTURE_3D,k,g,e.width,e.height,e.depth),O&&i.texSubImage3D(n.TEXTURE_3D,0,0,0,0,e.width,e.height,e.depth,a,h,e.data)):i.texImage3D(n.TEXTURE_3D,0,g,e.width,e.height,e.depth,0,a,h,e.data);else if(r.isFramebufferTexture){if(T){if(w)i.texStorage2D(n.TEXTURE_2D,k,g,e.width,e.height);else{let t=e.width,r=e.height;for(let e=0;e<k;e++)i.texImage2D(n.TEXTURE_2D,e,g,t,r,0,a,h,null),t>>=1,r>>=1}}}else if(r.isHTMLTexture){if(`texElementImage2D`in n){let t=n.canvas;if(t.hasAttribute(`layoutsubtree`)||t.setAttribute(`layoutsubtree`,`true`),e.parentNode!==t){t.appendChild(e),m.add(r),t.onpaint=e=>{let t=e.changedElements;for(let e of m)t.includes(e.image)&&(e.needsUpdate=!0)},t.requestPaint();return}let i=n.RGBA,a=n.RGBA,o=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,i,a,o,e),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(v.length>0){if(w&&T){let e=U(v[0]);i.texStorage2D(n.TEXTURE_2D,k,g,e.width,e.height)}for(let e=0,t=v.length;e<t;e++)_=v[e],w?O&&i.texSubImage2D(n.TEXTURE_2D,e,0,0,a,h,_):i.texImage2D(n.TEXTURE_2D,e,g,a,h,_);r.generateMipmaps=!1}else if(w){if(T){let t=U(e);i.texStorage2D(n.TEXTURE_2D,k,g,t.width,t.height)}O&&i.texSubImage2D(n.TEXTURE_2D,0,0,0,a,h,e)}else i.texImage2D(n.TEXTURE_2D,0,g,a,h,e);x(r)&&C(u),p.__version=f.version,r.onUpdate&&r.onUpdate(r)}e.__version=r.version}function me(e,r,c){if(r.image.length!==6)return;let u=de(e,r),d=r.source;i.bindTexture(n.TEXTURE_CUBE_MAP,e.__webglTexture,n.TEXTURE0+c);let f=a.get(d);if(d.version!==f.__version||u===!0){i.activeTexture(n.TEXTURE0+c);let e=l.getPrimaries(l.workingColorSpace),a=r.colorSpace===``?null:l.getPrimaries(r.colorSpace),p=r.colorSpace===``||e===a?n.NONE:n.BROWSER_DEFAULT_WEBGL;i.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,r.flipY),i.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultiplyAlpha),i.pixelStorei(n.UNPACK_ALIGNMENT,r.unpackAlignment),i.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,p);let m=r.isCompressedTexture||r.image[0].isCompressedTexture,h=r.image[0]&&r.image[0].isDataTexture,g=[];for(let e=0;e<6;e++)!m&&!h?g[e]=b(r.image[e],!0,o.maxCubemapSize):g[e]=h?r.image[e].image:r.image[e],g[e]=Oe(r,g[e]);let _=g[0],v=s.convert(r.format,r.colorSpace),y=s.convert(r.type),S=E(r.internalFormat,v,y,r.normalized,r.colorSpace),w=r.isVideoTexture!==!0,T=f.__version===void 0||u===!0,D=d.dataReady,O=ee(r,_);ue(n.TEXTURE_CUBE_MAP,r);let k;if(m){w&&T&&i.texStorage2D(n.TEXTURE_CUBE_MAP,O,S,_.width,_.height);for(let e=0;e<6;e++){k=g[e].mipmaps;for(let a=0;a<k.length;a++){let o=k[a];r.format===1023?w?D&&i.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+e,a,0,0,o.width,o.height,v,y,o.data):i.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+e,a,S,o.width,o.height,0,v,y,o.data):v===null?t(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?D&&i.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+e,a,0,0,o.width,o.height,v,o.data):i.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+e,a,S,o.width,o.height,0,o.data)}}}else{if(k=r.mipmaps,w&&T){k.length>0&&O++;let e=U(g[0]);i.texStorage2D(n.TEXTURE_CUBE_MAP,O,S,e.width,e.height)}for(let e=0;e<6;e++)if(h){w?D&&i.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,g[e].width,g[e].height,v,y,g[e].data):i.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,S,g[e].width,g[e].height,0,v,y,g[e].data);for(let t=0;t<k.length;t++){let r=k[t].image[e].image;w?D&&i.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,0,0,r.width,r.height,v,y,r.data):i.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,S,r.width,r.height,0,v,y,r.data)}}else{w?D&&i.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,v,y,g[e]):i.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,S,v,y,g[e]);for(let t=0;t<k.length;t++){let r=k[t];w?D&&i.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,0,0,v,y,r.image[e]):i.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,S,v,y,r.image[e])}}}x(r)&&C(n.TEXTURE_CUBE_MAP),f.__version=d.version,r.onUpdate&&r.onUpdate(r)}e.__version=r.version}function B(e,t,r,o,c,l){let d=s.convert(r.format,r.colorSpace),f=s.convert(r.type),p=E(r.internalFormat,d,f,r.normalized,r.colorSpace),m=a.get(t),h=a.get(r);if(h.__renderTarget=t,!m.__hasExternalTextures){let e=Math.max(1,t.width>>l),r=Math.max(1,t.height>>l);c===n.TEXTURE_3D||c===n.TEXTURE_2D_ARRAY?i.texImage3D(c,l,p,e,r,t.depth,0,d,f,null):i.texImage2D(c,l,p,e,r,0,d,f,null)}i.bindFramebuffer(n.FRAMEBUFFER,e),H(t)?u.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,o,c,h.__webglTexture,0,Te(t)):(c===n.TEXTURE_2D||c>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&c<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,o,c,h.__webglTexture,l),i.bindFramebuffer(n.FRAMEBUFFER,null)}function he(e,t,r){if(n.bindRenderbuffer(n.RENDERBUFFER,e),t.depthBuffer){let i=t.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=D(t.stencilBuffer,a),s=t.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;H(t)?u.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Te(t),o,t.width,t.height):r?n.renderbufferStorageMultisample(n.RENDERBUFFER,Te(t),o,t.width,t.height):n.renderbufferStorage(n.RENDERBUFFER,o,t.width,t.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,s,n.RENDERBUFFER,e)}else{let e=t.textures;for(let i=0;i<e.length;i++){let a=e[i],o=s.convert(a.format,a.colorSpace),c=s.convert(a.type),l=E(a.internalFormat,o,c,a.normalized,a.colorSpace);H(t)?u.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Te(t),l,t.width,t.height):r?n.renderbufferStorageMultisample(n.RENDERBUFFER,Te(t),l,t.width,t.height):n.renderbufferStorage(n.RENDERBUFFER,l,t.width,t.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ge(e,t,r){let o=t.isWebGLCubeRenderTarget===!0;if(i.bindFramebuffer(n.FRAMEBUFFER,e),!(t.depthTexture&&t.depthTexture.isDepthTexture))throw Error(`renderTarget.depthTexture must be an instance of THREE.DepthTexture`);let c=a.get(t.depthTexture);if(c.__renderTarget=t,(!c.__webglTexture||t.depthTexture.image.width!==t.width||t.depthTexture.image.height!==t.height)&&(t.depthTexture.image.width=t.width,t.depthTexture.image.height=t.height,t.depthTexture.needsUpdate=!0),o){if(c.__webglInit===void 0&&(c.__webglInit=!0,t.depthTexture.addEventListener(`dispose`,O)),c.__webglTexture===void 0){c.__webglTexture=n.createTexture(),i.bindTexture(n.TEXTURE_CUBE_MAP,c.__webglTexture),ue(n.TEXTURE_CUBE_MAP,t.depthTexture);let e=s.convert(t.depthTexture.format),r=s.convert(t.depthTexture.type),a;t.depthTexture.format===1026?a=n.DEPTH_COMPONENT24:t.depthTexture.format===1027&&(a=n.DEPTH24_STENCIL8);for(let i=0;i<6;i++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+i,0,a,t.width,t.height,0,e,r,null)}}else oe(t.depthTexture,0);let l=c.__webglTexture,d=Te(t),f=o?n.TEXTURE_CUBE_MAP_POSITIVE_X+r:n.TEXTURE_2D,p=t.depthTexture.format===1027?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(t.depthTexture.format===1026)H(t)?u.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,p,f,l,0,d):n.framebufferTexture2D(n.FRAMEBUFFER,p,f,l,0);else if(t.depthTexture.format===1027)H(t)?u.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,p,f,l,0,d):n.framebufferTexture2D(n.FRAMEBUFFER,p,f,l,0);else throw Error(`Unknown depthTexture format`)}function V(e){let t=a.get(e),r=e.isWebGLCubeRenderTarget===!0;if(t.__boundDepthTexture!==e.depthTexture){let n=e.depthTexture;if(t.__depthDisposeCallback&&t.__depthDisposeCallback(),n){let e=()=>{delete t.__boundDepthTexture,delete t.__depthDisposeCallback,n.removeEventListener(`dispose`,e)};n.addEventListener(`dispose`,e),t.__depthDisposeCallback=e}t.__boundDepthTexture=n}if(e.depthTexture&&!t.__autoAllocateDepthBuffer){if(r)for(let n=0;n<6;n++)ge(t.__webglFramebuffer[n],e,n);else{let n=e.texture.mipmaps;n&&n.length>0?ge(t.__webglFramebuffer[0],e,0):ge(t.__webglFramebuffer,e,0)}}else if(r){t.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(i.bindFramebuffer(n.FRAMEBUFFER,t.__webglFramebuffer[r]),t.__webglDepthbuffer[r]===void 0)t.__webglDepthbuffer[r]=n.createRenderbuffer(),he(t.__webglDepthbuffer[r],e,!1);else{let i=e.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,a=t.__webglDepthbuffer[r];n.bindRenderbuffer(n.RENDERBUFFER,a),n.framebufferRenderbuffer(n.FRAMEBUFFER,i,n.RENDERBUFFER,a)}}else{let r=e.texture.mipmaps;if(r&&r.length>0?i.bindFramebuffer(n.FRAMEBUFFER,t.__webglFramebuffer[0]):i.bindFramebuffer(n.FRAMEBUFFER,t.__webglFramebuffer),t.__webglDepthbuffer===void 0)t.__webglDepthbuffer=n.createRenderbuffer(),he(t.__webglDepthbuffer,e,!1);else{let r=e.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,i=t.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,i),n.framebufferRenderbuffer(n.FRAMEBUFFER,r,n.RENDERBUFFER,i)}}i.bindFramebuffer(n.FRAMEBUFFER,null)}function _e(e,t,r){let i=a.get(e);t!==void 0&&B(i.__webglFramebuffer,e,e.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),r!==void 0&&V(e)}function ve(e){let t=e.texture,r=a.get(e),o=a.get(t);e.addEventListener(`dispose`,k);let l=e.textures,u=e.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(o.__webglTexture===void 0&&(o.__webglTexture=n.createTexture()),o.__version=t.version,c.memory.textures++),u){r.__webglFramebuffer=[];for(let e=0;e<6;e++)if(t.mipmaps&&t.mipmaps.length>0){r.__webglFramebuffer[e]=[];for(let i=0;i<t.mipmaps.length;i++)r.__webglFramebuffer[e][i]=n.createFramebuffer()}else r.__webglFramebuffer[e]=n.createFramebuffer()}else{if(t.mipmaps&&t.mipmaps.length>0){r.__webglFramebuffer=[];for(let e=0;e<t.mipmaps.length;e++)r.__webglFramebuffer[e]=n.createFramebuffer()}else r.__webglFramebuffer=n.createFramebuffer();if(d)for(let e=0,t=l.length;e<t;e++){let t=a.get(l[e]);t.__webglTexture===void 0&&(t.__webglTexture=n.createTexture(),c.memory.textures++)}if(e.samples>0&&H(e)===!1){r.__webglMultisampledFramebuffer=n.createFramebuffer(),r.__webglColorRenderbuffer=[],i.bindFramebuffer(n.FRAMEBUFFER,r.__webglMultisampledFramebuffer);for(let t=0;t<l.length;t++){let i=l[t];r.__webglColorRenderbuffer[t]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,r.__webglColorRenderbuffer[t]);let a=s.convert(i.format,i.colorSpace),o=s.convert(i.type),c=E(i.internalFormat,a,o,i.normalized,i.colorSpace,e.isXRRenderTarget===!0),u=Te(e);n.renderbufferStorageMultisample(n.RENDERBUFFER,u,c,e.width,e.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+t,n.RENDERBUFFER,r.__webglColorRenderbuffer[t])}n.bindRenderbuffer(n.RENDERBUFFER,null),e.depthBuffer&&(r.__webglDepthRenderbuffer=n.createRenderbuffer(),he(r.__webglDepthRenderbuffer,e,!0)),i.bindFramebuffer(n.FRAMEBUFFER,null)}}if(u){i.bindTexture(n.TEXTURE_CUBE_MAP,o.__webglTexture),ue(n.TEXTURE_CUBE_MAP,t);for(let i=0;i<6;i++)if(t.mipmaps&&t.mipmaps.length>0)for(let a=0;a<t.mipmaps.length;a++)B(r.__webglFramebuffer[i][a],e,t,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+i,a);else B(r.__webglFramebuffer[i],e,t,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+i,0);x(t)&&C(n.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(d){for(let t=0,o=l.length;t<o;t++){let o=l[t],s=a.get(o),c=n.TEXTURE_2D;(e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(c=e.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),i.bindTexture(c,s.__webglTexture),ue(c,o),B(r.__webglFramebuffer,e,o,n.COLOR_ATTACHMENT0+t,c,0),x(o)&&C(c)}i.unbindTexture()}else{let a=n.TEXTURE_2D;if((e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(a=e.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),i.bindTexture(a,o.__webglTexture),ue(a,t),t.mipmaps&&t.mipmaps.length>0)for(let i=0;i<t.mipmaps.length;i++)B(r.__webglFramebuffer[i],e,t,n.COLOR_ATTACHMENT0,a,i);else B(r.__webglFramebuffer,e,t,n.COLOR_ATTACHMENT0,a,0);x(t)&&C(a),i.unbindTexture()}e.depthBuffer&&V(e)}function ye(e){let t=e.textures;for(let n=0,r=t.length;n<r;n++){let r=t[n];if(x(r)){let t=T(e),n=a.get(r).__webglTexture;i.bindTexture(t,n),C(t),i.unbindTexture()}}}let be=[],xe=[];function Ce(e){if(e.samples>0){if(H(e)===!1){let t=e.textures,r=e.width,o=e.height,s=n.COLOR_BUFFER_BIT,c=e.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,l=a.get(e),u=t.length>1;if(u)for(let e=0;e<t.length;e++)i.bindFramebuffer(n.FRAMEBUFFER,l.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+e,n.RENDERBUFFER,null),i.bindFramebuffer(n.FRAMEBUFFER,l.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+e,n.TEXTURE_2D,null,0);i.bindFramebuffer(n.READ_FRAMEBUFFER,l.__webglMultisampledFramebuffer);let f=e.texture.mipmaps;f&&f.length>0?i.bindFramebuffer(n.DRAW_FRAMEBUFFER,l.__webglFramebuffer[0]):i.bindFramebuffer(n.DRAW_FRAMEBUFFER,l.__webglFramebuffer);for(let i=0;i<t.length;i++){if(e.resolveDepthBuffer&&(e.depthBuffer&&(s|=n.DEPTH_BUFFER_BIT),e.stencilBuffer&&e.resolveStencilBuffer&&(s|=n.STENCIL_BUFFER_BIT)),u){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,l.__webglColorRenderbuffer[i]);let e=a.get(t[i]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,e,0)}n.blitFramebuffer(0,0,r,o,0,0,r,o,s,n.NEAREST),d===!0&&(be.length=0,xe.length=0,be.push(n.COLOR_ATTACHMENT0+i),e.depthBuffer&&e.resolveDepthBuffer===!1&&(be.push(c),xe.push(c),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,xe)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,be))}if(i.bindFramebuffer(n.READ_FRAMEBUFFER,null),i.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),u)for(let e=0;e<t.length;e++){i.bindFramebuffer(n.FRAMEBUFFER,l.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+e,n.RENDERBUFFER,l.__webglColorRenderbuffer[e]);let r=a.get(t[e]).__webglTexture;i.bindFramebuffer(n.FRAMEBUFFER,l.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+e,n.TEXTURE_2D,r,0)}i.bindFramebuffer(n.DRAW_FRAMEBUFFER,l.__webglMultisampledFramebuffer)}else if(e.depthBuffer&&e.resolveDepthBuffer===!1&&d){let t=e.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[t])}}}function Te(e){return Math.min(o.maxSamples,e.samples)}function H(e){let t=a.get(e);return e.samples>0&&r.has(`WEBGL_multisampled_render_to_texture`)===!0&&t.__useRenderToTexture!==!1}function De(e){let t=c.render.frame;p.get(e)!==t&&(p.set(e,t),e.update())}function Oe(e,n){let r=e.colorSpace,i=e.format,a=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||r!==`srgb-linear`&&r!==``&&(l.getTransfer(r)===`srgb`?(i!==1023||a!==1009)&&t(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):Y(`WebGLTextures: Unsupported texture color space:`,r)),n}function U(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(f.width=e.naturalWidth||e.width,f.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(f.width=e.displayWidth,f.height=e.displayHeight):(f.width=e.width,f.height=e.height),f}this.allocateTextureUnit=P,this.resetTextureUnits=re,this.getTextureUnits=ie,this.setTextureUnits=M,this.setTexture2D=oe,this.setTexture2DArray=se,this.setTexture3D=I,this.setTextureCube=ce,this.rebindTextures=_e,this.setupRenderTarget=ve,this.updateRenderTargetMipmap=ye,this.updateMultisampleRenderTarget=Ce,this.setupDepthRenderbuffer=V,this.setupFrameBufferTexture=B,this.useMultisampledRTT=H,this.isReversedDepthBuffer=function(){return i.buffers.depth.getReversed()}}function mi(e,t){function n(n,r=``){let i,a=l.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var hi=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,gi=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,_i=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new i(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new st({vertexShader:hi,fragmentShader:gi,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new J(new X(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},vi=class extends lt{constructor(e,n){super();let o=this,s=null,l=1,u=null,f=`local-floor`,p=1,h=null,g=null,_=null,b=null,x=null,S=null,C=typeof XRWebGLBinding<`u`,w=new _i,E={},D=n.getContextAttributes(),O=null,k=null,A=[],te=[],j=new N,re=null,ie=new Oe;ie.viewport=new a;let M=new Oe;M.viewport=new a;let P=[ie,M],F=new $e,ae=null,oe=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=A[e];return t===void 0&&(t=new se,A[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=A[e];return t===void 0&&(t=new se,A[e]=t),t.getGripSpace()},this.getHand=function(e){let t=A[e];return t===void 0&&(t=new se,A[e]=t),t.getHandSpace()};function I(e){let t=te.indexOf(e.inputSource);if(t===-1)return;let n=A[t];n!==void 0&&(n.update(e.inputSource,e.frame,h||u),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ce(){s.removeEventListener(`select`,I),s.removeEventListener(`selectstart`,I),s.removeEventListener(`selectend`,I),s.removeEventListener(`squeeze`,I),s.removeEventListener(`squeezestart`,I),s.removeEventListener(`squeezeend`,I),s.removeEventListener(`end`,ce),s.removeEventListener(`inputsourceschange`,L);for(let e=0;e<A.length;e++){let t=te[e];t!==null&&(te[e]=null,A[e].disconnect(t))}ae=null,oe=null,w.reset();for(let e in E)delete E[e];e.setRenderTarget(O),x=null,b=null,_=null,s=null,k=null,me.stop(),o.isPresenting=!1,e.setPixelRatio(re),e.setSize(j.width,j.height,!1),o.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){l=e,o.isPresenting===!0&&t(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){f=e,o.isPresenting===!0&&t(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return h||u},this.setReferenceSpace=function(e){h=e},this.getBaseLayer=function(){return b===null?x:b},this.getBinding=function(){return _===null&&C&&(_=new XRWebGLBinding(s,n)),_},this.getFrame=function(){return S},this.getSession=function(){return s},this.setSession=async function(t){if(s=t,s!==null){if(O=e.getRenderTarget(),s.addEventListener(`select`,I),s.addEventListener(`selectstart`,I),s.addEventListener(`selectend`,I),s.addEventListener(`squeeze`,I),s.addEventListener(`squeezestart`,I),s.addEventListener(`squeezeend`,I),s.addEventListener(`end`,ce),s.addEventListener(`inputsourceschange`,L),D.xrCompatible!==!0&&await n.makeXRCompatible(),re=e.getPixelRatio(),e.getSize(j),C&&`createProjectionLayer`in XRWebGLBinding.prototype){let t=null,i=null,a=null;D.depth&&(a=D.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,t=D.stencil?y:m,i=D.stencil?ee:ne);let o={colorFormat:n.RGBA8,depthFormat:a,scaleFactor:l};_=this.getBinding(),b=_.createProjectionLayer(o),s.updateRenderState({layers:[b]}),e.setPixelRatio(1),e.setSize(b.textureWidth,b.textureHeight,!1),k=new v(b.textureWidth,b.textureHeight,{format:d,type:r,depthTexture:new T(b.textureWidth,b.textureHeight,i,void 0,void 0,void 0,void 0,void 0,void 0,t),stencilBuffer:D.stencil,colorSpace:e.outputColorSpace,samples:D.antialias?4:0,resolveDepthBuffer:b.ignoreDepthValues===!1,resolveStencilBuffer:b.ignoreDepthValues===!1})}else{let t={antialias:D.antialias,alpha:!0,depth:D.depth,stencil:D.stencil,framebufferScaleFactor:l};x=new XRWebGLLayer(s,n,t),s.updateRenderState({baseLayer:x}),e.setPixelRatio(1),e.setSize(x.framebufferWidth,x.framebufferHeight,!1),k=new v(x.framebufferWidth,x.framebufferHeight,{format:d,type:r,colorSpace:e.outputColorSpace,stencilBuffer:D.stencil,resolveDepthBuffer:x.ignoreDepthValues===!1,resolveStencilBuffer:x.ignoreDepthValues===!1})}k.isXRRenderTarget=!0,this.setFoveation(p),h=null,u=await s.requestReferenceSpace(f),me.setContext(s),me.start(),o.isPresenting=!0,o.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return w.getDepthTexture()};function L(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=te.indexOf(n);r>=0&&(te[r]=null,A[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=te.indexOf(n);if(r===-1){for(let e=0;e<A.length;e++)if(e>=te.length){te.push(n),r=e;break}else if(te[e]===null){te[e]=n,r=e;break}if(r===-1)break}let i=A[r];i&&i.connect(n)}}let R=new Z,le=new Z;function ue(e,t,n){R.setFromMatrixPosition(t.matrixWorld),le.setFromMatrixPosition(n.matrixWorld);let r=R.distanceTo(le),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function de(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(s===null)return;let t=e.near,n=e.far;w.texture!==null&&(w.depthNear>0&&(t=w.depthNear),w.depthFar>0&&(n=w.depthFar)),F.near=M.near=ie.near=t,F.far=M.far=ie.far=n,(ae!==F.near||oe!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),ae=F.near,oe=F.far),F.layers.mask=e.layers.mask|6,ie.layers.mask=F.layers.mask&-5,M.layers.mask=F.layers.mask&-3;let r=e.parent,i=F.cameras;de(F,r);for(let e=0;e<i.length;e++)de(i[e],r);i.length===2?ue(F,ie,M):F.projectionMatrix.copy(ie.projectionMatrix),fe(e,F,r)};function fe(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=c*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(b!==null||x!==null)return p},this.setFoveation=function(e){p=e,b!==null&&(b.fixedFoveation=e),x!==null&&x.fixedFoveation!==void 0&&(x.fixedFoveation=e)},this.hasDepthSensing=function(){return w.texture!==null},this.getDepthSensingMesh=function(){return w.getMesh(F)},this.getCameraTexture=function(e){return E[e]};let z=null;function pe(t,n){if(g=n.getViewerPose(h||u),S=n,g!==null){let t=g.views;x!==null&&(e.setRenderTargetFramebuffer(k,x.framebuffer),e.setRenderTarget(k));let n=!1;t.length!==F.cameras.length&&(F.cameras.length=0,n=!0);for(let r=0;r<t.length;r++){let i=t[r],o=null;if(x!==null)o=x.getViewport(i);else{let t=_.getViewSubImage(b,i);o=t.viewport,r===0&&(e.setRenderTargetTextures(k,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(k))}let s=P[r];s===void 0&&(s=new Oe,s.layers.enable(r),s.viewport=new a,P[r]=s),s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.quaternion,s.scale),s.projectionMatrix.fromArray(i.projectionMatrix),s.projectionMatrixInverse.copy(s.projectionMatrix).invert(),s.viewport.set(o.x,o.y,o.width,o.height),r===0&&(F.matrix.copy(s.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),n===!0&&F.cameras.push(s)}let r=s.enabledFeatures;if(r&&r.includes(`depth-sensing`)&&s.depthUsage==`gpu-optimized`&&C){_=o.getBinding();let e=_.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&w.init(e,s.renderState)}if(r&&r.includes(`camera-access`)&&C){e.state.unbindTexture(),_=o.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=E[n];e||(e=new i,E[n]=e);let t=_.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<A.length;e++){let t=te[e],r=A[e];t!==null&&r!==void 0&&r.update(t,n,h||u)}z&&z(t,n),n.detectedPlanes&&o.dispatchEvent({type:`planesdetected`,data:n}),S=null}let me=new ut;me.setAnimationLoop(pe),this.setAnimationLoop=function(e){z=e},this.dispose=function(){}}},yi=new ge,bi=new W;bi.set(-1,0,0,0,1,0,0,0,1);function xi(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,de(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(yi.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(bi),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Si(e,n,r,i){let a={},o={},s=[],c=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function l(e,t){let n=t.program;i.uniformBlockBinding(e,n)}function u(e,t){let r=a[e.id];r===void 0&&(h(e),r=d(e),a[e.id]=r,e.addEventListener(`dispose`,_));let s=t.program;i.updateUBOMapping(e,s);let c=n.render.frame;o[e.id]!==c&&(p(e),o[e.id]=c)}function d(t){let n=f();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function f(){for(let e=0;e<c;e++)if(s.indexOf(e)===-1)return s.push(e),e;return Y(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function p(t){let n=a[t.id],r=t.uniforms,i=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let t=0,n=r.length;t<n;t++){let n=Array.isArray(r[t])?r[t]:[r[t]];for(let r=0,a=n.length;r<a;r++){let a=n[r];if(m(a,t,r,i)===!0){let t=a.__offset,n=Array.isArray(a.value)?a.value:[a.value],r=0;for(let i=0;i<n.length;i++){let o=n[i],s=g(o);typeof o==`number`||typeof o==`boolean`?(a.__data[0]=o,e.bufferSubData(e.UNIFORM_BUFFER,t+r,a.__data)):o.isMatrix3?(a.__data[0]=o.elements[0],a.__data[1]=o.elements[1],a.__data[2]=o.elements[2],a.__data[3]=0,a.__data[4]=o.elements[3],a.__data[5]=o.elements[4],a.__data[6]=o.elements[5],a.__data[7]=0,a.__data[8]=o.elements[6],a.__data[9]=o.elements[7],a.__data[10]=o.elements[8],a.__data[11]=0):ArrayBuffer.isView(o)?a.__data.set(new o.constructor(o.buffer,o.byteOffset,a.__data.length)):(o.toArray(a.__data,r),r+=s.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,t,a.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function m(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function h(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=g(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function g(e){let n={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(n.boundary=4,n.storage=4):e.isVector2?(n.boundary=8,n.storage=8):e.isVector3||e.isColor?(n.boundary=16,n.storage=12):e.isVector4?(n.boundary=16,n.storage=16):e.isMatrix3?(n.boundary=48,n.storage=48):e.isMatrix4?(n.boundary=64,n.storage=64):e.isTexture?t(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(n.boundary=16,n.storage=e.byteLength):t(`WebGLRenderer: Unsupported uniform value type.`,e),n}function _(t){let n=t.target;n.removeEventListener(`dispose`,_);let r=s.indexOf(n.__bindingPointIndex);s.splice(r,1),e.deleteBuffer(a[n.id]),delete a[n.id],delete o[n.id]}function v(){for(let t in a)e.deleteBuffer(a[t]);s=[],a={},o={}}return{bind:l,update:u,dispose:v}}var Ci=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),wi=null;function Ti(){return wi===null&&(wi=new j(Ci,16,16,je,Ue),wi.name=`DFG_LUT`,wi.minFilter=e,wi.magFilter=e,wi.wrapS=F,wi.wrapT=F,wi.generateMipmaps=!1,wi.needsUpdate=!0),wi}var Ei=class{constructor(e={}){let{canvas:n=g(),context:i=null,depth:o=!0,stencil:s=!1,alpha:c=!1,antialias:u=!1,premultipliedAlpha:d=!0,preserveDrawingBuffer:p=!1,powerPreference:m=`default`,failIfMajorPerformanceCaveat:_=!1,reversedDepthBuffer:y=!1,outputBufferType:x=r}=e;this.isWebGLRenderer=!0;let S;if(i!==null){if(typeof WebGLRenderingContext<`u`&&i instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);S=i.getContextAttributes().alpha}else S=c;let C=x,w=new Set([te,he,Fe]),T=new Set([r,ne,E,ee,h,b]),D=new Uint32Array(4),O=new Int32Array(4),k=new Z,A=null,j=null,re=[],M=[],N=null;this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let P=this,F=!1,ae=null;this._outputColorSpace=De;let oe=0,se=0,I=null,R=-1,le=null,de=new a,fe=new a,z=null,pe=new f(0),me=0,B=n.width,V=n.height,_e=1,ve=null,ye=null,be=new a(0,0,B,V),xe=new a(0,0,B,V),Se=!1,Ce=new L,Te=!1,Ee=!1,H=new ge,Oe=new Z,U=new a,ke={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ae=!1;function je(){return I===null?_e:1}let W=i;function Me(e,t){return n.getContext(e,t)}try{let e={alpha:!0,depth:o,stencil:s,antialias:u,premultipliedAlpha:d,preserveDrawingBuffer:p,powerPreference:m,failIfMajorPerformanceCaveat:_};if(`setAttribute`in n&&n.setAttribute(`data-engine`,`three.js r184`),n.addEventListener(`webglcontextlost`,tt,!1),n.addEventListener(`webglcontextrestored`,nt,!1),n.addEventListener(`webglcontextcreationerror`,rt,!1),W===null){let t=`webgl2`;if(W=Me(t,e),W===null)throw Me(t)?Error(`Error creating WebGL context with your selected attributes.`):Error(`Error creating WebGL context.`)}}catch(e){throw Y(`WebGLRenderer: `+e.message),e}let Ne,Pe,G,Ie,K,q,Le,Re,ze,Be,J,Ve,He,We,Ge,Ke,qe,Je,Ye,Xe,Ze,Qe,$e;function et(){Ne=new Ut(W),Ne.init(),Ze=new mi(W,Ne),Pe=new yt(W,Ne,e,Ze),G=new fi(W,Ne),Pe.reversedDepthBuffer&&y&&G.buffers.depth.setReversed(!0),Ie=new Kt(W),K=new Kr,q=new pi(W,Ne,G,K,Pe,Ze,Ie),Le=new Ht(P),Re=new dt(W),Qe=new _t(W,Re),ze=new Wt(W,Re,Ie,Qe),Be=new Jt(W,ze,Re,Qe,Ie),Je=new qt(W,Pe,q),Ge=new bt(K),J=new Gr(P,Le,Ne,Pe,Qe,Ge),Ve=new xi(P,K),He=new Xr,We=new ri(Ne),qe=new gt(P,Le,G,Be,S,d),Ke=new di(P,Be,Pe),$e=new Si(W,Ie,Pe,G),Ye=new vt(W,Ne,Ie),Xe=new Gt(W,Ne,Ie),Ie.programs=J.programs,P.capabilities=Pe,P.extensions=Ne,P.properties=K,P.renderLists=He,P.shadowMap=Ke,P.state=G,P.info=Ie}et(),C!==1009&&(N=new Xt(C,n.width,n.height,o,s));let X=new vi(P,W);this.xr=X,this.getContext=function(){return W},this.getContextAttributes=function(){return W.getContextAttributes()},this.forceContextLoss=function(){let e=Ne.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Ne.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return _e},this.setPixelRatio=function(e){e!==void 0&&(_e=e,this.setSize(B,V,!1))},this.getSize=function(e){return e.set(B,V)},this.setSize=function(e,r,i=!0){if(X.isPresenting){t(`WebGLRenderer: Can't change size while VR device is presenting.`);return}B=e,V=r,n.width=Math.floor(e*_e),n.height=Math.floor(r*_e),i===!0&&(n.style.width=e+`px`,n.style.height=r+`px`),N!==null&&N.setSize(n.width,n.height),this.setViewport(0,0,e,r)},this.getDrawingBufferSize=function(e){return e.set(B*_e,V*_e).floor()},this.setDrawingBufferSize=function(e,t,r){B=e,V=t,_e=r,n.width=Math.floor(e*r),n.height=Math.floor(t*r),this.setViewport(0,0,e,t)},this.setEffects=function(e){if(C===1009){Y(`THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let n=0;n<e.length;n++)if(e[n].isOutputPass===!0){t(`THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}N.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(de)},this.getViewport=function(e){return e.copy(be)},this.setViewport=function(e,t,n,r){e.isVector4?be.set(e.x,e.y,e.z,e.w):be.set(e,t,n,r),G.viewport(de.copy(be).multiplyScalar(_e).round())},this.getScissor=function(e){return e.copy(xe)},this.setScissor=function(e,t,n,r){e.isVector4?xe.set(e.x,e.y,e.z,e.w):xe.set(e,t,n,r),G.scissor(fe.copy(xe).multiplyScalar(_e).round())},this.getScissorTest=function(){return Se},this.setScissorTest=function(e){G.setScissorTest(Se=e)},this.setOpaqueSort=function(e){ve=e},this.setTransparentSort=function(e){ye=e},this.getClearColor=function(e){return e.copy(qe.getClearColor())},this.setClearColor=function(){qe.setClearColor(...arguments)},this.getClearAlpha=function(){return qe.getClearAlpha()},this.setClearAlpha=function(){qe.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(I!==null){let t=I.texture.format;e=w.has(t)}if(e){let e=I.texture.type,t=T.has(e),n=qe.getClearColor(),r=qe.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(D[0]=i,D[1]=a,D[2]=o,D[3]=r,W.clearBufferuiv(W.COLOR,0,D)):(O[0]=i,O[1]=a,O[2]=o,O[3]=r,W.clearBufferiv(W.COLOR,0,O))}else r|=W.COLOR_BUFFER_BIT}t&&(r|=W.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=W.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&W.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),ae=e},this.dispose=function(){n.removeEventListener(`webglcontextlost`,tt,!1),n.removeEventListener(`webglcontextrestored`,nt,!1),n.removeEventListener(`webglcontextcreationerror`,rt,!1),qe.dispose(),He.dispose(),We.dispose(),K.dispose(),Le.dispose(),Be.dispose(),Qe.dispose(),$e.dispose(),J.dispose(),X.dispose(),X.removeEventListener(`sessionstart`,Q),X.removeEventListener(`sessionend`,$),ft.stop()};function tt(e){e.preventDefault(),ue(`WebGLRenderer: Context Lost.`),F=!0}function nt(){ue(`WebGLRenderer: Context Restored.`),F=!1;let e=Ie.autoReset,t=Ke.enabled,n=Ke.autoUpdate,r=Ke.needsUpdate,i=Ke.type;et(),Ie.autoReset=e,Ke.enabled=t,Ke.autoUpdate=n,Ke.needsUpdate=r,Ke.type=i}function rt(e){Y(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function it(e){let t=e.target;t.removeEventListener(`dispose`,it),at(t)}function at(e){ot(e),K.remove(e)}function ot(e){let t=K.get(e).programs;t!==void 0&&(t.forEach(function(e){J.releaseProgram(e)}),e.isShaderMaterial&&J.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=ke);let o=i.isMesh&&i.matrixWorld.determinant()<0,s=Dt(e,t,n,r,i);G.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=ze.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Qe.setup(i,r,s,n,c);let h,g=Ye;if(c!==null&&(h=Re.get(c),g=Xe,g.setIndex(h)),i.isMesh)r.wireframe===!0?(G.setLineWidth(r.wireframeLinewidth*je()),g.setMode(W.LINES)):g.setMode(W.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),G.setLineWidth(e*je()),i.isLineSegments?g.setMode(W.LINES):i.isLineLoop?g.setMode(W.LINE_LOOP):g.setMode(W.LINE_STRIP)}else i.isPoints?g.setMode(W.POINTS):i.isSprite&&g.setMode(W.TRIANGLES);if(i.isBatchedMesh){if(Ne.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Re.get(c).bytesPerElement:1,o=K.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(W,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function st(e,t,n){e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,Ct(e,t,n),e.side=0,e.needsUpdate=!0,Ct(e,t,n),e.side=2):Ct(e,t,n)}this.compile=function(e,t,n=null){n===null&&(n=e),j=We.get(n),j.init(t),M.push(j),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(j.pushLight(e),e.castShadow&&j.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(j.pushLight(e),e.castShadow&&j.pushShadow(e))}),j.setupLights();let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let t=e.material;if(t){if(Array.isArray(t))for(let i=0;i<t.length;i++){let a=t[i];st(a,n,e),r.add(a)}else st(t,n,e),r.add(t)}}),j=M.pop(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){K.get(e).currentProgram.isReady()&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}Ne.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let ct=null;function lt(e){ct&&ct(e)}function Q(){ft.stop()}function $(){ft.start()}let ft=new ut;ft.setAnimationLoop(lt),typeof self<`u`&&ft.setContext(self),this.setAnimationLoop=function(e){ct=e,X.setAnimationLoop(e),e===null?ft.stop():ft.start()},X.addEventListener(`sessionstart`,Q),X.addEventListener(`sessionend`,$),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){Y(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(F===!0)return;ae!==null&&ae.renderStart(e,t);let n=X.enabled===!0&&X.isPresenting===!0,r=N!==null&&(I===null||n)&&N.begin(P,I);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),X.enabled===!0&&X.isPresenting===!0&&(N===null||N.isCompositing()===!1)&&(X.cameraAutoUpdate===!0&&X.updateCamera(t),t=X.getCamera()),e.isScene===!0&&e.onBeforeRender(P,e,t,I),j=We.get(e,M.length),j.init(t),j.state.textureUnits=q.getTextureUnits(),M.push(j),H.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),Ce.setFromProjectionMatrix(H,ce,t.reversedDepth),Ee=this.localClippingEnabled,Te=Ge.init(this.clippingPlanes,Ee),A=He.get(e,re.length),A.init(),re.push(A),X.enabled===!0&&X.isPresenting===!0){let e=P.xr.getDepthSensingMesh();e!==null&&pt(e,t,-1/0,P.sortObjects)}pt(e,t,0,P.sortObjects),A.finish(),P.sortObjects===!0&&A.sort(ve,ye),Ae=X.enabled===!1||X.isPresenting===!1||X.hasDepthSensing()===!1,Ae&&qe.addToRenderList(A,e),this.info.render.frame++,Te===!0&&Ge.beginShadows();let i=j.state.shadowsArray;if(Ke.render(i,e,t),Te===!0&&Ge.endShadows(),this.info.autoReset===!0&&this.info.reset(),(r&&N.hasRenderPass())===!1){let n=A.opaque,r=A.transmissive;if(j.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];ht(n,r,e,a)}Ae&&qe.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];mt(A,e,n,n.viewport)}}else r.length>0&&ht(n,r,e,t),Ae&&qe.render(e),mt(A,e,t)}I!==null&&se===0&&(q.updateMultisampleRenderTarget(I),q.updateRenderTargetMipmap(I)),r&&N.end(P),e.isScene===!0&&e.onAfterRender(P,e,t),Qe.resetDefaultState(),R=-1,le=null,M.pop(),M.length>0?(j=M[M.length-1],q.setTextureUnits(j.state.textureUnits),Te===!0&&Ge.setGlobalState(P.clippingPlanes,j.state.camera)):j=null,re.pop(),A=re.length>0?re[re.length-1]:null,ae!==null&&ae.renderEnd()};function pt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)j.pushLightProbeGrid(e);else if(e.isLight)j.pushLight(e),e.castShadow&&j.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||Ce.intersectsSprite(e)){r&&U.setFromMatrixPosition(e.matrixWorld).applyMatrix4(H);let t=Be.update(e),i=e.material;i.visible&&A.push(e,t,i,n,U.z,null)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||Ce.intersectsObject(e))){let t=Be.update(e),i=e.material;if(r&&(e.boundingSphere===void 0?(t.boundingSphere===null&&t.computeBoundingSphere(),U.copy(t.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),U.copy(e.boundingSphere.center)),U.applyMatrix4(e.matrixWorld).applyMatrix4(H)),Array.isArray(i)){let r=t.groups;for(let a=0,o=r.length;a<o;a++){let o=r[a],s=i[o.materialIndex];s&&s.visible&&A.push(e,t,s,n,U.z,o)}}else i.visible&&A.push(e,t,i,n,U.z,null)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)pt(i[e],t,n,r)}function mt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;j.setupLightsView(n),Te===!0&&Ge.setGlobalState(P.clippingPlanes,n),r&&G.viewport(de.copy(r)),i.length>0&&xt(i,t,n),a.length>0&&xt(a,t,n),o.length>0&&xt(o,t,n),G.buffers.depth.setTest(!0),G.buffers.depth.setMask(!0),G.buffers.color.setMask(!0),G.setPolygonOffset(!1)}function ht(e,t,n,i){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(j.state.transmissionRenderTarget[i.id]===void 0){let e=Ne.has(`EXT_color_buffer_half_float`)||Ne.has(`EXT_color_buffer_float`);j.state.transmissionRenderTarget[i.id]=new v(1,1,{generateMipmaps:!0,type:e?Ue:r,minFilter:we,samples:Math.max(4,Pe.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:l.workingColorSpace})}let a=j.state.transmissionRenderTarget[i.id],o=i.viewport||de;a.setSize(o.z*P.transmissionResolutionScale,o.w*P.transmissionResolutionScale);let c=P.getRenderTarget(),u=P.getActiveCubeFace(),d=P.getActiveMipmapLevel();P.setRenderTarget(a),P.getClearColor(pe),me=P.getClearAlpha(),me<1&&P.setClearColor(16777215,.5),P.clear(),Ae&&qe.render(n);let f=P.toneMapping;P.toneMapping=0;let p=i.viewport;if(i.viewport!==void 0&&(i.viewport=void 0),j.setupLightsView(i),Te===!0&&Ge.setGlobalState(P.clippingPlanes,i),xt(e,n,i),q.updateMultisampleRenderTarget(a),q.updateRenderTargetMipmap(a),Ne.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let r=0,a=t.length;r<a;r++){let{object:a,geometry:o,material:s,group:c}=t[r];if(s.side===2&&a.layers.test(i.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,St(a,n,i,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(q.updateMultisampleRenderTarget(a),q.updateRenderTargetMipmap(a))}P.setRenderTarget(c,u,d),P.setClearColor(pe,me),p!==void 0&&(i.viewport=p),P.toneMapping=f}function xt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&St(o,t,n,s,l,c)}}function St(e,t,n,r,i,a){e.onBeforeRender(P,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(P,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,P.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,P.renderBufferDirect(n,t,r,i,e,a),i.side=2):P.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(P,t,n,r,i,a)}function Ct(e,t,n){t.isScene!==!0&&(t=ke);let r=K.get(e),i=j.state.lights,a=j.state.shadowsArray,o=i.state.version,s=J.getParameters(e,i.state,a,t,n,j.state.lightProbeGridArray),c=J.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Le.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,it),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return Tt(e,s),d}else s.uniforms=J.getUniforms(e),ae!==null&&e.isNodeMaterial&&ae.build(e,n,s),e.onBeforeCompile(s,P),d=J.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ge.uniform),Tt(e,s),r.needsLights=kt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=j.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function wt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=ir.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function Tt(e,t){let n=K.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Et(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];k.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(k))return n}return null}function Dt(e,t,n,r,i){t.isScene!==!0&&(t=ke),q.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=I===null?P.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:l.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,u=Le.get(r.envMap||o,c),d=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,f=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),p=!!n.morphAttributes.position,m=!!n.morphAttributes.normal,h=!!n.morphAttributes.color,g=0;r.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(g=P.toneMapping);let _=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,v=_===void 0?0:_.length,y=K.get(r),b=j.state.lights;if(Te===!0&&(Ee===!0||e!==le)){let t=e===le&&r.id===R;Ge.setState(r,e,t)}let x=!1;r.version===y.__version?y.needsLights&&y.lightsStateVersion!==b.state.version?x=!0:y.outputColorSpace===s?i.isBatchedMesh&&y.batching===!1||!i.isBatchedMesh&&y.batching===!0||i.isBatchedMesh&&y.batchingColor===!0&&i.colorTexture===null||i.isBatchedMesh&&y.batchingColor===!1&&i.colorTexture!==null||i.isInstancedMesh&&y.instancing===!1||!i.isInstancedMesh&&y.instancing===!0||i.isSkinnedMesh&&y.skinning===!1||!i.isSkinnedMesh&&y.skinning===!0||i.isInstancedMesh&&y.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&y.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&y.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&y.instancingMorph===!1&&i.morphTexture!==null?x=!0:y.envMap===u?r.fog===!0&&y.fog!==a||y.numClippingPlanes!==void 0&&(y.numClippingPlanes!==Ge.numPlanes||y.numIntersection!==Ge.numIntersection)?x=!0:y.vertexAlphas===d&&y.vertexTangents===f&&y.morphTargets===p&&y.morphNormals===m&&y.morphColors===h&&y.toneMapping===g&&y.morphTargetsCount===v?!!y.lightProbeGrid!=j.state.lightProbeGridArray.length>0&&(x=!0):x=!0:x=!0:x=!0:(x=!0,y.__version=r.version);let S=y.currentProgram;x===!0&&(S=Ct(r,t,i),ae&&r.isNodeMaterial&&ae.onUpdateProgram(r,S,y));let C=!1,w=!1,T=!1,E=S.getUniforms(),D=y.uniforms;if(G.useProgram(S.program)&&(C=!0,w=!0,T=!0),r.id!==R&&(R=r.id,w=!0),y.needsLights){let e=Et(j.state.lightProbeGridArray,i);y.lightProbeGrid!==e&&(y.lightProbeGrid=e,w=!0)}if(C||le!==e){G.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),E.setValue(W,`projectionMatrix`,e.projectionMatrix),E.setValue(W,`viewMatrix`,e.matrixWorldInverse);let t=E.map.cameraPosition;t!==void 0&&t.setValue(W,Oe.setFromMatrixPosition(e.matrixWorld)),Pe.logarithmicDepthBuffer&&E.setValue(W,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&E.setValue(W,`isOrthographic`,e.isOrthographicCamera===!0),le!==e&&(le=e,w=!0,T=!0)}if(y.needsLights&&(b.state.directionalShadowMap.length>0&&E.setValue(W,`directionalShadowMap`,b.state.directionalShadowMap,q),b.state.spotShadowMap.length>0&&E.setValue(W,`spotShadowMap`,b.state.spotShadowMap,q),b.state.pointShadowMap.length>0&&E.setValue(W,`pointShadowMap`,b.state.pointShadowMap,q)),i.isSkinnedMesh){E.setOptional(W,i,`bindMatrix`),E.setOptional(W,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),E.setValue(W,`boneTexture`,e.boneTexture,q))}i.isBatchedMesh&&(E.setOptional(W,i,`batchingTexture`),E.setValue(W,`batchingTexture`,i._matricesTexture,q),E.setOptional(W,i,`batchingIdTexture`),E.setValue(W,`batchingIdTexture`,i._indirectTexture,q),E.setOptional(W,i,`batchingColorTexture`),i._colorsTexture!==null&&E.setValue(W,`batchingColorTexture`,i._colorsTexture,q));let ee=n.morphAttributes;if((ee.position!==void 0||ee.normal!==void 0||ee.color!==void 0)&&Je.update(i,n,S),(w||y.receiveShadow!==i.receiveShadow)&&(y.receiveShadow=i.receiveShadow,E.setValue(W,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(D.envMapIntensity.value=t.environmentIntensity),D.dfgLUT!==void 0&&(D.dfgLUT.value=Ti()),w){if(E.setValue(W,`toneMappingExposure`,P.toneMappingExposure),y.needsLights&&Ot(D,T),a&&r.fog===!0&&Ve.refreshFogUniforms(D,a),Ve.refreshMaterialUniforms(D,r,_e,V,j.state.transmissionRenderTarget[e.id]),y.needsLights&&y.lightProbeGrid){let e=y.lightProbeGrid;D.probesSH.value=e.texture,D.probesMin.value.copy(e.boundingBox.min),D.probesMax.value.copy(e.boundingBox.max),D.probesResolution.value.copy(e.resolution)}ir.upload(W,wt(y),D,q)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(ir.upload(W,wt(y),D,q),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&E.setValue(W,`center`,i.center),E.setValue(W,`modelViewMatrix`,i.modelViewMatrix),E.setValue(W,`normalMatrix`,i.normalMatrix),E.setValue(W,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];$e.update(n,S),$e.bind(n,S)}}return S}function Ot(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function kt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return oe},this.getActiveMipmapLevel=function(){return se},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(e,t,n){let r=K.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),K.get(e.texture).__webglTexture=t,K.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=K.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0};let At=W.createFramebuffer();this.setRenderTarget=function(e,t=0,n=0){I=e,oe=t,se=n;let r=null,i=!1,a=!1;if(e){let o=K.get(e);if(o.__useDefaultFramebuffer!==void 0){G.bindFramebuffer(W.FRAMEBUFFER,o.__webglFramebuffer),de.copy(e.viewport),fe.copy(e.scissor),z=e.scissorTest,G.viewport(de),G.scissor(fe),G.setScissorTest(z),R=-1;return}if(o.__webglFramebuffer===void 0)q.setupRenderTarget(e);else if(o.__hasExternalTextures)q.rebindTextures(e,K.get(e.texture).__webglTexture,K.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&K.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.`);q.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=K.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&q.useMultisampledRTT(e)===!1?K.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,de.copy(e.viewport),fe.copy(e.scissor),z=e.scissorTest}else de.copy(be).multiplyScalar(_e).floor(),fe.copy(xe).multiplyScalar(_e).floor(),z=Se;if(n!==0&&(r=At),G.bindFramebuffer(W.FRAMEBUFFER,r)&&G.drawBuffers(e,r),G.viewport(de),G.scissor(fe),G.setScissorTest(z),i){let r=K.get(e.texture);W.framebufferTexture2D(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=K.get(e.textures[t]);W.framebufferTextureLayer(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=K.get(e.texture);W.framebufferTexture2D(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_2D,t.__webglTexture,n)}R=-1},this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){Y(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=K.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){G.bindFramebuffer(W.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;if(e.textures.length>1&&W.readBuffer(W.COLOR_ATTACHMENT0+s),!Pe.textureFormatReadable(c)){Y(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(!Pe.textureTypeReadable(l)){Y(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&W.readPixels(t,n,r,i,Ze.convert(c),Ze.convert(l),a)}finally{let e=I===null?null:K.get(I).__webglFramebuffer;G.bindFramebuffer(W.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=K.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){G.bindFramebuffer(W.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;if(e.textures.length>1&&W.readBuffer(W.COLOR_ATTACHMENT0+s),!Pe.textureFormatReadable(l))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(!Pe.textureTypeReadable(u))throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let d=W.createBuffer();W.bindBuffer(W.PIXEL_PACK_BUFFER,d),W.bufferData(W.PIXEL_PACK_BUFFER,a.byteLength,W.STREAM_READ),W.readPixels(t,n,r,i,Ze.convert(l),Ze.convert(u),0);let f=I===null?null:K.get(I).__webglFramebuffer;G.bindFramebuffer(W.FRAMEBUFFER,f);let p=W.fenceSync(W.SYNC_GPU_COMMANDS_COMPLETE,0);return W.flush(),await ie(W,p,4),W.bindBuffer(W.PIXEL_PACK_BUFFER,d),W.getBufferSubData(W.PIXEL_PACK_BUFFER,0,a),W.deleteBuffer(d),W.deleteSync(p),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;q.setTexture2D(e,0),W.copyTexSubImage2D(W.TEXTURE_2D,n,0,0,o,s,i,a),G.unbindTexture()};let jt=W.createFramebuffer(),Mt=W.createFramebuffer();this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Ze.convert(t.format),_=Ze.convert(t.type),v;t.isData3DTexture?(q.setTexture3D(t,0),v=W.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(q.setTexture2DArray(t,0),v=W.TEXTURE_2D_ARRAY):(q.setTexture2D(t,0),v=W.TEXTURE_2D),G.activeTexture(W.TEXTURE0),G.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,t.flipY),G.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),G.pixelStorei(W.UNPACK_ALIGNMENT,t.unpackAlignment);let y=G.getParameter(W.UNPACK_ROW_LENGTH),b=G.getParameter(W.UNPACK_IMAGE_HEIGHT),x=G.getParameter(W.UNPACK_SKIP_PIXELS),S=G.getParameter(W.UNPACK_SKIP_ROWS),C=G.getParameter(W.UNPACK_SKIP_IMAGES);G.pixelStorei(W.UNPACK_ROW_LENGTH,h.width),G.pixelStorei(W.UNPACK_IMAGE_HEIGHT,h.height),G.pixelStorei(W.UNPACK_SKIP_PIXELS,l),G.pixelStorei(W.UNPACK_SKIP_ROWS,u),G.pixelStorei(W.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=K.get(e),r=K.get(t),h=K.get(n.__renderTarget),g=K.get(r.__renderTarget);G.bindFramebuffer(W.READ_FRAMEBUFFER,h.__webglFramebuffer),G.bindFramebuffer(W.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(W.framebufferTextureLayer(W.READ_FRAMEBUFFER,W.COLOR_ATTACHMENT0,K.get(e).__webglTexture,i,d+n),W.framebufferTextureLayer(W.DRAW_FRAMEBUFFER,W.COLOR_ATTACHMENT0,K.get(t).__webglTexture,a,m+n)),W.blitFramebuffer(l,u,o,s,f,p,o,s,W.DEPTH_BUFFER_BIT,W.NEAREST);G.bindFramebuffer(W.READ_FRAMEBUFFER,null),G.bindFramebuffer(W.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||K.has(e)){let n=K.get(e),r=K.get(t);G.bindFramebuffer(W.READ_FRAMEBUFFER,jt),G.bindFramebuffer(W.DRAW_FRAMEBUFFER,Mt);for(let e=0;e<c;e++)w?W.framebufferTextureLayer(W.READ_FRAMEBUFFER,W.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):W.framebufferTexture2D(W.READ_FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_2D,n.__webglTexture,i),T?W.framebufferTextureLayer(W.DRAW_FRAMEBUFFER,W.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):W.framebufferTexture2D(W.DRAW_FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_2D,r.__webglTexture,a),i===0?T?W.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):W.copyTexSubImage2D(v,a,f,p,l,u,o,s):W.blitFramebuffer(l,u,o,s,f,p,o,s,W.COLOR_BUFFER_BIT,W.NEAREST);G.bindFramebuffer(W.READ_FRAMEBUFFER,null),G.bindFramebuffer(W.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?W.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?W.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):W.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?W.texSubImage2D(W.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?W.compressedTexSubImage2D(W.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):W.texSubImage2D(W.TEXTURE_2D,a,f,p,o,s,g,_,h);G.pixelStorei(W.UNPACK_ROW_LENGTH,y),G.pixelStorei(W.UNPACK_IMAGE_HEIGHT,b),G.pixelStorei(W.UNPACK_SKIP_PIXELS,x),G.pixelStorei(W.UNPACK_SKIP_ROWS,S),G.pixelStorei(W.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&W.generateMipmap(v),G.unbindTexture()},this.initRenderTarget=function(e){K.get(e).__webglFramebuffer===void 0&&q.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?q.setTextureCube(e,0):e.isData3DTexture?q.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?q.setTexture2DArray(e,0):q.setTexture2D(e,0),G.unbindTexture()},this.resetState=function(){oe=0,se=0,I=null,G.reset(),Qe.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return ce}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=l._getDrawingBufferColorSpace(e),t.unpackColorSpace=l._getUnpackColorSpace()}},Di={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},Oi=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},ki=new ke(-1,1,1,-1,0,1),Ai=new class extends rt{constructor(){super(),this.setAttribute(`position`,new I([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new I([0,2,0,0,2,0],2))}},ji=class{constructor(e){this._mesh=new J(Ai,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,ki)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},Mi=class extends Oi{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof st?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Pe.clone(e.uniforms),this.material=new st({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new ji(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Ni=class extends Oi{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},Pi=class extends Oi{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},Fi=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new N);this._width=n.width,this._height=n.height,t=new v(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ue}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Mi(Di),this.copyPass.material.blending=0,this.timer=new ae}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}Ni!==void 0&&(r instanceof Ni?n=!0:r instanceof Pi&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new N);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},Ii={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},Li=class extends Oi{constructor(){super(),this.isOutputPass=!0,this.uniforms=Pe.clone(Ii.uniforms),this.material=new Be({name:Ii.name,uniforms:this.uniforms,vertexShader:Ii.vertexShader,fragmentShader:Ii.fragmentShader}),this._fsQuad=new ji(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},l.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},Ri=class extends Oi{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new f}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},zi={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new f(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},Bi=class e extends Oi{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new N(256,256):new N(e.x,e.y),this.clearColor=new f(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new v(i,a,{type:Ue}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new v(i,a,{type:Ue});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new v(i,a,{type:Ue});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=zi;this.highPassUniforms=Pe.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new st({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new N(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new Z(1,1,1),new Z(1,1,1),new Z(1,1,1),new Z(1,1,1),new Z(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Pe.clone(Di.uniforms),this.blendMaterial=new st({uniforms:this.copyUniforms,vertexShader:Di.vertexShader,fragmentShader:Di.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new f,this._oldClearAlpha=1,this._basic=new Je,this._fsQuad=new ji(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new N(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);return new st({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new N(.5,.5)},direction:{value:new N(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new st({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Bi.BlurDirectionX=new N(1,0),Bi.BlurDirectionY=new N(0,1);var Vi=`
  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`,Hi=`
  precision highp float;

  varying vec2 vUv;
  varying vec3 vWorldPos;

  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uScale;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv * vec2(uScale, uScale * 0.42);
    float n = fbm(uv + vec2(uTime * 0.012, uTime * 0.007));
    n = smoothstep(0.28, 0.82, n);

    float edgeX = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.78, vUv.x);
    float edgeY = smoothstep(0.0, 0.28, vUv.y) * smoothstep(1.0, 0.52, vUv.y);
    float alpha = n * edgeX * edgeY * uOpacity;

    if (alpha < 0.018) discard;

    vec3 lit = mix(uColor * 0.78, vec3(0.94, 0.96, 0.99), n * 0.5);
    gl_FragColor = vec4(lit, alpha);
  }
`,Ui=`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vObjectPos;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vObjectPos = position;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`,Wi=`
  precision highp float;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vObjectPos;

  uniform vec3 uIce;
  uniform vec3 uGlow;
  uniform vec3 uStone;
  uniform float uMix;
  uniform float uSeed;

  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash(i);
    float n100 = hash(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash(i + vec3(1.0, 1.0, 1.0));
    float nx00 = mix(n000, n100, f.x);
    float nx10 = mix(n010, n110, f.x);
    float nx01 = mix(n001, n101, f.x);
    float nx11 = mix(n011, n111, f.x);
    return mix(mix(nx00, nx10, f.y), mix(nx01, nx11, f.y), f.z);
  }

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(cameraPosition - vWorldPos);
    float ndv = max(dot(N, V), 0.0);
    float fresnel = pow(1.0 - ndv, 2.8);

    vec3 L = normalize(vec3(0.35, 0.82, 0.28));
    float diff = 0.62 + max(dot(N, L), 0.0) * 0.28;

    float grain = noise(vObjectPos * 2.2 + uSeed) * 0.08;
    float crack = smoothstep(0.78, 0.92, noise(vObjectPos * 6.4 + uSeed * 2.1)) * 0.12;

    vec3 base = mix(uIce, uStone, uMix);
    vec3 glow = mix(uGlow, mix(uGlow, uStone, 0.42) * 1.08, uMix);
    vec3 ice = base * diff + grain;
    ice = mix(ice, glow, 0.1 + fresnel * 0.62 + crack);
    ice += glow * pow(fresnel, 1.6) * 0.35;
    float alpha = 0.84 + fresnel * 0.12;

    gl_FragColor = vec4(ice, alpha);
  }
`,Gi=[new f(6269856),new f(13938774),new f(12868174),new f(15659766),new f(4012632)];function Ki(e=Math.random(),t=null){let n=.88+Math.random()*.1;return new st({uniforms:{uIce:{value:new f().setRGB(.48*n,.53*n,.6*n)},uGlow:{value:new f(16054783)},uStone:{value:(t??new f(8952234)).clone()},uMix:{value:0},uSeed:{value:e*12.6}},vertexShader:Ui,fragmentShader:Wi,transparent:!0,depthWrite:!0})}function qi(e,t){e.traverse(e=>{let n=e.material;n?.uniforms?.uMix&&(n.uniforms.uMix.value=t)})}function Ji(e,t=.92){let n=new Qe({color:e,roughness:.42,metalness:.18,transparent:!0,opacity:t,emissive:new f(1054752),emissiveIntensity:.22});return n.userData.baseOpacity=t,n}function Yi(e=16055295){let t=new Je({color:e,transparent:!0,opacity:.95});return t.userData.baseOpacity=.95,t}function Xi(e,t){e.visible=t>.03,e.traverse(e=>{let n=e;n.material&&(Array.isArray(n.material)?n.material:[n.material]).forEach(e=>{if(!(`opacity`in e))return;let n=Number(e.userData.baseOpacity??1);e.transparent=!0,e.opacity=n*t})})}function Zi(){let e=new C;e.name=`Kun`;let t=Ji(5134694,.96),n=new J(new it(1,24,16),t);n.scale.set(6.2,1.35,2.1),e.add(n);let r=new J(new it(1,18,12),Ji(12174544,.55));r.scale.set(4.6,.85,1.35),r.position.set(.6,-.7,0),e.add(r);let i=new J(new it(1,16,12),t);i.position.set(5.8,.25,0),i.scale.set(1.5,1.15,1.25),e.add(i);let a=new J(new k(.7,2.2,8),t);a.rotation.z=-Math.PI/2,a.position.set(7.4,-.1,0),e.add(a);let o=new J(new it(.28,10,8),Yi());o.position.set(6.3,.5,.55),e.add(o);let s=o.clone();s.position.z=-.9,e.add(s);let c=new J(new k(1.4,5.5,8),t);c.rotation.z=Math.PI/2,c.position.set(-6.8,.15,0),e.add(c);for(let n=0;n<6;n++){let r=new J(new ot(2.4,.12,1.1),t),i=n<3?1:-1,a=n%3*3.2-2;r.position.set(a,.2,i*2.1),r.rotation.y=i*.4,e.add(r)}let l=new ct(15660543,4.5,28,1.6);return l.position.set(3,1.2,0),e.add(l),e.position.set(-14,-42,2),e.scale.setScalar(.92),e}function Qi(){let e=new C;e.name=`Peng`;let t=Ji(5858933,.96),n=new J(new it(1,18,12),t);n.scale.set(2.1,1.05,3.6),e.add(n);let r=new J(new it(.7,12,10),t);r.position.set(0,.55,3.2),e.add(r);let i=new J(new k(.22,1.3,6),t);i.rotation.x=Math.PI/2,i.position.set(0,.35,4.15),e.add(i);let a=new J(new it(.12,8,8),Yi(16777215));a.position.set(.32,.7,3.45),e.add(a);let o=new ot(14,.16,4.2),s=new J(o,t);s.name=`wingL`,s.position.set(-7.2,.3,.2),e.add(s);let c=new J(o,t);return c.name=`wingR`,c.position.set(7.2,.3,.2),e.add(c),e.position.set(0,34,-16),e}function $i(){let e=new C;e.name=`Yinglong`;let t=Ji(4871779,.96),n=new C;n.name=`spine`;for(let r=0;r<14;r++){let i=new J(new it(1,12,10),t);i.name=`seg`;let a=r/13;if(i.scale.setScalar(1.15-a*.7),i.position.set(Math.sin(r*.62)*2.4,r*.55,-r*.95),n.add(i),r%2==0&&r<10){let n=new J(new k(.28,1.1,5),t);n.position.copy(i.position).add(new Z(0,.9,0)),e.add(n)}}let r=new J(new it(.95,14,10),t);r.position.set(.4,.3,1.4),r.scale.set(1.15,.85,1.3),e.add(r);let i=new J(new k(.16,1.6,6),t);i.position.set(-.45,1.15,1.1),i.rotation.z=.35,e.add(i);let a=i.clone();a.position.x=.45,a.rotation.z=-.35,e.add(a);let o=new J(new it(.14,8,8),Yi());return o.position.set(.55,.45,2.15),e.add(o),e.add(n),e.position.set(-1,16,-34),e.rotation.y=.5,e}function ea(){let e=new C;e.name=`NineTail`;let t=Ji(7042690,.96),n=new J(new it(1,16,12),t);n.scale.set(1.15,.85,2.05),e.add(n);let r=new J(new it(.62,12,10),t);r.position.set(0,.55,1.7),e.add(r);let i=new J(new k(.18,.7,5),t);i.position.set(-.28,1.15,1.55),e.add(i);let a=i.clone();a.position.x=.28,e.add(a);let o=new J(new it(.08,8,8),Yi());o.position.set(.22,.62,2.12),e.add(o);let s=new C;s.name=`tails`;for(let e=0;e<9;e++){let n=new J(new k(.22,2.8,6),t);n.position.set((e-4)*.28,.15,-1.7),n.rotation.x=1.05,n.rotation.z=(e-4)*.16,s.add(n)}return e.add(s),e.position.set(2.4,5.2,-48),e}function ta(){let e=new C;return e.name=`Buzhou`,[{s:[4.2,11,3.4],p:[0,5.2,0],r:[.08,.2,-.05]},{s:[2.4,7.4,2.2],p:[-2.4,4.1,-1.2],r:[.2,-.4,.1]},{s:[1.8,5.2,1.6],p:[2.6,3.4,.8],r:[-.15,.3,.2]},{s:[3.1,3.2,2.8],p:[.4,1.2,1.6],r:[.1,.1,0]},{s:[1.2,4.8,1.1],p:[-1.1,7.8,.4],r:[.4,.2,-.3]}].forEach(t=>{let n=new J(new ot(1,1,1),Ki(Math.random()));n.scale.set(t.s[0],t.s[1],t.s[2]),n.position.set(t.p[0],t.p[1],t.p[2]),n.rotation.set(t.r[0],t.r[1],t.r[2]),e.add(n)}),e.position.set(1,14,-34),e}function na(e,t,n,r,i,a,o){let s=K(a,.48,.54,.64,.72);Xi(e,s),e.position.x=U(-14,16,Te((a-.48)/.22,0,1)),e.position.y=-42+Math.sin(o*.7)*1.4,e.position.z=2,e.rotation.y=.9,e.rotation.z=Math.sin(o*.55)*.08,e.scale.setScalar(1.08+s*.1);let c=K(a,.62,.68,.78,.86);Xi(t,c),t.position.set(Math.sin(o*.25)*2.4,U(18,40,Te((a-.62)/.18,0,1)),-16),t.rotation.x=-.35;let l=Math.sin(o*3.4)*.32*c,u=t.getObjectByName(`wingL`),d=t.getObjectByName(`wingR`);u&&(u.rotation.z=.28+l),d&&(d.rotation.z=-.28-l),Xi(i,K(a,.74,.8,.9,.96)),i.position.set(1,14,-34),i.rotation.y=o*.04,Xi(n,K(a,.76,.82,.9,.97)),n.position.set(-1+Math.sin(o*.4)*.8,16,-34),n.rotation.y=.45+Math.sin(o*.5)*.12,n.getObjectByName(`spine`)?.children.forEach((e,t)=>{e.name===`seg`&&(e.position.x=Math.sin(o*1.4+t*.45)*2.4)}),Xi(r,K(a,.84,.9,.98,1)),r.position.set(2.4,5.2+Math.sin(o*1.1)*.2,-48),r.rotation.y=-.35+Math.sin(o*.6)*.08,r.getObjectByName(`tails`)?.children.forEach((e,t)=>{e.rotation.y=Math.sin(o*2.2+t)*.22})}function ra(e){let t=new C;return t.name=`Clouds`,(e?[{y:8,z:4,w:40,h:70,opacity:.22,scale:2.4,tilt:0,yaw:.2},{y:-18,z:-6,w:70,h:36,opacity:.28,scale:2.2,tilt:-Math.PI*.5,yaw:0},{y:-42,z:2,w:80,h:40,opacity:.26,scale:2.1,tilt:-Math.PI*.48,yaw:.1},{y:28,z:-12,w:60,h:28,opacity:.2,scale:1.8,tilt:-.2,yaw:0}]:[{y:10,z:6,w:48,h:80,opacity:.2,scale:2.2,tilt:.05,yaw:.35},{y:-6,z:-4,w:90,h:40,opacity:.28,scale:2.6,tilt:-Math.PI*.5,yaw:0},{y:-24,z:3,w:70,h:90,opacity:.18,scale:2,tilt:0,yaw:-.6},{y:-44,z:-8,w:100,h:44,opacity:.3,scale:2.4,tilt:-Math.PI*.48,yaw:.12},{y:22,z:-14,w:80,h:32,opacity:.22,scale:2,tilt:-.25,yaw:.2},{y:40,z:-20,w:70,h:28,opacity:.18,scale:1.8,tilt:-.15,yaw:0}]).forEach((e,n)=>{let r=new st({uniforms:{uTime:{value:n*2.4},uColor:{value:new f(15199732)},uOpacity:{value:e.opacity},uScale:{value:e.scale}},vertexShader:Vi,fragmentShader:Hi,transparent:!0,depthWrite:!1,side:2}),i=new J(new X(e.w,e.h,1,1),r);i.rotation.x=e.tilt,i.rotation.y=e.yaw,i.position.set((n%2==0?-5:6)+n*.3,e.y,e.z),i.renderOrder=n,t.add(i)}),t}function ia(e,t,n){e.children.forEach((e,r)=>{let i=e;i.material.uniforms?.uTime&&(i.material.uniforms.uTime.value=t*(.65+r*.08)),i.position.x+=Math.sin(t*.07+r)*n*.12})}function aa(){let e=new C;e.name=`IceHouse`;let t=G(),n=new C;n.name=`Markers`;let r=[{y:.08,r:4.5,count:16,h:.98},{y:.98,r:3.85,count:14,h:.9},{y:1.82,r:3.05,count:12,h:.84},{y:2.52,r:2.2,count:10,h:.76},{y:3.16,r:1.28,count:8,h:.64},{y:3.62,r:.38,count:1,h:.4}],i=[`22`,`45`,`北冥`,`不周`,`16`,`方壺`,`58`,`鯤`],a=0;r.forEach((r,o)=>{for(let s=0;s<r.count;s++){let c=s/r.count*Math.PI*2+o*.14;if(o<2&&Math.abs(Math.sin(c))<.22&&Math.cos(c)>.55)continue;let l=(Math.random()-.5)*.16,u=r.r+l,d=Math.random()>.62?.45+Math.random()*.95:.1+Math.random()*.12,f=1.18+Math.random()*.38,p=r.h*(.9+Math.random()*.16),m=.92+Math.random()*.32,h=new ot(f,p,m),g=Ki(Math.random()),_=new J(h,g);if(_.position.set(Math.cos(c)*(u+d),r.y+p*.5,Math.sin(c)*(u+d)),_.rotation.set((Math.random()-.5)*.1,c+Math.PI/2+(Math.random()-.5)*.12,(Math.random()-.5)*.08),_.scale.setScalar(.86),e.add(_),(d>.4||o<4&&s%3==o%3)&&a<i.length){let e=_.position.clone();e.y+=p*.52,oa(n,t,e,i[a]??`0`),a+=1}}});let o=new J(new p(4.7,.62,8,20),new Qe({color:12041928,roughness:.92,metalness:.04,flatShading:!0}));o.rotation.x=Math.PI/2,o.position.y=-.22,e.add(o);let s=new J(new it(1.55,20,14),new Je({color:16777215}));s.position.set(0,2.85,0),s.scale.set(.5,.42,.5),e.add(s);let c=Xe(`rgba(255, 255, 255, 1)`,`rgba(210, 228, 248, 0.42)`);c.position.set(0,1.72,0),c.scale.set(6.8,6.8,1),e.add(c);let l=new ct(16251903,12,22,1.4);l.position.set(0,1.65,0),e.add(l);let u=[],d=n.children.filter(e=>e instanceof P);if(d.forEach((e,t)=>{if(t===0)return;let n=d[t-1];n&&(u.push(n.position.x,n.position.y,n.position.z),u.push(e.position.x,e.position.y,e.position.z))}),u.length>0){let e=new rt;e.setAttribute(`position`,new I(u,3)),n.add(new re(e,new fe({color:15923199,transparent:!0,opacity:.55})))}return e.add(n),e.position.set(0,.15,0),e}function oa(e,t,n,r){let i=new P(new s({map:t,transparent:!0,depthTest:!1,color:16777215}));i.position.copy(n),i.scale.set(.26,.26,1),e.add(i);let a=new P(new s({map:ve(r),transparent:!0,depthTest:!1}));a.position.copy(n).add(new Z(.4,.1,.08)),a.scale.set(.78,.38,1),e.add(a)}function sa(e){return Gi[e%Gi.length]??Gi[0]}function ca(){let e=new C;e.name=`IceShaft`;for(let t=0;t<86;t++){let n=t/85,r=16-n*78,i=t*2.399+n*4.2,a=t%9==0?2.6+Math.random()*.7:5.4+Math.random()*7.5,o=new J(new ot(.7+Math.random()*2.4,.55+Math.random()*2.1,.7+Math.random()*2.2),Ki(Math.random(),sa(t)));o.position.set(Math.cos(i)*a,r,Math.sin(i)*a*.72-n*8),!(o.position.distanceTo(new Z(.12,-40.4,.22))<5.4)&&(o.rotation.set(Math.random()*.8,i,Math.random()*.8),e.add(o))}for(let t=0;t<18;t++){let n=8-t*3.4,r=t*1.37,i=new J(new ot(2.4+t%3,.7+t%4*.4,3.2+t%2),Ki(.2+t%5*.15,sa(t+2)));i.position.set(Math.cos(r)*2.35,n,Math.sin(r)*2.1),!(i.position.distanceTo(new Z(.12,-40.4,.22))<5.4)&&(i.rotation.set(t%3*.2,r,t%4*-.15),e.add(i))}return e}var la=[{id:`escape`,name:`山海密室`,seal:`謎`,hint:`裂冰之後，密室自開`,href:`../shanhai-jing-escape/index.html`},{id:`monopoly`,name:`山海經大富翁`,seal:`遊`,hint:`神獸巡境，環山為局`,href:`../taoyuan-wanxiang-monopoly/`},{id:`isles`,name:`山海浮島`,seal:`島`,hint:`北冥盡處，方壺浮起`,href:`../shanhaijing-monopoly-3d/`}];function ua(e){let t=document.createElement(`canvas`);t.width=512,t.height=768;let n=t.getContext(`2d`);n&&(n.fillStyle=`#c5d0dc`,n.fillRect(0,0,512,768),n.fillStyle=`rgba(244, 250, 255, 0.92)`,n.font=`700 220px "Noto Sans TC", sans-serif`,n.textAlign=`center`,n.textBaseline=`middle`,n.fillText(e,256,384));let r=new o(t);return r.colorSpace=De,r}function da(){let e=new C;e.name=`Relics`;let t=[],n=[{x:-5.5,y:7,z:-52},{x:4.8,y:-1.5,z:-56},{x:.4,y:3.2,z:-62}];return la.forEach((r,i)=>{let a=n[i];if(!a)return;let o=new J(new ot(2.4,3.4,2.4),Ki(.3+i*.22));o.position.set(a.x,a.y,a.z),o.userData.jade=r,o.userData.appear=.86+i*.04,e.add(o),t.push(o);let s=new J(new ot(.8,1.3,.12),new Je({map:ua(r.seal),transparent:!0,opacity:.9}));s.position.copy(o.position),e.add(s)}),{group:e,meshes:t}}function fa(e,t){e.forEach(e=>{let n=Number(e.userData.appear??.9);e.visible=K(t,n,n+.05,1.2,1.3)>.05})}function pa(){let e=new C;return e.name=`IceWalls`,[{pos:[0,-28,-22],rot:[-.12,0,0],w:90,h:70,color:11450050},{pos:[-38,-8,-8],rot:[0,1.15,.08],w:70,h:90,color:10134704},{pos:[42,12,-18],rot:[0,-1.05,-.06],w:64,h:80,color:12107978},{pos:[0,42,-28],rot:[.35,0,0],w:110,h:50,color:12897494},{pos:[8,-52,6],rot:[-1.15,.2,0],w:80,h:40,color:9345188}].forEach(t=>{let n=new X(t.w,t.h,36,28);be(n,.05,10);let r=new J(n,new Qe({color:t.color,roughness:.94,metalness:.04,flatShading:!0,side:2}));r.position.set(t.pos[0],t.pos[1],t.pos[2]),r.rotation.set(t.rot[0],t.rot[1],t.rot[2]),e.add(r)}),e}var ma=[{until:.14,name:`冰屋`,verse:`北冥冰封。屋從雪裡長出來，縫裡有光。`,beastName:``,beastLine:``,hint:`Scroll down to discover`},{until:.22,name:`入縫`,verse:`鑽進冰塊縫裡。上下左右都是冰，沒有地面。`,beastName:``,beastLine:``,hint:`Into the crack`},{until:.3,name:`下墜`,verse:`縫的另一頭是深淵。鏡頭往下掉，冰塊從身側掠過。`,beastName:``,beastLine:``,hint:`Falling`},{until:.46,name:`盤古`,verse:`天地渾沌如雞子。盤古生在其中。`,beastName:`盤古`,beastLine:`生於雞子`,hint:`The egg of chaos`},{until:.62,name:`鯤`,verse:`墜入北冥。魚不在前方的地平線上，而從你身側游過。`,beastName:`鯤`,beastLine:`從冰海深處游來`,hint:`A fish named Kun`},{until:.76,name:`鵬`,verse:`仰頭。化而為鳥，整座冰層被翅膀掀開。`,beastName:`鵬`,beastLine:`破冰升空`,hint:`Then it becomes a bird`},{until:.86,name:`應龍`,verse:`浮冰裡沒有山腳。不周是懸在空中的斷口。`,beastName:`應龍`,beastLine:`盤據不周之折`,hint:`The broken mountain`},{until:.92,name:`九尾`,verse:`青丘之山，有獸焉，其狀如狐而九尾。`,beastName:`九尾狐`,beastLine:`青丘來客`,hint:`Nine tails in the snow`},{until:1,name:`北冥`,verse:`卷未盡。神獸過後，冰裡還封著路。`,beastName:``,beastLine:``,hint:`The north sea does not end`}],ha=class{renderer;scene=new et;camera=new Oe(36,1,.1,360);reduced;hooks;lastTime=performance.now();pointer=new N;raycaster=new qe;posCurve;lookCurve;targetPos=new Z;targetLook=new Z;lookAt=new Z;fogColor=new f(12962515);mistNear=new f(12962515);mistFar=new f(10135220);jadeMeshes;island;clouds;iceShaft;kun;peng;dragon;fox;peak;pangu;panguBurst;dust;dustBase;hoverScale=new Z;composer=null;bloom=null;bloomBase=.22;scrollTarget=0;scrollCurrent=0;hoverJade=null;panguBurstPlayed=!1;panguBurstAt=-1;raf=0;disposed=!1;constructor(e,t){this.hooks=t,this.reduced=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;let n=window.matchMedia(`(max-width: 768px)`).matches;this.renderer=new Ei({canvas:e,antialias:!n,alpha:!1,powerPreference:`high-performance`}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,n?1.35:1.75)),this.renderer.setClearColor(12962515,1),this.renderer.outputColorSpace=De,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=1.08,this.scene.fog=new oe(this.fogColor,10,42),this.scene.background=this.fogColor,this.camera.position.set(7.6,5.5,13),this.posCurve=new tt([new Z(7.6,5.5,13),new Z(2.5,3.6,5.4),new Z(.45,2.5,1.3),new Z(.15,1.5,-.2),new Z(1.1,-18,1.4),new Z(-3.2,-36,7.8),new Z(.4,-40.2,6.6),new Z(-8.5,-40,7.5),new Z(-3.5,-43,4.5),new Z(.4,-24,2.5),new Z(2.2,10,-8),new Z(3.2,31,-14),new Z(9,18,-26),new Z(-3,7.2,-40),new Z(.2,1.4,-54)]),this.lookCurve=new tt([new Z(0,2.8,.2),new Z(0,2.5,.1),new Z(0,1.9,-1.6),new Z(0,-14,-1),new Z(.2,-36,.4),new Z(.15,-39.6,.35),new Z(.1,-40.4,.2),new Z(5,-43,0),new Z(10,-42,-2),new Z(0,22,-8),new Z(0,34,-14),new Z(0,38,-18),new Z(0,14,-34),new Z(2.4,5.2,-48),new Z(0,-5,-62)]),this.addLights(),this.scene.add(pa()),this.island=aa(),this.island.scale.setScalar(1.45),this.scene.add(this.island),this.iceShaft=ca(),this.scene.add(this.iceShaft),this.clouds=ra(n),this.scene.add(this.clouds),this.pangu=We(),this.panguBurst=Le(n?90:240),this.kun=Zi(),this.peng=Qi(),this.dragon=$i(),this.fox=ea(),this.peak=ta(),this.scene.add(this.pangu,this.panguBurst.points,this.kun,this.peng,this.dragon,this.fox,this.peak);let r=da();this.jadeMeshes=r.meshes,this.scene.add(r.group);let i=n?420:1100,a=new Float32Array(i*3);for(let e=0;e<i;e++)a[e*3]=(Math.random()-.5)*28,a[e*3+1]=-58+Math.random()*110,a[e*3+2]=(Math.random()-.5)*36;this.dustBase=a.slice();let o=new rt;o.setAttribute(`position`,new V(a,3)),this.dust=new _e(o,new at({color:15266040,size:.055,transparent:!0,opacity:.5,depthWrite:!1})),this.scene.add(this.dust),this.reduced||(this.composer=new Fi(this.renderer),this.composer.addPass(new Ri(this.scene,this.camera)),this.bloom=new Bi(new N(1,1),.22,.4,.92),this.composer.addPass(this.bloom),this.composer.addPass(new Li)),this.resize(),this.tick()}setScrollTarget(e){this.scrollTarget=Te(e,0,1)}setPointer(e,t){this.pointer.set(e,t)}pickJade(){return this.scrollCurrent<.86?null:(this.raycaster.setFromCamera(this.pointer,this.camera),this.raycaster.intersectObjects(this.jadeMeshes,!1)[0]?.object.userData.jade??null)}resize(){let e=window.innerWidth,t=window.innerHeight;this.camera.aspect=e/Math.max(t,1),this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t,!1),this.composer?.setSize(e,t),this.bloom?.setSize(e,t)}dispose(){this.disposed=!0,cancelAnimationFrame(this.raf),this.composer?.dispose(),this.renderer.dispose()}addLights(){this.scene.add(new x(15265525,8226450,1.05));let e=new M(15988731,1.2);e.position.set(14,22,9),this.scene.add(e);let t=new M(12043990,.5);t.position.set(-11,8,-40),this.scene.add(t);let n=new ct(14149364,18,70,1.6);n.position.set(0,-46,4),this.scene.add(n);let r=new ct(16054524,10,48,1.8);r.position.set(2,38,-12),this.scene.add(r)}tick=()=>{if(this.disposed)return;this.raf=requestAnimationFrame(this.tick);let e=performance.now(),t=Math.min((e-this.lastTime)/1e3,.05);this.lastTime=e;let n=e/1e3,r=document.documentElement.scrollHeight-window.innerHeight;this.scrollTarget=r<=0?0:Te(window.scrollY/r,0,1);let i=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;this.scrollCurrent=i?this.scrollTarget:Ve(this.scrollCurrent,this.scrollTarget,2.4,t);let a=this.scrollCurrent;this.posCurve.getPointAt(a,this.targetPos),this.lookCurve.getPointAt(a,this.targetLook);let o=H(.1,.18,a)*(1-H(.26,.34,a)),s=H(.22,.3,a)*(1-H(.3,.38,a)),c=H(.32,.38,a)*(1-H(.46,.54,a)),l=H(.62,.74,a);this.targetLook.lerp(new Z(.12,-40.4,.22),c),this.targetPos.lerp(new Z(.4,-40,11.2),c*.9);let u=i?0:.9*(1-a*.35);this.targetPos.x+=this.pointer.x*(u+s*1.6),this.targetPos.y+=this.pointer.y*(u*.55+s*.9),this.camera.position.lerp(this.targetPos,i?1:1-Math.exp(-2.8*t)),this.lookAt.lerp(this.targetLook,i?1:1-Math.exp(-2.6*t)),this.camera.lookAt(this.lookAt),this.camera.fov=U(36,24,o),this.camera.fov=U(this.camera.fov,56,s),this.camera.fov=U(this.camera.fov,30,c),this.camera.fov=U(this.camera.fov,46,l),this.camera.updateProjectionMatrix(),i||this.camera.rotateZ(o*.07+s*Math.sin(a*20+n*.45)*.18+c*.02+l*-.09),this.fogColor.copy(this.mistNear).lerp(this.mistFar,U(o*.15,.72,s+c*.35+l*.4)),this.fogColor.lerp(new f(14140576),c*.4);let d=this.scene.fog;d.color.copy(this.fogColor),d.near=U(U(10,1.15,o),7,s+c+l*.5),d.far=U(U(40,8.5,o),72,Math.max(s,c,l)),this.renderer.setClearColor(this.fogColor,1),this.island.visible=!0,this.island.scale.setScalar(1.45),qi(this.iceShaft,H(.22,.34,a));let p=ze(this.pangu,a,i?0:n,this.panguBurstAt<0?-1:n-this.panguBurstAt);!this.panguBurstPlayed&&p.centered&&(this.panguBurstPlayed=!0,this.panguBurstAt=n,i||Ke(this.panguBurst,this.pangu.position)),i||B(this.panguBurst,t);let m=this.panguBurstAt<0?99:n-this.panguBurstAt;if(this.bloom){let e=this.panguBurstPlayed&&!i&&m<1.8?Math.exp(-m*2.4):0;this.bloom.strength=this.bloomBase+e*1.15}i?(na(this.kun,this.peng,this.dragon,this.fox,this.peak,a,0),fa(this.jadeMeshes,a)):(ia(this.clouds,n,t),na(this.kun,this.peng,this.dragon,this.fox,this.peak,a,n),fa(this.jadeMeshes,a),this.tickDust(n)),this.updateJadeHover();let h=ma.find(e=>a<=e.until)??ma[ma.length-1];this.hooks.onFrame({progress:a,chapter:h?.name??`北冥`,verse:h?.verse??``,beastName:h?.beastName??``,beastLine:h?.beastLine??``,hint:h?.hint??``,jades:this.projectJades(),panguSheet:Ae(a)&&this.panguBurstPlayed}),this.composer?this.composer.render():this.renderer.render(this.scene,this.camera)};tickDust(e){let t=this.dust.geometry.attributes.position;for(let n=0;n<t.count;n++){let r=this.dustBase[n*3]??0,i=this.dustBase[n*3+1]??0,a=this.dustBase[n*3+2]??0;t.setX(n,r+Math.sin(e*.18+n)*.28),t.setY(n,((i-e*1.8+58)%110+110)%110-58),t.setZ(n,a)}t.needsUpdate=!0}updateJadeHover(){if(this.scrollCurrent<.86){this.hoverJade&&(this.hoverJade=null,this.hooks.onJadeHover(null));return}this.raycaster.setFromCamera(this.pointer,this.camera);let e=this.raycaster.intersectObjects(this.jadeMeshes.filter(e=>e.visible),!1)[0]?.object.userData.jade??null;e?.id!==this.hoverJade?.id&&(this.hoverJade=e,this.hooks.onJadeHover(e)),this.jadeMeshes.forEach(e=>{let t=e.userData.jade?.id===this.hoverJade?.id;this.hoverScale.set(t?1.08:1,t?1.08:1,t?1.08:1),e.scale.lerp(this.hoverScale,.1)})}projectJades(){return la.map((e,t)=>{let n=this.jadeMeshes[t];if(!n||!n.visible)return{jade:e,x:0,y:0,visible:!1};let r=n.getWorldPosition(new Z);r.y+=2;let i=r.project(this.camera);return{jade:e,x:(i.x*.5+.5)*window.innerWidth,y:(-i.y*.5+.5)*window.innerHeight,visible:this.scrollCurrent>.86&&i.z<1}})}};export{ha as Experience};