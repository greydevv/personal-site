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
    if (allocator.n_allocs !== allocator.n_frees) {
      throw `Memory mismanagement: ${allocator.n_allocs} allocs vs. ${allocator.n_frees} frees`;
    }
  }
}

var allocator = undefined;

/**
 * Allocates and sets a string in memory.
 *
 * Returns a slice pointing to the underlying bytes.
 */
function allocBytes(bytes) {
  const ptr = allocator.alloc(bytes.length);

  const dest = new Uint8Array(
    allocator.mem.buffer,
    ptr,
    bytes.len
  );

  new TextEncoder().encodeInto(bytes, dest);

  return Slice(ptr, bytes.length);
}

function Slice(ptr, len) {
  this.ptr = ptr;
  this.len = len;

  return {
    ptr: this.ptr,
    len: this.len,
    deref: function() {
      const bytes = allocator.deref(this.ptr, this.len);
      return bytes;
    }
  };
}

/**
 * Construct the output object from the given pointer.
 */
function Output(ptr) {
  const mem = allocator.mem;

  const err_code = allocator.mem.getInt32(ptr, true);
  const slice = new Slice(
    allocator.mem.getInt32(ptr + 4, true),
    allocator.mem.getInt32(ptr + 8, true),
  );

  const string = new TextDecoder().decode(slice.deref());

  return {
    err_code: err_code,
    string: string,
  }
}

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

var viewSourceClicked = function() {
  throw "WASM module not initialized";
}

var closeOutputClicked = function() {
  throw "WASM module not initialized";
}

WebAssembly.instantiateStreaming(fetch("/wasm/demarkate.wasm"), importObject)
  .then(
    (obj) => {
      const exports = obj.instance.exports;
      const body = document.getElementById("body");

      function setContent(content) {
        body.style.display = "block";
        body.innerHTML = content;
      }

      function renderInitial() {
        allocator = new WasmAllocator(exports);

        const input = allocBytes(body.innerHTML);
        allocator.free(input.ptr, input.len);

        const output = Output(exports.renderHtml(input.ptr, input.len));
        if (output.err_code == 0) {
          setContent(output.string);
        } else {
          setContent(`<p>failed to render the post :(</p>`);
        }

        allocator.checkAllocsAndFrees();
      }

      if (document.readyState === "complete") {
        renderInitial();
      } else {
        window.addEventListener("load", (event) => {
          renderInitial();
        });
      }
    }
  )
  .catch(
    (e) => {
      console.log(e);
    }
  );
