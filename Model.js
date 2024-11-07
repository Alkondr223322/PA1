// Constructor
function Model(name) {
    this.name = name;
    this.iVertexBuffer = gl.createBuffer();
    this.iIndexBufferU = gl.createBuffer();
    this.iIndexBufferV = gl.createBuffer();
    this.countU = 0;
    this.countV = 0;

    this.BufferData = function(vertices, indexes) {

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBufferU);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes.u), gl.STATIC_DRAW);

        this.countU = indexes.u.length

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBufferV);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes.v), gl.STATIC_DRAW);

        this.countV = indexes.v.length
    }

    this.Draw = function() {

        
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);
   
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBufferU);
        gl.drawElements(gl.LINES, this.countU, gl.UNSIGNED_SHORT, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iIndexBufferV);
        gl.drawElements(gl.LINES, this.countV, gl.UNSIGNED_SHORT, 0);
    }
}