
var TOTAL_STACK = 5242880;
var TOTAL_MEMORY = 16777216;
var WASM_PAGE_SIZE = 64 * 1024;

/*
var Module = Module||{};
function getBinary(){
    var binary = Module['wasmBinary'];
    binary = new Uint8Array(binary);
}

var mem = new WebAssembly.Memory({initial:1000,maximum:1000});
var tab = new WebAssembly.Table({ initial: 100, maximum: 100, element: 'anyfunc' })

var instance = new WebAssembly.Instance(new WebAssembly.Module(getBinary()), info);
*/

function instantiate(bytes, imports) {
  return WebAssembly.compile(bytes).then(m => new WebAssembly.Instance(m, imports));
}


var importObject = { imports: { i: arg => console.log(arg) },STACKTOP:10 };

//var wasmfile = 'simple.wasm';
var wasmfile = 'perftest.wasm';
fetch(wasmfile).then(response => response.arrayBuffer())
.then(bytes => instantiate(bytes, importObject))
.then(instance => {
    var st = Date.now();
    instance.exports.e();
    alert('wasm tm='+(Date.now()-st));
    });


function testf1(f){
    return f*f/2.0;
}

function testJS(){
    var num = 1000000;
    var f=0;
    for(var i=0; i<num; i++){
        f = f+testf1(i*1.1);
    }
}

var st = Date.now();
testJS();
alert('js tm='+(Date.now()-st));