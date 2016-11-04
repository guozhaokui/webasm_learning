
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


var importObject = { imports: { i: arg => console.log(arg) } };

fetch('simple.wasm').then(response => response.arrayBuffer())
.then(bytes => instantiate(bytes, importObject))
.then(instance => instance.exports.e());