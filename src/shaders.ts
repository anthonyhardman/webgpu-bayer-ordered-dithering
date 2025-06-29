export const vertexShader = `
  struct VertexOut {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoords: vec2<f32>,
  };

  @vertex
  fn main(@location(0) position: vec2<f32>, @location(1) uv: vec2<f32>) -> VertexOut {
    var out: VertexOut;  
    out.position = vec4<f32>(position, 0.0, 1.0);
    out.texCoords = uv; 

    return out;
  }
`;

export const fragmentShader = `
  struct Uniforms {
    matrixSize: u32,
    texelSize: vec2<f32>,
    edgeWeight: f32,
    frameCount: f32,
    displayMode: u32,
  };

  @group(0) @binding(0) var mySampler: sampler;
  @group(0) @binding(1) var myTexture: texture_2d<f32>;
  @group(0) @binding(2) var<uniform> uniforms: Uniforms;

  const dither2x2 = array<f32, 4>(
    0.0 / 4.0, 2.0 / 4.0, 
    3.0 / 4.0, 1.0 / 4.0,
  );
  const dither4x4 = array<f32, 16>(
     0.0 / 16.0,  8.0 / 16.0,  2.0 / 16.0, 10.0 / 16.0,
    12.0 / 16.0,  4.0 / 16.0, 14.0 / 16.0,  6.0 / 16.0,
     3.0 / 16.0, 11.0 / 16.0,  1.0 / 16.0,  9.0 / 16.0,
    15.0 / 16.0,  7.0 / 16.0, 13.0 / 16.0,  5.0 / 16.0,
  );
  
  fn getMatrixValue(coord: vec2<u32>) -> f32 {
    if uniforms.matrixSize == 2 {
      return dither2x2[(coord.y % 2) * 2 + (coord.x % 2)];
    }  

    return dither4x4[(coord.y % 4) * 4 + ((coord.x) % 4)];
  }

  fn luminance(color: vec3<f32>) -> f32 {
    return dot(color, vec3<f32>(0.2126, 0.7152, 0.0722));
  }

  fn sobelEdge(uv: vec2<f32>, texelSize: vec2<f32>) -> f32 {
    let tl = luminance(textureSample(myTexture, mySampler, uv + texelSize * vec2(-1.0, -1.0)).rgb);
    let tc = luminance(textureSample(myTexture, mySampler, uv + texelSize * vec2( 0.0, -1.0)).rgb);
    let tr = luminance(textureSample(myTexture, mySampler, uv + texelSize * vec2( 1.0, -1.0)).rgb);

    let ml = luminance(textureSample(myTexture, mySampler, uv + texelSize * vec2(-1.0,  0.0)).rgb);
    let mr = luminance(textureSample(myTexture, mySampler, uv + texelSize * vec2( 1.0,  0.0)).rgb);

    let bl = luminance(textureSample(myTexture, mySampler, uv + texelSize * vec2(-1.0,  1.0)).rgb);
    let bc = luminance(textureSample(myTexture, mySampler, uv + texelSize * vec2( 0.0,  1.0)).rgb);
    let br = luminance(textureSample(myTexture, mySampler, uv + texelSize * vec2( 1.0,  1.0)).rgb);

    let gx = -tl + tr - 2.0 * ml + 2.0 * mr - bl + br;
    let gy = -tl - 2.0 * tc - tr + bl + 2.0 * bc + br;

    return sqrt(gx * gx + gy * gy);
  }

  @fragment
  fn main(@builtin(position) fragCoord: vec4<f32>, @location(0) texCoords: vec2<f32>) -> @location(0) vec4<f32> {
    let color = textureSample(myTexture, mySampler, texCoords);
    
    // Display mode: 0 = dithering, 1 = edges, 2 = original
    if (uniforms.displayMode == 2) {
      // Original image
      return color;
    }
    
    if (uniforms.displayMode == 1) {
      // Edge detection visualization with color palette
      let edge = sobelEdge(texCoords, uniforms.texelSize);
      let edgeIntensity = clamp(edge * uniforms.edgeWeight, 0.0, 1.0);
      
      let darkColor = vec3<f32>(0.1, 0.05, 0.2);  // Deep purple
      let brightColor = vec3<f32>(0.2, 0.9, 1.0);  // Bright cyan
      let edgeColor = mix(darkColor, brightColor, edgeIntensity);
      
      return vec4<f32>(edgeColor, 1.0);
    }
    
    // Dithering mode (default)
    let luminance: f32 = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
    let coord = vec2<u32>(u32(fragCoord.x), u32(fragCoord.y));
    
    let edge = sobelEdge(texCoords, uniforms.texelSize);
    let edgeFactor = clamp(edge * uniforms.edgeWeight, 0.0, 1.0);
    let sinOffset = sin(uniforms.frameCount * 0.001) * 0.2;
    
    let ditherThreshold = mix(getMatrixValue(coord) + sinOffset, 0.5, edgeFactor);
    
    // Better color palette: deep purple/black and cyan/white
    let darkColor = vec3<f32>(0.1, 0.05, 0.2);  // Deep purple
    let brightColor = vec3<f32>(0.2, 0.9, 1.0);  // Bright cyan
    
    let outColor = select(
        vec4<f32>(darkColor, 1.0),
        vec4<f32>(brightColor, 1.0),
        luminance > ditherThreshold 
    );

    return outColor;
  }
`;