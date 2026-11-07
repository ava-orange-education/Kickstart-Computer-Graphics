export async function loadTexture(gl, url) {
  const img = await new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = url;
  });

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.generateMipmap(gl.TEXTURE_2D);

  return texture;
}
