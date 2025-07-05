class WasmAllocator {
  /**
   * Creates the allocator and maintains a reference of the WASM module's
   * function exports and memory.
   */
  constructor(exports) {
    this.wasmAlloc = exports.alloc;
    this.wasmFree = exports.free;

    this.n_allocs = 0;
    this.n_frees = 0;

    this.exports = exports;
    this._mem = new DataView(exports.memory.buffer);
  }

  /**
   * Get the latest reference of the WASM memory.
   */
  get mem() {
    if (this._mem.buffer !== this.exports.memory.buffer) {
      this._mem = new DataView(this.exports.memory.buffer);
    }

    return this._mem;
  }

  /**
   * Allocate a fixed number of bytes.
   *
   * Returns a pointer to the allocated bytes.
   */
  alloc(n) {
    const ptr = this.wasmAlloc(n);
    this.n_allocs += 1;
    return ptr;
  }

  /**
   * Free a number of bytes starting at the given pointer.
   */
  free(ptr, len) {
    this.wasmFree(ptr, len);
    this.n_frees += 1;
  }

  /**
   * Dereference a number of bytes starting at the given pointer.
   *
   * Returns an ArrayBuffer containing the bytes.
   */
  deref(ptr, len) {
    const bytes = this.mem.buffer.slice(ptr, ptr + len);
    return bytes;
  }

  checkAllocsAndFrees() {
    if (this.n_allocs !== this.n_frees) {
      console.warn(`Memory mismanagement: ${this.n_allocs} allocs vs. ${this.n_frees} frees`);
    }
  }
}

/**
 * Construct a slice object, containing a pointer and a length.
 */
function Slice(ptr, len) {
  this.ptr = ptr;
  this.len = len;

  return {
    ptr: this.ptr,
    len: this.len,

    deref: function(allocator) {
      const bytes = allocator.deref(this.ptr, this.len);
      return bytes;
    }
  };
}

/**
 * Construct the output object from the given pointer.
 */
function Output(allocator, ptr) {
  return {
    err_code: allocator.mem.getInt32(ptr, true),
    slice: new Slice(
      allocator.mem.getInt32(ptr + 4, true),
      allocator.mem.getInt32(ptr + 8, true),
    )
  }
}

/**
 * Allocates and sets a string in memory.
 *
 * Returns a slice pointing to the underlying bytes.
 */
function _allocBytes(allocator, bytes) {
  const ptr = allocator.alloc(bytes.length);

  const dest = new Uint8Array(
    allocator.mem.buffer,
    ptr,
    bytes.length
  );

  new TextEncoder().encodeInto(bytes, dest);

  return Slice(ptr, bytes.length);
}

async function initializeWasmModule() {
  const importObject = {
    env: {
      printBytes: function(ptr, len) {
        const bytes = allocator.deref(ptr, len);
        console.log(new TextDecoder().decode(bytes))
        allocator.free(ptr, len);
      },
      print: function(num) {
        console.log(num);
      }
    }
  }

  const module = await WebAssembly.instantiateStreaming(
    fetch("/resources/demarkate/demarkate.wasm"),
    importObject
  );

  const exports = module.instance.exports;

  return {
    allocator: new WasmAllocator(exports),

    render: function(raw_input) {
      const input = _allocBytes(this.allocator, raw_input);

      const output_ptr = exports.renderHtml(input.ptr, input.len);
      const output = Output(this.allocator, output_ptr);

      this.allocator.free(input.ptr, input.len);
      this.allocator.checkAllocsAndFrees();

      if (output.err_code == 0) {
        const outputBuf = this.allocator.deref(output.slice.ptr, output.slice.len);
        return new TextDecoder().decode(outputBuf);
      } else {
        return null;
      }
    }
  };
}
