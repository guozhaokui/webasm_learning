
1. 加载wasm文件到arraybuffer
2. 把他编译到 WebAssembly.Module
3. 加上需要import的模块来实例化 WebAssembly.Module， 返回一个exports

栈
    所有的操作都是影响堆栈，例如 getglobal 就是把结果放到栈顶，下面的call可以直接使用
    参数是按照先左后右的顺序入栈的，例如 func1(a,b)则
    a
    b
    call func1

    

导入和导出
    导入的是js函数。导出的可以让js执行。
    (func $i (import “imports” “i”) (param i32))
        这个表示 $i 是从 imports.i导入的，所以需要在instance的时候有对应的导入对象
        var importObject = { imports: { i: arg => console.log(arg) } }; 

    导出函数的返回值
    例如 float test(){}

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

fetch
    fetch(url).then(response=>{});
    response
        arrayBuffer
        json

几种流程
    1. C/C++ Source ⇒ asm2wasm ⇒ WebAssembly
        emcc
