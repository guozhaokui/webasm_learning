  (module
  (import "STACKTOP" "" (global $STACKTOP$TT i32))
  (func $i (import "imports" "i") (param f32))
  (global $STACKTOP (mut i32) (get_global $STACKTOP$TT))
  (func (export "e") (param $$0 i32) (result f32)
    (local $$1 i32)
    (local $$10 f32)
    (local $$11 f32)
    (local $$12 f32)
    (local $$13 i32)
    (local $$14 i32)
    (local $$15 f32)
    (local $$2 i32)
    (local $$3 f32)
    (local $$4 i32)
    (local $$5 i32)
    (local $$6 i32)
    (local $$7 i32)
    (local $$8 i32)
    (local $$9 f32)
    (local $label i32)
    (local $sp i32)
    (set_local $sp
      (get_global $STACKTOP)
    )
    (set_global $STACKTOP
      (i32.add
        (get_global $STACKTOP)
        (i32.const 16)
      )
    )
    (set_local $$1
      (get_local $$0)
    )
    (set_local $$2
      (i32.const 100000)
    )
    (set_local $$3
      (f32.const 1)
    )
    (set_local $$4
      (i32.const 0)
    )
    (loop $while-in
      (block $while-out
        (set_local $$5
          (get_local $$4)
        )
        (set_local $$6
          (get_local $$2)
        )
        (set_local $$7
          (i32.lt_s
            (get_local $$5)
            (get_local $$6)
          )
        )
        (if
          (i32.eqz
            (get_local $$7)
          )
          (br $while-out)
        )
        (set_local $$8
          (get_local $$4)
        )
        (set_local $$9
          (f32.convert_s/i32
            (get_local $$8)
          )
        )
        (set_local $$10
          (f32.mul
            (get_local $$9)
            (f32.const 1.100000023841858)
          )
        )
        (set_local $$11
          (get_local $$3)
        )
        (set_local $$12
          (f32.add
            (get_local $$11)
            (get_local $$10)
          )
        )
        (set_local $$3
          (get_local $$12)
        )
        (set_local $$13
          (get_local $$4)
        )
        (set_local $$14
          (i32.add
            (get_local $$13)
            (i32.const 1)
          )
        )
        (set_local $$4
          (get_local $$14)
        )
        (br $while-in)
      )
    )
    (set_local $$15
      (get_local $$3)
    )
    (set_global $STACKTOP
      (get_local $sp)
    )
    ;;打印结果
    (get_local $$3)
    call $i
    (return
      (get_local $$15)
    )
  )
  )