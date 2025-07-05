const std = @import("std");
const models = @import("models");
const Layout = @import("../../layout/layout.zig");
const dotenv = @import("dotenv");

pub fn render(
    allocator: std.mem.Allocator,
    art: []const models.Art
) ![]const u8 {
    const art_list_html = try artList(allocator, art);
    defer allocator.free(art_list_html);

    const body = try std.fmt.allocPrint(
        allocator,
        @embedFile("index.html"),
        .{ art_list_html }
    );
    defer allocator.free(body);

    return Layout.render(
        allocator,
        body
    );
}

fn artList(
    allocator: std.mem.Allocator,
    art: []const models.Art
) ![]const u8 {
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
    defer right_col_html.deinit();

    for (art, 0..) |*art_item, i| {
        const item_html = try std.fmt.allocPrint(
            allocator,
            \\ <div>
            \\   <img src="{s}/{s}" class="mb-2">
            \\   <div class="flex flex-row justify-between">
            \\       <h4>{s}</h4>
            \\       <p class="date">{s}</p>
            \\   </div>
            \\ </div>
            , .{
                dotenv.CDN_PREFIX,
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

test "route does not leak" {
    const art = &.{
        models.Art{ .title = "a", .medium = "a", .image_slug = "a" },
        models.Art{ .title = "b", .medium = "b", .image_slug = "b" },
    };

    const allocator = std.testing.allocator;
    const body = try render(allocator, art);
    defer allocator.free(body);
}
