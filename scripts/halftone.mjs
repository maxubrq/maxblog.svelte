#!/usr/bin/env node
/**
 * Halftone 1-bit — THEME_MANIFESTO §2.
 *
 * Đổi một ảnh PNG thành lưới chấm một bit, xoay 45° như bản kẽm in offset thật:
 * mỗi ô lưới có đúng một chấm, bán kính chấm tỉ lệ với độ tối của ô. Không có
 * mức xám trung gian nào sống sót — đó là điểm của ràng buộc.
 *
 * Chạy một lần lúc chuẩn bị asset, KHÔNG chạy lúc build. Kết quả commit thẳng
 * vào `static/media/`, nên Vercel không cần thư viện ảnh nào và trang prerender
 * ra HTML tĩnh có sẵn ảnh.
 *
 *   node scripts/halftone.mjs vào.png ra.png [--pitch 9] [--scale 3]
 *                                            [--gamma 1.0] [--contrast 1.0]
 *
 * Chỉ dùng `node:zlib`, không phụ thuộc gói ngoài. Đầu vào phải là PNG 8-bit
 * RGB/RGBA/xám, không interlace (`sips -s format png` trên macOS, `magick`
 * hoặc bất kỳ trình xuất nào khác đều ra đúng dạng này).
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { deflateSync, inflateSync } from 'node:zlib';

/* ── PNG vào ────────────────────────────────────────────────────────────── */

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** Trả về { width, height, lum } với `lum` là mảng độ sáng 0..1, một ô mỗi pixel. */
function decodePng(buf) {
	if (!buf.subarray(0, 8).equals(PNG_MAGIC)) throw new Error('Không phải file PNG.');

	let ihdr = null;
	const idat = [];
	let off = 8;
	while (off < buf.length) {
		const len = buf.readUInt32BE(off);
		const type = buf.toString('ascii', off + 4, off + 8);
		const data = buf.subarray(off + 8, off + 8 + len);
		if (type === 'IHDR') {
			ihdr = {
				width: data.readUInt32BE(0),
				height: data.readUInt32BE(4),
				depth: data[8],
				colorType: data[9],
				interlace: data[12]
			};
		} else if (type === 'IDAT') idat.push(data);
		else if (type === 'IEND') break;
		off += 12 + len;
	}
	if (!ihdr) throw new Error('PNG thiếu chunk IHDR.');
	if (ihdr.depth !== 8) throw new Error(`Chỉ đọc được PNG 8-bit, file này ${ihdr.depth}-bit.`);
	if (ihdr.interlace !== 0) throw new Error('Không đọc được PNG interlace (Adam7).');

	// colorType: 0 xám, 2 RGB, 4 xám+alpha, 6 RGBA. 3 (palette) không hỗ trợ.
	const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[ihdr.colorType];
	if (!channels) throw new Error(`Không hỗ trợ colorType ${ihdr.colorType} (palette?).`);

	const { width, height } = ihdr;
	const raw = inflateSync(Buffer.concat(idat));
	const stride = width * channels;
	const px = Buffer.alloc(height * stride);

	// Bỏ filter từng dòng — PNG lưu hiệu số so với pixel trái/trên, không lưu giá trị thật.
	for (let y = 0; y < height; y++) {
		const filter = raw[y * (stride + 1)];
		const src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
		const cur = px.subarray(y * stride, (y + 1) * stride);
		const prev = y > 0 ? px.subarray((y - 1) * stride, y * stride) : null;
		for (let i = 0; i < stride; i++) {
			const a = i >= channels ? cur[i - channels] : 0;
			const b = prev ? prev[i] : 0;
			const c = prev && i >= channels ? prev[i - channels] : 0;
			let v = src[i];
			if (filter === 1) v += a;
			else if (filter === 2) v += b;
			else if (filter === 3) v += (a + b) >> 1;
			else if (filter === 4) {
				const p = a + b - c;
				const pa = Math.abs(p - a),
					pb = Math.abs(p - b),
					pc = Math.abs(p - c);
				v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
			} else if (filter !== 0) throw new Error(`Filter PNG lạ: ${filter}`);
			cur[i] = v & 0xff;
		}
	}

	const lum = new Float32Array(width * height);
	for (let i = 0; i < width * height; i++) {
		const o = i * channels;
		const y =
			channels >= 3
				? // Rec. 709 — mắt người nhạy với lục hơn lam gấp nhiều lần.
					0.2126 * px[o] + 0.7152 * px[o + 1] + 0.0722 * px[o + 2]
				: px[o];
		lum[i] = y / 255;
	}
	return { width, height, lum };
}

/* ── PNG ra: xám 1-bit ──────────────────────────────────────────────────── */

const CRC_TABLE = (() => {
	const t = new Int32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		t[n] = c;
	}
	return t;
})();

function crc32(buf) {
	let c = -1;
	for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
	return (c ^ -1) >>> 0;
}

function chunk(type, data) {
	const head = Buffer.alloc(8);
	head.writeUInt32BE(data.length, 0);
	head.write(type, 4, 'ascii');
	const crc = Buffer.alloc(4);
	crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
	return Buffer.concat([head, data, crc]);
}

/** `bits` là Uint8Array 1 byte/pixel, giá trị 0 (mực) hoặc 1 (giấy). */
function encodePng1Bit(width, height, bits) {
	const stride = Math.ceil(width / 8);
	const raw = Buffer.alloc(height * (stride + 1));
	for (let y = 0; y < height; y++) {
		const row = y * (stride + 1);
		raw[row] = 0; // filter None — ảnh 1-bit đã rất dễ nén, filter chỉ làm rối
		for (let x = 0; x < width; x++) {
			if (bits[y * width + x]) raw[row + 1 + (x >> 3)] |= 0x80 >> (x & 7);
		}
	}
	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(width, 0);
	ihdr.writeUInt32BE(height, 4);
	ihdr[8] = 1; // bit depth
	ihdr[9] = 0; // color type: greyscale
	return Buffer.concat([
		PNG_MAGIC,
		chunk('IHDR', ihdr),
		chunk('IDAT', deflateSync(raw, { level: 9 })),
		chunk('IEND', Buffer.alloc(0))
	]);
}

/* ── Lưới chấm ──────────────────────────────────────────────────────────── */

const ANGLE = (45 * Math.PI) / 180; // Góc kinh điển cho bản đen đơn sắc.
const COS = Math.cos(ANGLE);
const SIN = Math.sin(ANGLE);

function halftone({ width, height, lum }, { pitch, scale, gamma, contrast }) {
	const outW = Math.round(width * scale);
	const outH = Math.round(height * scale);
	const p = pitch; // bước lưới, tính bằng pixel ĐẦU RA
	const bits = new Uint8Array(outW * outH).fill(1); // 1 = giấy

	// Độ sáng trung bình của một ô lưới, đọc ở toạ độ ảnh gốc.
	const sample = (ox, oy) => {
		const x = Math.min(width - 1, Math.max(0, Math.round(ox / scale)));
		const y = Math.min(height - 1, Math.max(0, Math.round(oy / scale)));
		let v = lum[y * width + x];
		v = Math.pow(v, gamma);
		v = Math.min(1, Math.max(0, (v - 0.5) * contrast + 0.5));
		return v;
	};

	// Chấm phủ kín ô khi đen tuyệt đối: bán kính = nửa đường chéo ô.
	const rMax = (p / 2) * Math.SQRT2;

	for (let oy = 0; oy < outH; oy++) {
		for (let ox = 0; ox < outW; ox++) {
			// Vào hệ toạ độ đã xoay 45° để lưới nghiêng, rồi tìm ô chứa điểm này.
			const u = ox * COS + oy * SIN;
			const v = -ox * SIN + oy * COS;
			const cu = (Math.floor(u / p) + 0.5) * p;
			const cv = (Math.floor(v / p) + 0.5) * p;
			// Tâm ô, quay ngược về hệ ảnh, để lấy mẫu độ sáng.
			const cx = cu * COS - cv * SIN;
			const cy = cu * SIN + cv * COS;
			const r = rMax * Math.sqrt(1 - sample(cx, cy));
			const du = u - cu;
			const dv = v - cv;
			if (du * du + dv * dv <= r * r) bits[oy * outW + ox] = 0;
		}
	}
	return { outW, outH, bits };
}

/* ── CLI ────────────────────────────────────────────────────────────────── */

const [, , input, output, ...rest] = process.argv;
if (!input || !output) {
	console.error(
		'dùng: node scripts/halftone.mjs vào.png ra.png [--pitch 9] [--scale 3] [--gamma 1] [--contrast 1]'
	);
	process.exit(1);
}

const opt = { pitch: 9, scale: 3, gamma: 1, contrast: 1 };
for (let i = 0; i < rest.length; i += 2) {
	const key = rest[i].replace(/^--/, '');
	if (!(key in opt)) throw new Error(`Tham số lạ: ${rest[i]}`);
	opt[key] = Number(rest[i + 1]);
}

const src = decodePng(readFileSync(input));
const { outW, outH, bits } = halftone(src, opt);
const png = encodePng1Bit(outW, outH, bits);
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, png);

const ink = bits.reduce((n, b) => n + (b ? 0 : 1), 0);
console.log(
	`${input} ${src.width}×${src.height} → ${output} ${outW}×${outH} 1-bit` +
		`  ·  ${(png.length / 1024).toFixed(1)} KB  ·  phủ mực ${((ink / bits.length) * 100).toFixed(1)}%`
);
