const std = @import("std");

pub fn render(allocator: std.mem.Allocator, content: []const u8) ![]const u8 {
    // if (@hasDecl(@TypeOf(content), "render")) {
    //     @compileError("type '" ++ @typeName(@TypeOf(content)) ++ "' has no 'render' method");
    // }

    return std.fmt.allocPrint(
        allocator,
        @embedFile("layout.html"),
        .{ content }
    );
}
