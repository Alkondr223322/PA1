

function deg2rad(angle) {
    return angle * Math.PI / 180;
}


function Vertex(p, t, a)
{
    this.p = p;
    this.normal = [];
    this.triangles = [];
    this.t = t
    this.a = a
}

function Triangle(v0, v1, v2)
{
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.normal = [];
    this.tangent = [];
}

// Constructor
function Model(name) {
    this.name = name;
    this.iVertexBuffer = gl.createBuffer();
    this.iIndexBuffer = gl.createBuffer();
    this.iNormalBuffer = gl.createBuffer();
    this.iTexCoordsBuffer = gl.createBuffer();
    this.iTangentBuffer = gl.createBuffer();

    this.textureDiffuse = gl.createTexture();
    this.textureNormal = gl.createTexture();
    this.textureSpecular = gl.createTexture();

    this.count = 0;

    this.BufferData = function(vertices, indices, normals, texCoords, tangents) {

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STREAM_DRAW);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STREAM_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STREAM_DRAW);
        gl.vertexAttribPointer(shProgram.iAttribNormal, 3, gl.FLOAT, true, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribNormal);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iTexCoordsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,texCoords, gl.STREAM_DRAW);
        gl.vertexAttribPointer(shProgram.iAttribTexCoords, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shProgram.iAttribTexCoords);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iTangentBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, tangents, gl.STREAM_DRAW);
        gl.vertexAttribPointer(shProgram.iAttribTangent, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shProgram.iAttribTangent);


        this.count = indices.length;
    }

    this.Draw = function() {
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    }

    this.loadTexture = function(){
        //Diffuse
        gl.bindTexture(gl.TEXTURE_2D, this.textureDiffuse);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            1,
            1,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            new Uint8Array([100, 0, 0, 200]),
        );
   
        const image1 = new Image();
        image1.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, this.textureDiffuse);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                image1,
            );
            gl.generateMipmap(gl.TEXTURE_2D);
        };
        image1.src = "Texture/Pringles_BaseColor.jpg";
   
        // Normal
        gl.bindTexture(gl.TEXTURE_2D, this.textureNormal);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            1,
            1,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            new Uint8Array([100, 0, 0, 200]),
        );
   
        const image2 = new Image();
        image2.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, this.textureSpecular);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                image2,
            );
            gl.generateMipmap(gl.TEXTURE_2D);
        };
        image2.src = "Texture/Pringles_Roughness.jpg";
   
        const image3 = new Image();
        image3.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, this.textureNormal);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                image3,
            );
            gl.generateMipmap(gl.TEXTURE_2D);
        };
        image3.src = "Texture/Pringles_Normal.png";
   
        // Specular
        gl.bindTexture(gl.TEXTURE_2D, this.textureSpecular);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            1,
            1,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            new Uint8Array([100, 0, 0, 200]),
        );
   
   
   }
   
   this.bindTextures = function(){
       gl.activeTexture(gl.TEXTURE0);
       gl.bindTexture(gl.TEXTURE_2D, this.textureDiffuse);
       gl.uniform1i(shProgram.diffuseTextureUni, 0);
   
       gl.activeTexture(gl.TEXTURE1);
       gl.bindTexture(gl.TEXTURE_2D, this.textureSpecular);
       gl.uniform1i(shProgram.specularTextureUni, 1);
   
       gl.activeTexture(gl.TEXTURE2);
       gl.bindTexture(gl.TEXTURE_2D, this.textureNormal);
       gl.uniform1i(shProgram.normalTextureUni, 2);
    }
}

function calculateNormal(v0, v1, v2){
    let t1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]]
    let t2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]]
    let n0 = t1[1] * t2[2] - t1[2] * t2[1]
    let n1 = -1 * (t1[0] * t2[2] - t1[2] * t2[0])
    let n2 = t1[0] * t2[1] - t1[1] * t2[0]
    //let n = [n0, n1, n2]
    let nlen = Math.sqrt(n0 * n0 + n1 * n1 + n2 * n2)
    let n = [n0 / nlen, n1 / nlen, n2 / nlen]
    return [...n]
}

function calculateNormals(indices, vertices, triangles){

    // for(let i = 0; i < indices.length; i+=3){
    //     let norm = calculateNormal(vertices[indices[i]].p, vertices[indices[i+1]].p, vertices[indices[i+2]].p)
    //     vertices[indices[i]].normal = norm
    //     vertices[indices[i+1]].normal = norm
    //     vertices[indices[i+2]].normal = norm
        
    // }
    for(let i = 0; i < indices.length; i++){
        vertices[indices[i]].normal = [Math.cos(deg2rad(vertices[indices[i]].a)), Math.sin(deg2rad(vertices[indices[i]].a)), 0]
        
    }

}

function CreateSurfaceData(data)
{
    let vertices = [];
    let triangles = [];
    let r1 = 0.5
    let r2 = 1
    let hMax = 3
    let zoffset =-2
    
    let step = +document.getElementById("stepRange").value
    let iterCount = Math.ceil(360/step)+1

    let heightIterCount = +document.getElementById("step2Range").value 
    let heightStep = hMax / heightIterCount
    let centerU = +document.getElementById("CUpValue").textContent 
    let centerV = +document.getElementById("CVpValue").textContent
    let angle = deg2rad(+document.getElementById("RARange").value)
    let cosAngle = Math.cos(angle);
    let sinAngle = Math.sin(angle);

    for (let i=0, ang = 0; i<iterCount; i++, ang+=step) {
        vertices.push( new Vertex( [r1 * Math.sin(deg2rad(ang)), zoffset+0, r1 * Math.cos(deg2rad(ang))], [ang/360, 0], angle ));
        vertices.push( new Vertex( [r2 * Math.sin(deg2rad(ang)), zoffset+0, r2 * Math.cos(deg2rad(ang))], [-ang/360, 0], angle ));
        // FLOOR
        let v0ind = vertices.length-1;
        if (i > 0)
            {
                
                let v1ind = v0ind - 2;
                let v2ind = v0ind - 1
                let v3ind = v0ind - 3
    
                let trian = new Triangle(v0ind, v3ind, v2ind);
                let trianInd = triangles.length;
    
                triangles.push( trian );
                vertices[v0ind].triangles.push(trianInd);
                vertices[v1ind].triangles.push(trianInd);
                vertices[v3ind].triangles.push(trianInd);
    
                let trian2 = new Triangle(v3ind, v0ind, v1ind);
                let trianInd2 = triangles.length;
    
                triangles.push( trian2 );
                vertices[v0ind].triangles.push(trianInd2);
                vertices[v3ind].triangles.push(trianInd2);
                vertices[v1ind].triangles.push(trianInd2);
    
            }
    }
    for(let j = 0, h = heightStep; j < heightIterCount; j++, h+=heightStep){
    for (let i=0, ang = 0; i<iterCount; i++, ang+=step) {

        let v0ind = vertices.length -1;
       
        
        vertices.push( new Vertex( [r1 * Math.sin(deg2rad(ang)), zoffset+h, r1 * Math.cos(deg2rad(ang))], [ang/360, h/hMax], angle ));
        vertices.push( new Vertex( [r2 * Math.sin(deg2rad(ang)), zoffset+h, r2 * Math.cos(deg2rad(ang))], [-ang/360, h/hMax], angle )); 

        // v0    v2 
        //   o - o
        //   | \ |
        //   o - o
        // v3     v1
       // CEILING
       v0ind+=2
       if (i > 0 && h == hMax)
           {
              
               let v1ind = v0ind - 2;
               let v2ind = v0ind - 1
               let v3ind = v0ind - 3
   
               let trian = new Triangle(v0ind, v3ind, v2ind);
               let trianInd = triangles.length;
   
               triangles.push( trian );
               vertices[v0ind].triangles.push(trianInd);
               vertices[v1ind].triangles.push(trianInd);
               vertices[v3ind].triangles.push(trianInd);
   
               let trian2 = new Triangle(v3ind, v0ind, v1ind);
               let trianInd2 = triangles.length;
   
               triangles.push( trian2 );
               vertices[v0ind].triangles.push(trianInd2);
               vertices[v3ind].triangles.push(trianInd2);
               vertices[v1ind].triangles.push(trianInd2);
   
           }
       //OUTER WALLS
       v0ind-=2
       if (i > 0)
       {
           let v1ind = v0ind - iterCount*2;
           let v2ind = v0ind + 2
           let v3ind = v0ind - iterCount*2 +2
           let trian = new Triangle(v0ind, v3ind, v2ind);
           let trianInd = triangles.length;

           triangles.push( trian );
           vertices[v0ind].triangles.push(trianInd);
           vertices[v1ind].triangles.push(trianInd);
           vertices[v3ind].triangles.push(trianInd);

           let trian2 = new Triangle(v3ind, v0ind, v1ind);
           let trianInd2 = triangles.length;

           triangles.push( trian2 );
           vertices[v0ind].triangles.push(trianInd2);
           vertices[v3ind].triangles.push(trianInd2);
           vertices[v1ind].triangles.push(trianInd2);

       }
       // INNER WALLS
       v0ind--
       if (i > 0) 
           {
               
               let v1ind = v0ind - iterCount*2;
               let v2ind = v0ind + 2
               let v3ind = v0ind - iterCount*2 +2
   
               let trian = new Triangle(v0ind, v3ind, v2ind);
               let trianInd = triangles.length;
   
               triangles.push( trian );
               vertices[v0ind].triangles.push(trianInd);
               vertices[v1ind].triangles.push(trianInd);
               vertices[v3ind].triangles.push(trianInd);
   
               let trian2 = new Triangle(v3ind, v0ind, v1ind);
               let trianInd2 = triangles.length;
   
               triangles.push( trian2 );
               vertices[v0ind].triangles.push(trianInd2);
               vertices[v3ind].triangles.push(trianInd2);
               vertices[v1ind].triangles.push(trianInd2);
   
           }
       
    }
    }
    data.verticesF32 = new Float32Array(vertices.length*3);
    data.texcoordsF32 = new Float32Array(vertices.length*2);
    for (let i=0, len=vertices.length; i<len; i++)
    {
        data.verticesF32[i*3 + 0] = vertices[i].p[0];
        data.verticesF32[i*3 + 1] = vertices[i].p[1];
        data.verticesF32[i*3 + 2] = vertices[i].p[2];

        let u = vertices[i].t[0];
        let v = vertices[i].t[1];
        data.texcoordsF32[i*2 + 0] = u * cosAngle - v * sinAngle + centerU;
        data.texcoordsF32[i*2 + 1] = u * sinAngle + v * cosAngle + centerV;
    }

    data.indicesU16 = new Uint16Array(triangles.length*3);
    for (let i=0, len=triangles.length; i<len; i++)
    {
        data.indicesU16[i*3 + 0] = triangles[i].v0;
        data.indicesU16[i*3 + 1] = triangles[i].v1;
        data.indicesU16[i*3 + 2] = triangles[i].v2;
    }
    calculateNormals(data.indicesU16, vertices, triangles)
    data.normalsF32 = new Float32Array(vertices.length*3);
    for (let i=0, len=vertices.length; i<len; i++)
        {
            data.normalsF32[i*3 + 0] = vertices[i].normal[0];
            data.normalsF32[i*3 + 1] = vertices[i].normal[1];
            data.normalsF32[i*3 + 2] = vertices[i].normal[2];
    }
    data.tangentsF32 = new Float32Array(vertices.length*3);
    for (let i=0, len=vertices.length; i<len; i++)
        {
            data.tangentsF32[i*3 + 0] = 1;
            data.tangentsF32[i*3 + 1] = 0;
            data.tangentsF32[i*3 + 2] = 0;
    }


}

