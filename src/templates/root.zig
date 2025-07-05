const std = @import("std");

pub const home = @import("routes/home/index.zig");
pub const work = @import("routes/work/index.zig");
pub const art = @import("routes/art/index.zig");
pub const post = @import("routes/post/post.zig");

test {
    @import("std").testing.refAllDecls(@This());
}
