const std = @import("std");
const models = @import("models");
const dotenv = @import("dotenv");
const Layout = @import("../../layout/layout.zig");

pub fn render(allocator: std.mem.Allocator, work: []const models.Work) ![]const u8 {
    var sections_html = std.ArrayList(u8).init(allocator);
    defer sections_html.deinit();

    var items_html_buf = std.ArrayList(u8).init(allocator);
    defer items_html_buf.deinit();

    for (work) |*work_item| {
        if (work_item.time_interval.num_months != null) {
            continue;
        }

        const item_html = try item(allocator, work_item);
        defer allocator.free(item_html);

        try items_html_buf.appendSlice(item_html);
    }

    if (items_html_buf.items.len > 0) {
        try sections_html.appendSlice(
            try section(
                allocator,
                "Now",
                &items_html_buf
            )
        );
    }

    var current_year_start: u16 = 0;
    for (work) |*work_item| {
        if (work_item.time_interval.num_months == null) {
            continue;
        }

        if (current_year_start != work_item.time_interval.year) {
            // new section is started
            // drain buffer into section and append section
            if (items_html_buf.items.len > 0) {
                try sections_html.appendSlice(
                    try sectionWithYear(
                        allocator,
                        current_year_start,
                        &items_html_buf
                    )
                );
            }

            current_year_start = work_item.time_interval.year;
        }

        const item_html = try item(allocator, work_item);
        defer allocator.free(item_html);

        try items_html_buf.appendSlice(item_html);
    }

    if (items_html_buf.items.len > 0) {
        try sections_html.appendSlice(
            try sectionWithYear(
                allocator,
                current_year_start,
                &items_html_buf
            )
        );
    }

    return Layout.render(
        allocator,
        try std.fmt.allocPrint(
            allocator,
            @embedFile("index.html"),
            .{ sections_html.items }
        )
    );
}

fn sectionWithYear(
    allocator: std.mem.Allocator,
    year: u16,
    items_html_buf: *std.ArrayList(u8),
) ![]const u8 {
    const heading = try std.fmt.allocPrint(
        allocator,
        "{}",
        .{ year }
    );

    return section(allocator, heading, items_html_buf);
}

fn item(
    allocator: std.mem.Allocator,
    work_item: *const models.Work
) ![]const u8 {
    const logo_url = try std.fmt.allocPrint(
        allocator,
        "{s}/logos/{s}",
        .{
            dotenv.CDN_PREFIX,
            work_item.icon_slug
        }
    );
    defer allocator.free(logo_url);

    return std.fmt.allocPrint(
        allocator,
        @embedFile("item.html"),
        .{
            logo_url,
            work_item.title,
            try intervalText(allocator, work_item),
            work_item.description
        }
    );
}

fn section(
    allocator: std.mem.Allocator,
    heading: []const u8,
    items_html_buf: *std.ArrayList(u8),
) ![]const u8 {
    const html = try std.fmt.allocPrint(
        allocator,
        @embedFile("section.html"),
        .{
            heading,
            items_html_buf.items
        }
    );

    items_html_buf.clearAndFree();
    return html;
}

fn intervalText(allocator: std.mem.Allocator, work_item: *const models.Work) ![]const u8 {
    const months: [12][]const u8 = .{
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    };

    if (work_item.time_interval.num_months) |num_months| {
        const plurality = if (num_months == 1) "month" else "months";
        return try std.fmt.allocPrint(
            allocator,
            "{s}, {} {s}",
            .{
                months[work_item.time_interval.month - 1],
                num_months,
                plurality,
            }
        );
    } else {
        return try std.fmt.allocPrint(
            allocator,
            "since {s} {}",
            .{
                months[work_item.time_interval.month - 1],
                work_item.time_interval.year
            }
        );
    }
}
