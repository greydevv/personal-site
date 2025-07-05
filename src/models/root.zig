pub const Post = struct {
    metadata: Metadata,
    body: []const u8,

    pub const Metadata = struct {
        title: []const u8,
        slug: []const u8,
        date: []const u8,
    };
};

pub const Art = struct {
    title: []const u8,
    medium: []const u8,
    image_slug: []const u8
};

pub const Work = struct {
    title: []const u8,
    subtitle: []const u8,
    description: []const u8,
    icon_slug: []const u8,
    time_interval: struct {
        year: u16,
        month: u8,
        num_months: ?i32
    },

    pub const Section = struct {
        year: ?u16,
        items: []const Work
    };
};

