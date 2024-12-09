

function deg2rad(angle) {
    return angle * Math.PI / 180;
}


function Vertex(p)
{
    this.p = p;
    this.normal = [];
    this.triangles = [];
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
    this.count = 0;

    this.BufferData = function(vertices, indices, normals) {

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STREAM_DRAW);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STREAM_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STREAM_DRAW);
        gl.vertexAttribPointer(shProgram.iNormalBuffer, 3, gl.FLOAT, true, 0, 0);
        gl.enableVertexAttribArray(shProgram.iNormalBuffer);


        this.count = indices.length;
    }

    this.Draw = function() {

        //gl.drawArrays(gl.LINE_STRIP, 0, this.count);
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
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
    // for(let i = 0; i < indices.length; i++){
    //     if(i % 3 == 0){
    //         vertices[indices[i]].normal = calculateNormal(vertices[indices[i]].p, vertices[indices[i+1]].p, vertices[indices[i+2]].p)
    //     }else if(i % 3 == 1){
    //         vertices[indices[i]].normal = calculateNormal(vertices[indices[i]].p, vertices[indices[i+1]].p, vertices[indices[i-1]].p)
    //     }else{
    //         vertices[indices[i]].normal = calculateNormal(vertices[indices[i]].p, vertices[indices[i-1]].p, vertices[indices[i-2]].p)
    //     }
        
    // }
    for(let i = 0; i < indices.length; i+=3){
        let norm = calculateNormal(vertices[indices[i]].p, vertices[indices[i+1]].p, vertices[indices[i+2]].p)
        vertices[indices[i]].normal = norm
        vertices[indices[i+1]].normal = norm
        vertices[indices[i+2]].normal = norm
        
    }
    // for(let i = 0; i < triangles.length; i++){
    //     triangles[i].normal = calculateNormal(vertices[triangles[i].v0].p, vertices[triangles[i].v1].p, vertices[triangles[i].v2].p)
    // }
    //return [1.0,1.0,1.0]
}

function CreateSurfaceData(data)
{
    let vertices = [];
    let triangles = [];
    //let normals = [];
    let r1 = 0.5
    let r2 = 1
    let hMax = 1
    //let h = 1
    
    let step = +document.getElementById("stepRange").value
    //console.log(step)
    let iterCount = Math.ceil(360/step)+1

    let heightIterCount = +document.getElementById("step2Range").value 
    let heightStep = hMax / heightIterCount
    //console.log(heightStep)
    
    

    for (let i=0, ang = 0; i<iterCount; i++, ang+=step) {
        vertices.push( new Vertex( [r1 * Math.sin(deg2rad(ang)), 0, r1 * Math.cos(deg2rad(ang))] ));
        //vertices[vertices.length-1].normal = calculateNormal()
        vertices.push( new Vertex( [r2 * Math.sin(deg2rad(ang)), 0, r2 * Math.cos(deg2rad(ang))] ));
        //vertices[vertices.length-1].normal = calculateNormal()
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
       
        
        vertices.push( new Vertex( [r1 * Math.sin(deg2rad(ang)), h, r1 * Math.cos(deg2rad(ang))] ));
        //vertices[vertices.length-1].normal = calculateNormal()
        vertices.push( new Vertex( [r2 * Math.sin(deg2rad(ang)), h, r2 * Math.cos(deg2rad(ang))] )); 
        //vertices[vertices.length-1].normal = calculateNormal()

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
    //console.log(vertices)
    data.verticesF32 = new Float32Array(vertices.length*3);
    for (let i=0, len=vertices.length; i<len; i++)
    {
        data.verticesF32[i*3 + 0] = vertices[i].p[0];
        data.verticesF32[i*3 + 1] = vertices[i].p[1];
        data.verticesF32[i*3 + 2] = vertices[i].p[2];
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
    // data.normalsF32 = new Float32Array(triangles.length*3);
    // for (let i=0, len=triangles.length; i<len; i++)
    //     {
    //         data.normalsF32[i*3 + 0] = triangles[i].normal[0];
    //         data.normalsF32[i*3 + 1] = triangles[i].normal[1];
    //         data.normalsF32[i*3 + 2] = triangles[i].normal[2];
    // }
    //console.log(data.indicesU16)
    //console.log(vertices)
    //console.log(triangles)

}