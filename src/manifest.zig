const build_options = @import("build_options");
const httpz = @import("httpz");

const Resource = struct {
    req_path: []const u8,
    file_path: []const u8,
    content_type: httpz.ContentType,

    fn init(
        comptime req_path: []const u8,
        comptime file_path: []const u8,
        comptime content_type: httpz.ContentType,
    ) Resource {
        return .{
            .req_path = req_path,
            .file_path = file_path,
            .content_type = content_type
        };
    }
};

pub const fourOhFour = "src/resources/404.html";

pub const static = [_]Resource{
    .init("/resources/output.css",               build_options.css_install_path,          .CSS ),
    .init("/resources/layout/navbar.js",         "src/resources/layout/navbar.js",        .JS  ),
    .init("/resources/404.html",                 fourOhFour,                              .HTML),
    .init("/resources/post/post.js",             "src/resources/post/post.js",            .JS  ),
    .init("/resources/demarkate/shim.js",        "src/resources/demarkate/shim.js",       .JS  ),
    .init("/resources/demarkate/editor.js",      "src/resources/demarkate/editor.js",     .JS  ),
    .init("/resources/demarkate/demarkate.wasm", build_options.wasm_install_path,         .WASM),
    .init("/resources/favicon/favicon-32.png",   "src/resources/favicon/favicon-32.png",  .PNG ),
    .init("/resources/favicon/favicon-180.png",  "src/resources/favicon/favicon-180.png", .PNG ),
    .init("/resources/favicon/favicon-192.png",  "src/resources/favicon/favicon-192.png", .PNG ),
    .init("/resources/favicon/favicon.png",      "src/resources/favicon/favicon.png",     .PNG ),
};
