/**
 * The vault — an author's cabinet, ordered by the year each thing entered the
 * collection rather than by kind. Not in the nav; reached only from `/about`.
 *
 * That ordering is the whole argument of the page. Sorted by kind it would be
 * a list of favourites, which every site has; sorted by when it arrived, a
 * record and a paper from the same year stand next to each other and the shelf
 * becomes a chronology of what changed the author's mind, and when.
 *
 * `added` is when it reached me, `made` is when the work was made — the two are
 * never the same axis, and the page is built on the first. The note is first
 * person and short on purpose: one line on why it earned a place.
 *
 * Copied from the production blog (`~/MyApps/maxblog/src/lib/vault.ts`), with
 * one fix. There, *On Writing Well* carries the overjustification paper's `id`,
 * a copy-paste slip two entries apart. React only warns about a duplicate key;
 * Svelte's keyed `{#each}` throws, so it is `on_writing_well` here. Worth
 * mending in production too — the two editions are otherwise the same shelf.
 */

/** Kinds, in the order the filter bar prints them. */
export type VaultMedium = 'Books' | 'Music' | 'Papers' | 'Films' | 'Objects' | 'Course' | 'Experience';

export const VAULT_MEDIA: VaultMedium[] = [
	'Books',
	'Music',
	'Papers',
	'Films',
	'Objects',
	'Course',
	'Experience'
];

export interface VaultLocale {
	title?: string;
	by?: string;
	note: string;
}

export interface VaultItem {
	id: string;
	/** Year it entered the collection — the axis the timeline is built on. */
	added: number;
	medium: VaultMedium;
	title: string;
	/** Author, artist, maker. '—' when there is none. */
	by: string;
	/**
	 * When the work was made; a year, or a word like 'ongoing'. Empty or unset
	 * for things that were not "made" — a course, a place, a week away.
	 */
	made?: string;
	/**
	 * Where it happened, for the kinds that have a where rather than a when
	 * (courses, experiences). Shown in place of `made`.
	 */
	place?: string;
	note: string;
	/** Optional cover art, same pipeline as resources (Cloudinary or any URL). */
	coverImage?: string;
	/**
	 * More than one plate — a place photographed three ways, a course with a
	 * syllabus and a room. Rendered as a strip; the first four are shown.
	 */
	coverImages?: string[];
	/** Optional outward link. Makes the whole entry clickable. */
	href?: string;
	vi?: VaultLocale;
}

/**
 * The entry as it should read in `lang`, falling back to English per field —
 * the same contract as `getGlossaryLocale` and `getTopicLocale`.
 *
 * No entry carries a `vi` block today, and that is not an oversight waiting to
 * be fixed: the notes are already written in whichever language the author
 * thought the thought in, and translating a private note would be writing a
 * new one. The field is here for the day a note genuinely needs both.
 */
export function getVaultLocale(item: VaultItem, lang: string): { title: string; by: string; note: string } {
	if (lang === 'vi' && item.vi) {
		return {
			title: item.vi.title ?? item.title,
			by: item.vi.by ?? item.by,
			note: item.vi.note
		};
	}
	return { title: item.title, by: item.by, note: item.note };
}

/**
 * Every plate for an entry, in display order. `coverImages` wins when both are
 * set; a lone `coverImage` is just a strip of one. Capped at four — past that
 * the strip stops being a glance and starts being a gallery.
 */
export function getVaultCovers(item: VaultItem): string[] {
	const all = item.coverImages ?? (item.coverImage ? [item.coverImage] : []);
	return all.slice(0, 4);
}

export const VAULT: VaultItem[] = [
	{
		id: '10 ngay vipassana',
		added: 2026,
		medium: 'Course',
		title: 'Khóa thiền Vipassana 10 ngày',
		by: 'Thiền sư S. N. Goenka',
		made: '',
		note: 'Thiền tĩnh thức, làm sạch tâm trí',
	},
	{
		id: 'leisure_the_basic_of_culture',
		added: 2026,
		medium: 'Books',
		title: 'Leisure - The Basic of Culture',
		by: 'Josef Pieper',
		made: '1998',
		note: 'Tìm hiểu xem thật ra thời gian rảnh rổi có thực sự là lãng phí, hay là một phần tất yếu của văn hóa.',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785076202/maxubrq.space/leisure_the_basic_of_culture_eknreo.jpg',
	},
	{
		id: 'undermining_childrens_intrinsic_interest_with_extrinsic_reward:_a_test_of_the_overjustification_hypothesis.',
		added: 2026,
		medium: 'Papers',
		title:
			"Undermining children's intrinsic interest with extrinsic reward: A test of the 'overjustification' hypothesis.",
		by: 'Lepper, M. R., Greene, D., & Nisbett, R. E',
		made: '1973',
		note: 'Niềm vui nội tại của công việc sẽ bị gán cho phần thưởng ngoại vi khi phần thưởng được kỳ vọng.',
	},
	{
		id: 'hvl',
		added: 2026,
		medium: 'Music',
		title: '[Album] HVL',
		by: 'MCK',
		made: '2026',
		note: 'WoW...Mắt Môi Tay Chân, Nếu Như Ta Chẳng Còn, Xa Xôi',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785075654/maxubrq.space/hvl_mck_zjaj7t.jpg',
	},
	{
		id: 'gap_lai',
		added: 2026,
		medium: 'Music',
		title: '[Album] Gặp Lại',
		by: 'Binz',
		made: '2026',
		note: 'King, Gặp Lại, Nợ',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785076317/maxubrq.space/gap_lai_tbsdok.webp',
	},
	{
		id: 'sans_soleil',
		added: 2026,
		medium: 'Films',
		title: 'Sans Soleil',
		by: 'Chris Marker',
		made: '1983',
		note: 'Một lá thư đặc biệt',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785079385/maxubrq.space/sans_soleil_r8bmp4.jpg',
	},
	{
		id: 'chuyen_tu_te',
		added: 2026,
		medium: 'Films',
		title: 'Chuyện Tử Tế (The Story of Kindness or How to Behave)',
		by: 'Trần Văn Thủy',
		made: '2000',
		note: 'Tử tế là như thế nào?',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785079701/maxubrq.space/chuyen_tu_te_dc6tse.jpg',
	},
	{
		id: 'love_man_love_woman',
		added: 2026,
		medium: 'Films',
		title: 'Love Man Love Woman - Chuyện thày Đức',
		by: 'Nguyễn Trinh Thi',
		made: '2007',
		note: 'Giới đồng tính theo đạo Mẫu',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785080063/maxubrq.space/love_man_love_woman_mcz1gz.jpg',
	},
	{
		id: 'the_gleaners_and_i',
		added: 2026,
		medium: 'Films',
		title: 'The Gleaners and I ',
		by: 'Agnès Varda',
		made: '2000',
		note: 'Những người lượm nhặt',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785079517/maxubrq.space/the_gleaners_and_i_iovxd9.jpg',
	},
	{
		id: 'on_writing_well',
		added: 2026,
		medium: 'Books',
		title: 'On Writing Well',
		by: 'William Zinsser',
		made: '2001',
		note: 'Học để viết tốt hơn.',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785076129/maxubrq.space/on_writing_well_vd05jc.webp',
	},
	{
		id: 'loi_khuan',
		added: 2025,
		medium: 'Music',
		title: '[Album] Lợi Khuẩn',
		by: 'Dfoxie37',
		made: '2025',
		note: 'Cà Phê Phin, Tất Cả Là Một, Hello Em Có Khỏe Không',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785078514/maxubrq.space/loi_khuan_dyhlgj.jpg',
	},
	{
		id: 'giua_mot_van_ngươi',
		added: 2025,
		medium: 'Music',
		title: '[Album] Giữa Một Vạn Người',
		by: 'Phùng Khánh Linh',
		made: '2025',
		note: 'Dream Pop tuyệt vời',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785075426/maxubrq.space/giua_mot_van_nguoi_exorua.webp',
	},
	{
		id: 'toi_thuong',
		added: 2025,
		medium: 'Music',
		title: '[Album] Tối Thượng',
		by: 'The Flob',
		made: '2025',
		note: 'Lầu Lâm Ba, Đại Khải Hoàn',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785076065/maxubrq.space/toi_thuong_er2kln.jpg',
	},
	{
		id: 'film_meet_joe_black',
		added: 2025,
		medium: 'Films',
		title: 'Meet Joe Black',
		by: 'Martin Brest, Brad Pitt, Anthony Hopkins, Claire Forlani',
		made: '1998',
		note: "Love is passion, obsession, someone you can't live without...Claire Folani quá đẹp",
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785081897/maxubrq.space/meet_joe_black_fngfju.jpg',
	},
	{
		id: 'film_zodiac',
		added: 2025,
		medium: 'Films',
		title: 'Zodiac',
		by: 'David Fincher, Jake Gyllenhaal, Robert Downey Jr., Mark Ruffalo',
		made: '2007',
		note: 'Man is the most dangerous animal of all.',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785081771/maxubrq.space/zodiac_q7egb7.jpg',
	},
	{
		id: 'cine_love',
		added: 2024,
		medium: 'Music',
		title: '[Album] CineLove',
		by: 'Phan Mạnh Quỳnh',
		made: '2024',
		note: 'Datanla ôi Datanla',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785075503/maxubrq.space/CineLove_e3tbfh.jpg',
	},
	{
		id: 'silence_film',
		added: 2024,
		medium: 'Films',
		title: 'Silence',
		by: 'Martin Scorsese, Andrew Garfieldm, Adam Driver, Liam Neeson',
		made: '2016',
		note: 'Đức tin có cần hình thức để tồn tại?',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785078772/maxubrq.space/silence_tnmdgb.jpg',
	},
	{
		id: 'troi_danh_tranh_ta_ta_va_trung_nguoi',
		added: 2024,
		medium: 'Music',
		title: '[Album] TRỜI ĐÁNH TRÁNH TA - TA VA TRÚNG NGƯỜI',
		by: 'The Flob',
		made: '2024',
		note: 'Ma Cà Rồng, Bài Cá Sấu, Nhất Bái Thiên Địa',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785075921/maxubrq.space/troi_danh_tranh_ta_tvfsfr.jpg',
	},
	{
		id: 'the_revenant',
		added: 2024,
		medium: 'Films',
		title: 'The Revenant',
		by: 'Alejandro G. Iñárritu, Leonardo DiCaprio, Tom Hardy, Will Poulter',
		made: '2015',
		note: 'Trả thù, con gấu, thiên nhiên khốc liệt, ý chí kiên cường',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785081608/maxubrq.space/the_revenant_d3vkyu.jpg',
	},
	{
		id: 'singing_in_the_rain',
		added: 2024,
		medium: 'Films',
		title: "Singin' In The Rain",
		by: "Stanley Donen, Gene Kelly, Donald O'Connor, Debbie Reynolds",
		made: '1952',
		note: "Good mornin', good mornin'",
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785081200/maxubrq.space/singin_in_the_rain_l66i6x.jpg',
	},
	{
		id: 'the_social_network',
		added: 2024,
		medium: 'Films',
		title: 'The Social Network',
		by: 'David Fincher, Jesse Eisenberg, Andrew Garfield, Justin Timberlake',
		made: '2010',
		note: "You don't get to 500 million friends without making a few enemies.",
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785081366/maxubrq.space/the_social_network_gce6ml.jpg',
	},
	{
		id: 'an',
		added: 2024,
		medium: 'Music',
		title: '[Album] An',
		by: 'Lil Wuyn',
		made: '2024',
		note: 'Tự do, phòng khoáng đan xen với trầm tư',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785075557/maxubrq.space/an_lil_wuyn_adj8ec.webp',
	},
	{
		id: 'in_the_mood_for_love',
		added: 2024,
		medium: 'Films',
		title: 'In The Mood for Love',
		by: 'Wong Kar-wai, Maggie Cheung, Tony Leung Chiu-wai, Ping-Lam Siu',
		made: '2000',
		note: 'Đồng cảm, quyến rũ và đạo đức',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785080779/maxubrq.space/in_the_mood_for_love_q6l1cy.jpg',
	},
	{
		id: 'fallen_angels',
		added: 2023,
		medium: 'Films',
		title: 'Fallen Angels',
		by: 'Wong Kar-wai, Leon Lai, Michelle Reis, Takeshi Kaneshiro',
		made: '1995',
		note: 'Shirley Kwan - Forget Him (忘记他)',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785080458/maxubrq.space/fallen_angels_qwgcwl.jpg',
	},
	{
		id: 'chungking_express',
		added: 2023,
		medium: 'Films',
		title: 'Chungking Express',
		by: 'Wong Kar-wai, Brigitte Lin, Takeshi Kaneshiro, Tony Leung, Chiu-wai',
		made: '1994',
		note: "663, Faye và California Dreamin'",
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785080339/maxubrq.space/chungking_experss_ifqoqg.webp',
	},
	{
		id: 'danh_doi',
		added: 2023,
		medium: 'Music',
		title: '[Album] Đánh Đổi',
		by: 'Obito',
		made: '2023',
		note: 'Young tobi da sick',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785075611/maxubrq.space/danhdoi_obito_vds7so.jpg',
	},
	{
		id: 'prisoners',
		added: 2023,
		medium: 'Films',
		title: 'Prisoners',
		by: 'Denis Villeneuve, Hugh Jackman, Jake Gyllenhaal, Viola Davis',
		made: '2013',
		note: 'Tù nhân ... tù nhân tù nhân',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785079012/maxubrq.space/prisoners_uwij4m.jpg',
	},
	{
		id: 'ai_cung_phai_bat_dau_tu_dau_do',
		added: 2023,
		medium: 'Music',
		title: '[Album] Ai Cũng Phải Bắt Đầu Từ Đâu Đó',
		by: 'HIEUTHUHAI',
		made: '2023',
		note: 'Ai Cũng Phải Bắt Đầu Từ Đâu Đó',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785076459/maxubrq.space/ai_cung_bat_dau_tu_dau_do_jeznxi.webp',
	},
	{
		id: 'demolition',
		added: 2023,
		medium: 'Films',
		title: 'Demolition',
		by: 'Jean-Marc Vallée, Jake Gyllenhaal',
		made: '2015',
		note: 'Người ta có thể đau đớn tới nỗi không cảm nhận được gì nữa',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785077659/maxubrq.space/demolition_r9ewrf.jpg',
	},
	{
		id: '12_angry_men_xmtqyp',
		added: 2023,
		medium: 'Films',
		title: '12 Angry Men',
		by: 'Sidney Lumet',
		made: '1957',
		note: 'Công lý, tình người và trách nhiệm. Đơn giản là một tuyệt tác',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785077798/maxubrq.space/12_angry_men_xmtqyp.jpg',
	},
	{
		id: 'schindlers_list',
		added: 2023,
		medium: 'Films',
		title: "Schindler's List",
		by: 'Steven Spielberg, Liam Neeson',
		made: '1993',
		note: 'Tuyệt vời',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785078065/maxubrq.space/schindler_list_p565dc.jpg',
	},
	{
		id: 'dead_poets_society',
		added: 2022,
		medium: 'Films',
		title: 'Dead Poets Society',
		by: 'Peter Weir, Robin Williams',
		made: '1989',
		note: 'What would your verse be?',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785077129/maxubrq.space/dead_poets_society_po8q6u.jpg',
	},
	{
		id: 'interstellar',
		added: 2022,
		medium: 'Films',
		title: 'Interstellar',
		by: 'Christopher Nolan, Matthew McConaughey, Anne Hathaway, Jessica Chastain',
		made: '2014',
		note: 'You were my ghost',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785079187/maxubrq.space/interstellar_o6agen.jpg',
	},
	{
		id: 'silent_of_the_lambs',
		added: 2022,
		medium: 'Films',
		title: 'The Silence of the Lambs',
		by: 'Jonathan Demme, Anthony Hopkins',
		made: '1991',
		note: '',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785077243/maxubrq.space/the_silents_of_the_lambs_ywoq0j.jpg',
	},
	{
		id: 'eternal_sunshine_of_the_spotless_mind',
		added: 2022,
		medium: 'Films',
		title: 'Eternal Sunshine of the Spotless Mind',
		by: 'Michel Gondry, Jim Carrey, Kate Winslet',
		made: '2004',
		note: 'Dù có mất đi trí nhớ, anh vẫn yêu em...có thể xem chung với người yêu thì hay biết mấy :vvv',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785077445/maxubrq.space/eternal_sunshine_of_the_spotless_mind_c5xoeq.jpg',
	},
	{
		id: 'bullet_train',
		added: 2022,
		medium: 'Films',
		title: 'Bullet Train',
		by: 'David Leitch, Brat Pitt, Aaron Taylor-Johnson',
		made: '2022',
		note: 'Rất giải trí',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785078285/maxubrq.space/bullet_train_jajztf.jpg',
	},
	{
		id: 'seven_films',
		added: 2022,
		medium: 'Films',
		title: 'Se7en',
		by: 'David Fincher, Brat Pitt, Morgan Freeman',
		made: '1995',
		note: 'What in the f*cking box',
		coverImage:
			'https://res.cloudinary.com/dmsb4anlx/image/upload/v1785081042/maxubrq.space/seven_uhfyzx.jpg',
	},
];
