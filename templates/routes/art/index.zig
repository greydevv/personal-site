const std = @import("std");
const models = @import("models");
const Layout = @import("../../layout/layout.zig");

pub fn render(allocator: std.mem.Allocator, art: []const models.Art) ![]const u8 {
    const art_list_html = try artList(allocator, art);
    defer allocator.free(art_list_html);

    return Layout.render(
        allocator,
        try std.fmt.allocPrint(
            allocator,
            @embedFile("index.html"),
            .{ art_list_html }
        )
    );
}

fn artList(allocator: std.mem.Allocator, art: []const models.Art) ![]const u8 {
    const html_fmt = 
        \\ <div class="mx-auto grid grid-cols-2 gap-x-6">
        \\   <div class="col-start-1 col-end-2 flex flex-col gap-y-6">
        \\     {s}
        \\   </div>
        \\   <div class="col-start-2 col-end-3 flex flex-col gap-y-6">
        \\     {s}
        \\   </div>
        \\ </div>
        ;

    var left_col_html = std.ArrayList(u8).init(allocator);
    defer left_col_html.deinit();

    var right_col_html = std.ArrayList(u8).init(allocator);
    defer left_col_html.deinit();

    for (art, 0..) |*art_item, i| {
        const item_html = try std.fmt.allocPrint(
            allocator,
            \\ <div class="flex flex-col">
            \\   <img 
            \\     src="https://s3.us-east-1.amazonaws.com/cdn.greysonmurray.com/art/{s}"
            \\     class="mb-2"
            \\   >
            \\   <h4>{s}</h4>
            \\   <p class="italic">
            \\     {s}
            \\   </p>
            \\ </div>
            , .{
                art_item.image_slug,
                art_item.title,
                art_item.medium
            }
        );
        defer allocator.free(item_html);

        if (i % 2 == 0) {
            try left_col_html.appendSlice(item_html);
        } else {
            try right_col_html.appendSlice(item_html);
        }
    }

    return try std.fmt.allocPrint(
        allocator,
        html_fmt,
        .{ left_col_html.items, right_col_html.items }
    );
}
