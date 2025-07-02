import { z } from "zod";

// codec_typeのenum化
export const CodecTypeEnum = z.enum(["video", "audio"]);

export const FfprobeStreamTagsSchema = z
  .object({
    language: z.string().optional(),
    handler_name: z.string().optional(),
    vendor_id: z.string().optional(),
  })
  .catchall(z.string().optional())
  .strict();

export const FfprobeStreamDispositionSchema = z
  .object({
    default: z.number(),
    dub: z.number(),
    original: z.number(),
    comment: z.number(),
    lyrics: z.number(),
    karaoke: z.number(),
    forced: z.number(),
    hearing_impaired: z.number(),
    visual_impaired: z.number(),
    clean_effects: z.number(),
    attached_pic: z.number(),
    timed_thumbnails: z.number(),
    non_diegetic: z.number(),
    captions: z.number(),
    descriptions: z.number(),
    metadata: z.number(),
    dependent: z.number(),
    still_image: z.number(),
    multilayer: z.number(),
  })
  .strict();

// video stream schema（必須項目のみ）
export const FfprobeVideoStreamBaseSchema = z
  .object({
    index: z.number(),
    codec_name: z.string(),
    codec_long_name: z.string(),
    profile: z.string(),
    codec_type: z.literal("video"),
    codec_tag: z.string(),
    codec_tag_string: z.string(),
    width: z.number(),
    height: z.number(),
    coded_width: z.number(),
    coded_height: z.number(),
    closed_captions: z.number(),
    film_grain: z.number(),
    has_b_frames: z.number(),
    pix_fmt: z.string(),
    level: z.number(),
    chroma_location: z.string(),
    disposition: FfprobeStreamDispositionSchema,
    tags: FfprobeStreamTagsSchema,
    // video固有の追加フィールド
    field_order: z.string().optional(),
    refs: z.number().optional(),
    is_avc: z.string().optional(),
    nal_length_size: z.string().optional(),
    id: z.string().optional(),
    r_frame_rate: z.string().optional(),
    avg_frame_rate: z.string().optional(),
    time_base: z.string().optional(),
    start_pts: z.number().optional(),
    start_time: z.string().optional(),
    duration_ts: z.number().optional(),
    duration: z.string().optional(),
    bit_rate: z.string().optional(),
    bits_per_raw_sample: z.string().optional(),
    nb_frames: z.string().optional(),
    extradata_size: z.number().optional(),
  })
  .strict();

export const FfprobeVideoStreamSchemaAllColor =
  FfprobeVideoStreamBaseSchema.extend({
    color_range: z.string(),
    color_space: z.string(),
    color_transfer: z.string(),
    color_primaries: z.string(),
  });

export const FfprobeVideoStreamSchemaNoColor =
  FfprobeVideoStreamBaseSchema.extend({
    color_range: z.undefined().optional(),
    color_space: z.undefined().optional(),
    color_transfer: z.undefined().optional(),
    color_primaries: z.undefined().optional(),
  });

export const FfprobeVideoStreamSchemaAspectRatio = z.object({
  sample_aspect_ratio: z.string(),
  display_aspect_ratio: z.string(),
});

export const FfprobeVideoStreamSchemaNoAspectRatio = z.object({
  sample_aspect_ratio: z.undefined().optional(),
  display_aspect_ratio: z.undefined().optional(),
});

export const FfprobeVideoStreamSchema = z.union([
  z.union([FfprobeVideoStreamSchemaAllColor, FfprobeVideoStreamSchemaNoColor]),
  z.union([
    FfprobeVideoStreamSchemaAspectRatio,
    FfprobeVideoStreamSchemaNoAspectRatio,
  ]),
]);

export const FfprobeAudioStreamSchema = z
  .object({
    index: z.number(),
    codec_name: z.string(),
    codec_long_name: z.string(),
    profile: z.string(),
    codec_type: z.literal("audio"),
    codec_tag: z.string(),
    codec_tag_string: z.string(),
    sample_fmt: z.string(),
    sample_rate: z.string(),
    channels: z.number(),
    channel_layout: z.string(),
    bits_per_sample: z.number(),
    initial_padding: z.number(),
    id: z.string().optional(),
    r_frame_rate: z.string(),
    avg_frame_rate: z.string(),
    time_base: z.string(),
    start_pts: z.number(),
    start_time: z.string(),
    duration_ts: z.number().optional(),
    duration: z.string().optional(),
    bit_rate: z.string().optional(),
    nb_frames: z.string().optional(),
    extradata_size: z.number(),
    disposition: FfprobeStreamDispositionSchema,
    tags: FfprobeStreamTagsSchema,
  })
  .strict();

export const FfprobeStreamSchema = z.union([
  FfprobeVideoStreamSchema,
  FfprobeAudioStreamSchema,
]);

export const FfprobeFormatTagsSchema = z.record(z.string(), z.string());

const FfprobeFormatSchemaBase = z
  .object({
    filename: z.string(),
    nb_streams: z.number(),
    nb_programs: z.number(),
    nb_stream_groups: z.number(),
    format_name: z.string(),
    format_long_name: z.string(),
    size: z.string(),
    probe_score: z.number(),
    tags: FfprobeFormatTagsSchema.optional(),
  })
  .strict();

const FfprobeFormatSchemaFull = FfprobeFormatSchemaBase.extend({
  start_time: z.string(),
  duration: z.string(),
  bit_rate: z.string(),
});

const FfprobeFormatSchemaMinimal = FfprobeFormatSchemaBase.extend({
  start_time: z.undefined().optional(),
  duration: z.undefined().optional(),
  bit_rate: z.undefined().optional(),
});

export const FfprobeFormatSchema = z.union([
  FfprobeFormatSchemaFull,
  FfprobeFormatSchemaMinimal,
]);

export const FfprobeOutputSchema = z
  .object({
    streams: z.array(FfprobeStreamSchema),
    format: FfprobeFormatSchema,
  })
  .strict();

export type FfprobeStreamTags = z.infer<typeof FfprobeStreamTagsSchema>;
export type FfprobeStreamDisposition = z.infer<
  typeof FfprobeStreamDispositionSchema
>;
export type FfprobeStream = z.infer<typeof FfprobeStreamSchema>;
export type FfprobeVideoStream = z.infer<typeof FfprobeVideoStreamBaseSchema>;
export type FfprobeOutput = z.infer<typeof FfprobeOutputSchema>;
export type FfprobeFormatTags = z.infer<typeof FfprobeFormatTagsSchema>;
export type FfprobeFormat = z.infer<typeof FfprobeFormatSchema>;
