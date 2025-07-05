const std = @import("std");
const models = @import("models");
const Layout = @import("../../layout/layout.zig");

pub fn render(allocator: std.mem.Allocator, post: *const models.Post) ![]const u8 {
    return Layout.render(
        allocator,
        try std.fmt.allocPrint(
            allocator,
            @embedFile("post.html"),
            .{
                post.metadata.title,
                post.metadata.date,
                post.body,
            }
        )
    );
}
