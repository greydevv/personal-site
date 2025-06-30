const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // Module: exe
    const exe_mod = b.createModule(.{
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });


    // Module: templates
    const templates_mod = b.createModule(.{
        .root_source_file = b.path("templates/root.zig"),
        .target = target,
        .optimize = optimize,
    });


    // Module: models
    const models_mod = b.createModule(.{
        .root_source_file = b.path("models/root.zig"),
        .target = target,
        .optimize = optimize
    });

    // Imports
    {
        exe_mod.addImport("templates", templates_mod);
        exe_mod.addImport("models", models_mod);
        templates_mod.addImport("models", models_mod);
    }

    // Dependency: dotenv
    {
        const dotenv = b.createModule(.{
            .root_source_file = b.path("deps/dotenv.zig"),
            .target = target,
            .optimize = optimize,
        });

        exe_mod.addImport("dotenv", dotenv);
        templates_mod.addImport("dotenv", dotenv);
    }

    // Dependency: demarkate
    {
        const demarkate = b.dependency("demarkate", .{
            .target = target,
            .optimize = optimize,
        });

        templates_mod.addImport("demarkate", demarkate.module("demarkate"));
    }

    // Dependency: httpz
    {
        const httpz = b.dependency("httpz", .{
            .target = target,
            .optimize = optimize
        });

        exe_mod.addImport("httpz", httpz.module("httpz"));
    }

    // Dependency: pg
    {
        const pg = b.dependency("pg", .{
            .target = target,
            .optimize = optimize,
            .openssl_lib_name = @as([]const u8, "ssl"),
        });

        exe_mod.addImport("pg", pg.module("pg"));
    }

    // Run step
    {
        const exe_build_options = b.addOptions();

        const exe = b.addExecutable(.{
            .name = "personal-site",
            .root_module = exe_mod,
        });

        exe.linkLibC();

        b.installArtifact(exe);

        const run_cmd = b.addRunArtifact(exe);
        run_cmd.step.dependOn(b.getInstallStep());

        if (b.args) |args| {
            run_cmd.addArgs(args);
        }

        const run_step = b.step("run", "Run the app");
        run_step.dependOn(&run_cmd.step);

        // install demarkate.wasm
        const wasm_install_path = b.getInstallPath(.prefix, "wasm/demarkate.wasm");
        exe_build_options.addOption(
            []const u8,
            "wasm_install_path",
            wasm_install_path
        );
        run_step.dependOn(demarkateWasmStep(b, "wasm/"));

        // generate tailwind CSS classes
        const css_install_path = b.getInstallPath(.prefix, "css/output.css");
        exe_build_options.addOption(
            []const u8,
            "css_install_path",
            css_install_path
        );

        exe_mod.addOptions("build_options", exe_build_options);

        run_step.dependOn(tailwindCssStep(b, css_install_path));
    }

    // Test step
    {
        const exe_tests = b.addTest(.{
            .root_module = exe_mod,
        });

        const templates_tests = b.addTest(.{
            .root_module = templates_mod,
        });

        const run_exe_tests = b.addRunArtifact(exe_tests);
        const run_templates_tests = b.addRunArtifact(templates_tests);
        const test_step = b.step("test", "Run unit tests");
        test_step.dependOn(&run_exe_tests.step);
        test_step.dependOn(&run_templates_tests.step);
    }
}

/// Create the step to emit a .wasm file from demarkate.
fn demarkateWasmStep(b: *std.Build, install_path: []const u8) *std.Build.Step {
    const demarkate = b.dependency("demarkate", .{
        .wasm = true,
        .optimize = std.builtin.OptimizeMode.ReleaseSmall,
    });

    const install_wasm = b.addInstallArtifact(
        demarkate.artifact("demarkate"),
        .{ .dest_dir = .{ .override = .{ .custom = install_path } } },
    );

    return &install_wasm.step;
}

/// Create the step to emit output.css from the tailwindcss standalone CLI
/// tool.
///
/// The CLI tool must be in your PATH. To install it, run the following
/// commands:
///   $ curl -sLO https://github.com/tailwindlabs/tailwindcss/releases/download/v<version>/tailwindcss-<os>-<cpu arch>
///   $ chmod u+x tailwindcss-<os>-<cpu arch>
///   $ mv tailwindcss-<os>-<cpu arch> tailwindcss
fn tailwindCssStep(b: *std.Build, install_path: []const u8) *std.Build.Step {
    const generate_css_cmd = b.addSystemCommand(&.{
        "tailwindcss",
        "-i", "templates/tailwindcss/input.css", // input file
        "-o", install_path, // output file
        "--minify"
    });

    return &generate_css_cmd.step;
}
