
interface WebAssembly{
    Instance();
}

namespace WebAssembly{
    /**
     * 实际好多函数都是返回promise
     */
    class Module{
        constructor(wasmbin:ArrayBuffer){}
    }

    function Instance(mod:Module, inf:Info){

    }
    function compile(data:ArrayBuffer):Module{

    }
    class Memory{
        buffer:ArrayBuffer=null;

        constructor(memdesc:{initial:number,maximum:number}){
        }

        /**
         * 如果超出最大范围了，就会抛出 RangeError 异常
         * grow后，buffer就会变成另外一个对象了，外面使用的要注意了
         */
        grow(sz:number){}   
    }
    class Table{
        constructor(tableDesc:{ initial: number, maximum: number, element: 'anyfunc' }){}
    }
}

class Env{
    memory:WebAssembly.Memory;
    memoryBase:number;//代码从哪开始
    table:WebAssembly.Table;
    tableBase=0;//动态链接的话这个不是0
}

class Info{
    global=null;
    env=null;
    asm2wasm=null;
    parent=null;
}

function init(){
    Info['global.Math']=global.Math;
}


