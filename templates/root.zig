const std = @import("std");

// HTML
pub const fourOhFour = @embedFile("resources/html/404.html");
pub const home = @import("routes/home/index.zig");
pub const work = @import("routes/work/index.zig");
pub const art = @import("routes/art/index.zig");
pub const post = @import("routes/post/post.zig");

// JavaScript
pub const htmx_script = @embedFile("resources/js/htmx.min.js");
pub const navbar_script = @embedFile("resources/js/navbar.js");
