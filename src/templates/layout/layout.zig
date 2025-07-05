const std = @import("std");

pub fn render(allocator: std.mem.Allocator, content: []const u8) ![]const u8 {
    return std.fmt.allocPrint(
        allocator,
        @embedFile("layout.html"),
        .{ content }
    );
}
