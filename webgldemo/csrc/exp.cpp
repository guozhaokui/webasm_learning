
#include <emscripten.h>
#include "ca.h"
#include "cb.h"

extern "C"{
    int EMSCRIPTEN_KEEPALIVE  exp_fun1(int a){
        CB cb;
        return cb.cb_fun1(a);
    }
}
