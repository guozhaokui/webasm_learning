#include <stdio.h>
//#include <time.h>
//#include <math.h>

float testf1(float x ){
    return x*x/2.0;
}

void pertest(int n){
    int num = 100000;
    for(int i=0; i<num; i++){
        testf1(i*1.1f);
    }
}
int main(int argc, char ** argv) {
    printf("Hello, world!\n");
    pertest(10000);
    int num = 100000;
    float v = 1.0;
    for(int i=0; i<num; i++){
        v=v*1.23f*v;
        v/=v; 
        v/=v;
    }
    printf("v=%f\n",v);
}

