
1. 加载wasm文件到arraybuffer
2. 把他编译到 WebAssembly.Module
3. 加上需要import的模块来实例化 WebAssembly.Module， 返回一个exports

## 测试流程：  
0. 必须在linux下面。进入 emsdk_portable 目录下，执行
    source ./emsdk_env.sh
      
1. 在index.html这个目录开服务器。（直接打开不行）
2. 编译c
emcc hello.c -s WASM=1 -o hello.html
这个也会生成wast
3. 如果手动修改wast的话，要编译wast
 ../../wabt/out/wast2wasm simple.wast -o simple.wasm
4. 用  57.0.2928.0 canary (64-bit) 打开。chrome本身即是支持webasm也可能无法运行。

栈
    所有的操作都是影响堆栈，例如 getglobal 就是把结果放到栈顶，下面的call可以直接使用
    参数是按照先左后右的顺序入栈的，例如 func1(a,b)则
    a
    b
    call func1

    

导入和导出
    导入的是js函数。导出的可以让js执行。
    (func $i (import “imports” “i”) (param i32))
        这个表示 $i 是从 imports.i导入的，所以需要在 instance 的时候有对应的导入对象
        var importObject = { imports: { i: arg => console.log(arg) } }; 

    导出函数的返回值
    例如 float test(){}

emcc直接生成的结构
    生成的wasm会导出几个函数
    function doNativeWasm(global, env, providedBuffer) {

    exports = instance.exports;
    if (exports.memory) mergeMemory(exports.memory);        
文本格式
    s-expression
    就是写module
    (module
        (memory (export “mem”) 1)       ;;1是什么意思
        (func (export “accumulate”) (param $ptr i32) (param $length i32)        ;;这个是 accumulate(i32 ptr,i32 length) 
            …))
    除了手写怎么能生成这种格式

    s表达式的具体语法
        https://github.com/WebAssembly/spec/tree/master/interpreter
        语义
        http://webassembly.org/docs/semantics/
    wast
         ../../wabt/out/wast2wasm simple.wast -o simple.wasm
         如果不指定输出，则只是检查

    global
        需要定义么

    local

    怎么处理字符串

memory的用法

怎么反汇编wasm
    WABT
        webasm 二进制工具
        git clone --recursive https://github.com/WebAssembly/wabt .
        make
            这个其实执行的是cmake，执行一个缺省的target（用clang做compiler的）
emcc
    可以接受文件：源码，llvm二进制，llvm汇编


内存
    new Memory的时候，参数都是以页为单位的，页的大小是 64K    

怎么在js和c之间直接通过内存交互
    js:
        var ab = new ArrayBuffer(100);
        instance.exports.runc(ab)

    是js提供一个 _malloc 的函数么

操作一段导出的内存：
    var i32 = new Uint32Array(instance.exports.memory.buffer);
    
fetch
    fetch(url).then(response=>{});
    response
        arrayBuffer
        json

几种流程
    1. C/C++ Source ⇒ asm2wasm ⇒ WebAssembly
        emcc
        
## wat格式
$ 表示变量名称？
(节点类型 参数1 参数2 ...) 有几个参数和每个参数的意义根据节点类型定
参数也有可能是节点

## module
module 可执行，potable，有导入导出
一个wasm文件就是一个module，里面可以包含很多的导出函数
可以有多个wasm文件


## table
是一个类似array的东西，里面现在只能保存js函数的引用。js和asm都能访问里面的东西
例如
```javascript
var importObj = {
  js: {
    tbl:tbl
  }
};

fetchAndInstantiate('table2.wasm', importObject).then(function(instance) {
  console.log(tbl.length);    // "2"
  console.log(tbl.get(0)());  // "42"
  console.log(tbl.get(1)());  // "83"
});

(module
  (func $thirteen (result i32) (i32.const 13))
  (func $fourtytwo (result i32) (i32.const 42))
  (table (export "tbl") anyfunc (elem $thirteen $fourtytwo))    //这个表示把tbl的两个元素用这两个函数填上，这样js就可以调用这两个函数了， tbl.get(0)() 注意最后()
)
```

## emcc
emcc x.c -o obj/
表示编译一个.o文件到obj目录下, .o 文件实际是 LLVM bitcode，以BC开头。注意这个其实是llvm的，与wasm没什么关系。
如果通过 -o xx.js 输出js的话，则生成的是一个普通的js文件，就是把c翻译成了js，有点像asm.js,然后依然能运行。

"-s OPTION=VALUE"
例如
-s EXPORTED_FUNCTIONS="['_change']"
具体设置在 src/settings.js中，例如这个的缺省值是 
var EXPORTED_FUNCTIONS = ['_main'];
也可以指向一个文件 =@绝对路径xxx.json
内容 functions: "["_func1", "func2"]"

c++11 
-std=c++11

-g 
生成wast，里面包含较多的调试信息，例如包含函数名称

-s ONLY_MY_CODE=1
这样生成的asm.js文件中就只有自己写的代码，由于没有包含必须的库，会有连接错误，所以也无法生成wasm文件

-s WASM=1 生成wasm代码


怎么link
emcc 的输入文件可以是bc文件
也可以是llvm的汇编文件
如果是.a的话，是什么编译的.a

./emcc -O3 tests/bullet/Demos/HelloWorld/HelloWorldFrames.cpp tests/bullet/Demos/HelloWorld/BenchmarkDemo.cpp /tmp/emscripten_temp/building/bullet/src/BulletDynamics/libBulletDynamics.a /tmp/emscripten_temp/building/bullet/src/BulletCollision/libBulletCollision.a /tmp/emscripten_temp/building/bullet/src/LinearMath/libLinearMath.a -o tests/bullet/Demos/HelloWorld/frames.js -I./tests/bullet/src -s TOTAL_MEMORY=60000000 -s LINKABLE=1



**怎么编译库**
看bullet的例子

## 调试
1. 转到asm.js


## shell
emsdk\emscripten\incoming\src
    shell.html
    shell_minimal.html

## --js-library
emsdk\emscripten\incoming\src
下面的 libray_xxx


## Memory
js和asm都可以创建，js和asm都能访问。
TODO 直接用c写的话，怎么导出memory
直接编译的c代码的话，
 (import "env" "memory" (memory $0 256 256))

内存分配是怎么实现的。
(export "_malloc" (func 69))

var _malloc = Module["_malloc"] = function() { return Module["asm"]["_malloc"].apply(null, arguments) };

目前只能有一个memory？

例如:
```javascript
//1 js创建
var memory = new WebAssembly.Memory({initial:10, maximum:100}); //注意单位是page，而不是字节，page是64k
//2 asm 导出
fetchAndInstantiate('memory.wasm').then(function(instance) {
  var i32 = new Uint32Array(instance.exports.mem.buffer);//这个buffer是64k
  for (var i = 0; i < 10; i++) {
    i32[i] = i;
  }
  var sum = instance.exports.accumulate(0, 10);//0 是指针，这里就是针对于上面的memory的地址
  console.log(sum);
});

(module
  (memory (export "mem") 1)
  (func (export "accumulate") (param $ptr i32) (param $len i32) (result i32)
    (local $end i32)
    (local $sum i32)
    (set_local $end (i32.add (get_local $ptr) (i32.mul (get_local $len) (i32.const 4))))
    (block $break (loop $top
      (br_if $break (i32.eq (get_local $ptr) (get_local $end)))
      (set_local $sum (i32.add (get_local $sum)
                               (i32.load (get_local $ptr))))
        (set_local $ptr (i32.add (get_local $ptr) (i32.const 4)))
        (br $top)
    ))
    (get_local $sum)
  )
)

//调试的时候是下面的样子，这个比wat更难看一些，因为把结构变成了指令。
func (param i32 i32) (result i32)
(local i32 i32)
  get_local 0       //push local0
  get_local 1       //push local1
  i32.const 4       //push 4
  i32.mul           //*         
  i32.add           //+        相当于 add( mul(4,local1), local0)
  set_local 2       //push result
  block
    loop
      get_local 0
      get_local 2
      i32.eq
      br_if 1
      get_local 3
      get_local 0
      i32.load offset=0 align=4
      i32.add
      set_local 3
      get_local 0
      i32.const 4
      i32.add
      set_local 0
      br 0
    end
  end
  get_local 3
end

```

## html模板

## 胶水代码都包含什么
malloc, printf之类的？

## 调用webgl
1. 怎么编译，需要-I么
不需要，可能环境中有了。但是有个问题 glGetStringi 在 GLES3/gl3.h ，却无法编译
一旦在c中调用webgl的函数，实际上都会再转到js，emcc生成js会根据调用需要链接的函数，把对应的js库函数加到xxx.js中，例如调用了 glGetIntegerv, 则xxx.js中就有一个 _glGetIntegerv 的js函数
调用了 glEnable, js中就多了一个_glEnable的函数

## 常用功能
emscripten_debugger();  调用js的debugger

## 例子分析
直接生成html的

HEAP32 是一个Int32Array,通常是4M，应该是堆栈
HEAPU8 16M的Uint8Array

```javascript
    function receiveInstance(instance) {
      exports = instance.exports;
        //这里是导出的函数，缺省的话是所有的全局函数，例如main
      if (exports.memory) mergeMemory(exports.memory);
      Module['asm'] = exports;
      Module["usingWasm"] = true;
      removeRunDependency('wasm-instantiate');
    }

    // Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
    function writeStackCookie() {
    assert((STACK_MAX & 3) == 0);
    HEAPU32[(STACK_MAX >> 2)-1] = 0x02135467;
    HEAPU32[(STACK_MAX >> 2)-2] = 0x89BACDFE;
    }    

    //执行main
    function doRun() {
        if (Module['calledRun']) return; // run may have just been called while the async setStatus time below was happening
        Module['calledRun'] = true;

        if (ABORT) return;

        ensureInitRuntime();
        preMain();

        if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
            Module.printErr('pre-main prep time: ' + (Date.now() - preloadStartTime) + ' ms');
        }

        if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();
        if (Module['_main'] && shouldRunNow) Module['callMain'](args);

        postRun();
    }    

    //好像调用printf的时候会到这里
  function ___syscall146(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // writev
      // hack to support printf in NO_FILESYSTEM
      //得到3个参数，分别是stream，iov，iovcnt
      var stream = SYSCALLS.get(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
      var ret = 0;
      if (!___syscall146.buffer) {
        ___syscall146.buffers = [null, [], []]; // 1 => stdout, 2 => stderr
        ___syscall146.printChar = function(stream, curr) {
          var buffer = ___syscall146.buffers[stream];
          assert(buffer);
          if (curr === 0 || curr === 10) {
            (stream === 1 ? Module['print'] : Module['printErr'])(UTF8ArrayToString(buffer, 0));
            buffer.length = 0;
          } else {
            buffer.push(curr);
          }
        };
      }
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAP32[(((iov)+(i*8))>>2)];
        var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
        for (var j = 0; j < len; j++) {
          ___syscall146.printChar(stream, HEAPU8[ptr+j]);
        }
        ret += len;
      }
      return ret;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }    

//memory相关
Module['HEAP'] = HEAP;
Module['buffer'] = buffer;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;
/*
这些都指向了创建的一个 Memory对象  
    Module['wasmMemory'] = new WebAssembly.Memory({ 'initial': TOTAL_MEMORY / WASM_PAGE_SIZE, 'maximum': TOTAL_MEMORY / WASM_PAGE_SIZE });
*/
```
## 兼容性
chrome 47才支持
目前微信不支持 170525

## TS转wasm


## 参考
[c to wasm](https://developer.mozilla.org/en-US/docs/WebAssembly/C_to_wasm)