const std = @import("std");
const builtin = @import("builtin");
const build_options = @import("build_options");

const httpz = @import("httpz");
const pg = @import("pg");
const dotenv = @import("dotenv");
const models = @import("models");
const templates = @import("templates");

pub const pg_stderr_tls = true;

const Handler = struct {
    pool: *pg.Pool,

    pub fn init(allocator: std.mem.Allocator) !Handler {
        return .{
            .pool = try pg.Pool.init(allocator, .{
              .size = 5,
              .connect = .{
                .port = dotenv.DB_PORT,
                .host = dotenv.DB_HOST,
              },
              .auth = .{
                .username = dotenv.DB_USERNAME,
                .database = dotenv.DB_DATABASE,
                .password = dotenv.DB_PASSWORD,
                .timeout = 10_000,
              }
            })
        };
    }

    pub fn deinit(self: *Handler) void {
        self.pool.deinit();
    }

    pub fn notFound(_: *Handler, req: *httpz.Request, res: *httpz.Response) !void {
        std.log.err("not found: {s}\n", .{ req.url.path });
        res.status = 404;

        if (std.mem.eql(u8, req.url.path, "/favicon.ico")) {
            // TODO: Is it OK to send nothing?
        } else {
            res.body = templates.fourOhFour;
        }
    }

    pub fn uncaughtError(self: *Handler, req: *httpz.Request, res: *httpz.Response, err: anyerror) void {
        std.log.err("error at {s}: {}", .{ req.url.path, err });
        pg.printSSLError();
        for (self.pool._conns) |conn| {
            if (conn.err) |e| {
                std.log.err("  (PG): {s}", .{ e.message });
            }
        }

        res.status = 500;
        res.body = "Internal server error";
    }
};

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    var handler = try Handler.init(allocator);
    defer handler.deinit();

    var server = try httpz.Server(*Handler).init(allocator, .{
        .port = dotenv.HTTP_SERVER_PORT,
        .request = .{
            .max_form_count = 20
        }
    }, &handler);

    defer server.deinit();
    defer server.stop();

    var router = try server.router(.{});

    // serving public files
    router.get("/js/htmx.min.js", getHtmxScript, .{});
    router.get("/js/navbar.js", getNavbarScript, .{});
    router.get("/js/demarkate_wasm.js", getDemarkateWasmJs, .{});
    router.get("/wasm/demarkate.wasm", getDemarkateWasm, .{});
    router.get("/css/output.css", getCssStylesheet, .{});

    // serving html
    router.get("/", getHome, .{});
    router.get("/work", getWork, .{});
    router.get("/art", getArt, .{});
    router.get("/post/:slug", getPost, .{});
    router.get("/demarkate", getDemarkate, .{});

    // serving .well-known files
    router.get("/.well-known/appspecific/com.chrome.devtools.json", getChromeDevToolsJson, .{});

    std.log.info("Listening http://localhost:{d}/\n", .{ dotenv.HTTP_SERVER_PORT });

    try server.listen();
}

fn sendFile(res: *httpz.Response, path: []const u8) !void {
    const file = std.fs.cwd().openFile(path, .{}) catch |err| {
        std.log.err("openFile({s}): {s}\n", .{ path, @errorName(err) });
        return err;
    };

    const body = file.readToEndAlloc(res.arena, 30000) catch |err| {
        std.log.err("readToEndAlloc({s}): {s}\n", .{ path, @errorName(err) });
        return err;
    };

    std.log.info("\"{s}\" read ({} bytes)", .{ path, body.len });

    res.status = 200;
    res.body = body;
}

fn getHtmxScript(_: *Handler, _: *httpz.Request, res: *httpz.Response) !void {
    res.status = 200;
    res.body = templates.htmx_script;
}

fn getNavbarScript(_: *Handler, _: *httpz.Request, res: *httpz.Response) !void {
    res.status = 200;
    res.body = templates.navbar_script;
}

fn getCssStylesheet(_: *Handler, _: *httpz.Request, res: *httpz.Response) !void {
    try sendFile(res, build_options.css_install_path);
}

fn getChromeDevToolsJson(_: *Handler, _: *httpz.Request, res: *httpz.Response) !void {
    res.status = 204;
}

fn getHome(handler: *Handler, _: *httpz.Request, res: *httpz.Response) !void {
    var result = try handler.pool.queryOpts(
        "SELECT title, slug, to_char(date, 'MM-DD-YYYY') AS date FROM posts",
        .{},
        .{ .column_names = true }
    );
    defer result.deinit();

    var posts = std.ArrayList(models.Post.Metadata).init(res.arena);
    defer posts.deinit();

    var mapper = result.mapper(models.Post.Metadata, .{});
    while (try mapper.next()) |post| {
        try posts.append(post);
    }

    res.status = 200;
    res.body = try templates.home.render(res.arena, posts.items);
}


fn getWork(handler: *Handler, _: *httpz.Request, res: *httpz.Response) !void {
    var result = try handler.pool.queryOpts(
        \\ SELECT
        \\   title, subtitle, description, icon_slug,
        \\   EXTRACT(YEAR FROM date_start) AS year_start,
        \\   EXTRACT(MONTH FROM date_start) AS month_start,
        \\   ((date_end - date_start) / 30) as num_months
        \\ FROM
        \\   work
        \\ ORDER BY
        \\   date_end IS NOT NULL,
        \\   date_start DESC,
        \\   title DESC
        \\ ;
        ,
        .{},
        .{ .column_names = true }
    );
    defer result.deinit();

    var work = std.ArrayList(models.Work).init(res.arena);
    defer work.deinit();

    while (try result.next()) |row| {
        var work_item = models.Work{
            .title = row.get([]u8, 0),
            .subtitle = row.get([]u8, 1),
            .description = row.get([]u8, 2),
            .icon_slug = row.get([]u8, 3),
            .time_interval = .{
                .year = numericToValue(u16, row.get(pg.Numeric, 4)),
                .month = numericToValue(u8, row.get(pg.Numeric, 5)),
                .num_months = null,
            }
        };

        if (row.get(?i32, 6)) |num_months| {
            work_item.time_interval.num_months = num_months;
        }

        try work.append(work_item);
    }

    res.status = 200;
    res.body = try templates.work.render(res.arena, work.items);
}

fn numericToValue(comptime T: type, numeric: pg.Numeric) T {
    const value = std.mem.bytesToValue(u16, numeric.digits);

    switch (builtin.cpu.arch.endian()) {
        .big => return @truncate(value),
        .little => return @truncate(@byteSwap(value))
    }
}

fn getArt(handler: *Handler, _: *httpz.Request, res: *httpz.Response) !void {
    var result = try handler.pool.queryOpts(
        "SELECT title, medium, image_slug FROM art ORDER BY date DESC",
        .{},
        .{ .column_names = true }
    );
    defer result.deinit();

    var art = std.ArrayList(models.Art).init(res.arena);
    defer art.deinit();

    var mapper = result.mapper(models.Art, .{});
    while (try mapper.next()) |art_row| {
        try art.append(art_row);
    }

    res.status = 200;
    res.body = try templates.art.render(res.arena, dotenv.CDN_PREFIX, art.items);
}

fn getPost(handler: *Handler, req: *httpz.Request, res: *httpz.Response) !void {
    var result = try handler.pool.queryOpts(
        "SELECT title, to_char(date, 'MM-DD-YYYY') AS date, body FROM posts WHERE slug=$1",
        .{ req.param("slug").? },
        .{ .column_names = true }
    );
    defer result.deinit();

    if (try result.next()) |row| {
        const post = models.Post{
            .metadata = .{
                .title = row.get([]u8, 0),
                .slug = "",
                .date = row.get([]u8, 1),
            },
            .body = row.get([]u8, 2)
        };

        res.status = 200;
        res.body = try templates.post.render(res.arena, &post);
    } else {
        res.status = 404;
        res.body = templates.fourOhFour;
    }
}

fn getDemarkate(_: *Handler, _: *httpz.Request, res: *httpz.Response) !void {
    try sendFile(res, "templates/resources/html/demarkate_editor.html");
}

fn getDemarkateWasmJs(_: *Handler, _: *httpz.Request, res: *httpz.Response) !void {
    try sendFile(res, "templates/resources/js/demarkate_wasm.js");
}

fn getDemarkateWasm(_: *Handler, _: *httpz.Request, res: *httpz.Response) !void {
    res.content_type = .WASM;
    try sendFile(res, build_options.wasm_install_path);
}
