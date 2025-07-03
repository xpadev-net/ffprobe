import { z } from "zod";

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

export const FfprobeVideoSideDataSchema = z
  .object({
    side_data_type: z.string(),
    side_data_size: z.number().optional(),
  })
  .strict()
  .catchall(z.any())
  .strict();

// 各ストリームに共通するベーススキーマ
export const FfprobeBaseStreamSchema = z
  .object({
    index: z.number(),
    profile: z.string().optional(),
    id: z.string().optional(),
    codec_tag: z.string(),
    codec_tag_string: z.string().optional(),
    codec_name: z.string().optional(),
    codec_long_name: z.string().optional(),
    r_frame_rate: z.string(),
    avg_frame_rate: z.string(),
    time_base: z.string(),
    start_pts: z.number().optional(),
    start_time: z.string().optional(),
    duration_ts: z.number().optional(),
    duration: z.string().optional(),
    bit_rate: z.string().optional(),
    nb_frames: z.string().optional(),
    disposition: FfprobeStreamDispositionSchema,
    tags: FfprobeStreamTagsSchema.optional(),
    extradata_size: z.number().optional(),
    ts_id: z.string().optional(),
    ts_packetsize: z.union([z.number(), z.string()]).optional(),
  })
  .strict();

export const FfprobeVideoStreamSchema = FfprobeBaseStreamSchema.extend({
  codec_type: z.literal("video"),
  width: z.number(),
  height: z.number(),
  coded_width: z.number().optional(),
  coded_height: z.number().optional(),
  closed_captions: z.number().optional(),
  film_grain: z.number().optional(),
  has_b_frames: z.number(),
  pix_fmt: z.string().optional(),
  level: z.number(),
  chroma_location: z.string().optional(),
  field_order: z.string().optional(),
  refs: z.number().optional(),
  is_avc: z.string().optional(),
  nal_length_size: z.string().optional(),
  bits_per_raw_sample: z.string().optional(),
  color_range: z.string().optional(),
  color_space: z.string().optional(),
  color_transfer: z.string().optional(),
  color_primaries: z.string().optional(),
  sample_aspect_ratio: z.string().optional(),
  display_aspect_ratio: z.string().optional(),
  side_data_list: z.array(FfprobeVideoSideDataSchema).optional(),
  view_ids_available: z.string().optional(),
  view_pos_available: z.string().optional(),
}).strict();

//ref: https://github.com/FFmpeg/FFmpeg/blob/11d1b71c311d1a1432a280e0e1ee7bc0ba91d671/libavutil/channel_layout.c#L184
export const ZFfprobeAudioStreamChannelLayout = z.enum([
  "mono",
  "stereo",
  "2.1",
  "3.0",
  "3.0(back)",
  "4.0",
  "quad",
  "quad(side)",
  "3.1",
  "5.0",
  "5.0(side)",
  "4.1",
  "5.1",
  "5.1(side)",
  "6.0",
  "6.0(front)",
  "3.1.2",
  "hexagonal",
  "6.1",
  "6.1(back)",
  "6.1(front)",
  "7.0",
  "7.0(front)",
  "7.1",
  "7.1(wide)",
  "7.1(wide-side)",
  "5.1.2",
  "5.1.2(back)",
  "octagonal",
  "cube",
  "5.1.4",
  "7.1.2",
  "7.1.4",
  "7.2.3",
  "9.1.4",
  "9.1.6",
  "hexadecagonal",
  "binaural",
  "downmix",
  "22.2",
]);

export const FfprobeAudioStreamSchema = FfprobeBaseStreamSchema.extend({
  codec_type: z.literal("audio"),
  sample_fmt: z.string(),
  sample_rate: z.string(),
  channels: z.number(),
  channel_layout: ZFfprobeAudioStreamChannelLayout,
  bits_per_sample: z.number(),
  initial_padding: z.number(),
}).strict();

export const FfprobeDataStreamSchema = FfprobeBaseStreamSchema.extend({
  codec_type: z.literal("data"),
}).strict();

export const FfprobeSubtitleStreamSchema = FfprobeBaseStreamSchema.extend({
  codec_type: z.literal("subtitle"),
}).strict();

export const FfprobeUnknownStreamSchema = FfprobeBaseStreamSchema.extend({
  codec_type: z.undefined(),
}).strict();

export const FfprobeStreamSchema = z.discriminatedUnion("codec_type", [
  FfprobeVideoStreamSchema,
  FfprobeAudioStreamSchema,
  FfprobeDataStreamSchema,
  FfprobeSubtitleStreamSchema,
  FfprobeUnknownStreamSchema,
]);

export const FfprobeFormatTagsSchema = z.record(z.string(), z.string());

export const FfprobeFormatSchema = z
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
    start_time: z.string().optional(),
    duration: z.string().optional(),
    bit_rate: z.string().optional(),
  })
  .strict();

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
export type FfprobeVideoStream = z.infer<typeof FfprobeVideoStreamSchema>;
export type FfprobeOutput = z.infer<typeof FfprobeOutputSchema>;
export type FfprobeFormatTags = z.infer<typeof FfprobeFormatTagsSchema>;
export type FfprobeFormat = z.infer<typeof FfprobeFormatSchema>;
