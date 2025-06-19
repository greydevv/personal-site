const std = @import("std");
const dmk = @import("demarkate");
const models = @import("models");
const Layout = @import("../../layout/layout.zig");

pub fn render(allocator: std.mem.Allocator, post: *const models.Post) ![]const u8 {
    const post_body = try renderBody(allocator, post);
    defer allocator.free(post_body);

    return Layout.render(
        allocator,
        try std.fmt.allocPrint(
            allocator,
            @embedFile("post.html"),
            .{
                post.metadata.title,
                post.metadata.date,
                post_body,
            }
        )
    );
}

fn renderBody(allocator: std.mem.Allocator, post: *const models.Post) ![]const u8 {
    const source = try addSentinel(allocator, post.body);
    defer allocator.free(source);


    const document = try dmk.parseBytes(allocator, source);
    defer document.deinit();

    var renderer = dmk.HtmlRenderer.init(allocator, source);
    defer renderer.deinit();
    try renderer.render(document.elements);

    return renderer.buffer.toOwnedSlice();
}

fn addSentinel(allocator: std.mem.Allocator, bytes: []const u8) ![:0]const u8 {
    const z = try allocator.allocSentinel(u8, bytes.len, 0);
    @memcpy(z[0..bytes.len], bytes);

    return z;
}
