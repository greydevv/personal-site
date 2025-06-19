const std = @import("std");
const models = @import("models");
const Layout = @import("../../layout/layout.zig");

pub fn render(allocator: std.mem.Allocator, posts: []const models.Post.Metadata) ![]const u8 {
    const posts_list_html = try postsList(allocator, posts);
    defer allocator.free(posts_list_html);

    return try Layout.render(
        allocator,
        try std.fmt.allocPrint(
            allocator,
            @embedFile("index.html"),
            .{ posts_list_html }
        )
    );
}

pub fn postsList(allocator: std.mem.Allocator, posts: []const models.Post.Metadata) ![]const u8 {
    if (posts.len == 0) {
        return "<p>No posts yet :)</p>";
    }

    var html = std.ArrayList(u8).init(allocator);
    defer html.deinit();

    for (posts) |*post| {
        const item_html = try std.fmt.allocPrint(
            allocator,
            \\ <div class="flex flex-row justify-between">
            \\   <a href="post/{s}"><h4 class="font-semibold">{s}</h4></a>
            \\   <p class="date">{s}</p>
            \\ </div>
            , .{
                post.slug,
                post.title,
                post.date,
            }
        );
        defer allocator.free(item_html);

        try html.appendSlice(item_html);
    }

    return html.toOwnedSlice();
}
