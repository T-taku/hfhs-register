interface Product {
  id: string;
  name: string;
  price: number;
}

interface ProductsByClass {
  [registerType: string]: Product[];
}

const productsByClass: ProductsByClass = {
  "1年1組": [
    { id: "1", name: '入場料', price: 100 },
  ],
  "1年7組": [
    { id: "1", name: 'くじ引き', price: 1000 },
    { id: "2", name: 'くじ引き', price: 300 },
    { id: "3", name: '写真スポット', price: 100 },
  ],
  "1年11組": [
    { id: "1", name: '入場料', price: 100 },
  ],
  "1年12組": [
    { id: "1", name: '入場料', price: 200 },
  ],
  "1年13組": [
    { id: "1", name: '入場料', price: 100 },
  ],
  "1年14組": [
    { id: "1", name: '射的', price: 200 },
    { id: "2", name: 'スーパーボールすくい', price: 200 },
    { id: "3", name: 'くじ引き', price: 200 },
  ],
  "1年15組": [
    { id: "1", name: 'プレイ料', price: 200 },
  ],
  "1年16組": [
    { id: "1", name: '3回', price: 300 },
    { id: "_1", name: '3回', price: 250 },
  ],
  "1年AB組": [
    { id: "1", name: '輪5本', price: 100 },
    { id: "2", name: '輪12本', price: 200 },
  ],
  "1年B組": [
    { id: "1", name: '輪5本', price: 100 },
    { id: "2", name: '輪12本', price: 200 },
  ],
  "2年1組": [
    { id: "1", name: 'ラムネ', price: 150 },
    { id: "_1", name: '※ラムネ', price: 100 },
    { id: "2", name: 'フロート', price: 300 },
    { id: "_2", name: '※フロート', price: 200 },
  ],
  "2年2組": [
    { id: "1", name: 'タピオカ', price: 350 },
    { id: "_1", name: '※タピオカ', price: 200 },
    { id: "2", name: 'コーヒー', price: 200 },
    { id: "_2", name: '※コーヒー', price: 100 },
  ],
  "2年3組": [
    { id: "1", name: 'ジュース', price: 100 },
    { id: "2", name: 'マフィン', price: 150 },
    { id: "3", name: 'マフィン(デコ)', price: 200 },
    { id: "_3", name: '※マフィン(デコ)', price: 150 },
  ],
  "2年4組": [
    { id: "1", name: 'ワッフル', price: 300 },
    { id: "_1", name: '※ワッフル', price: 200 },
    { id: "2", name: 'トッピング', price: 400 },
    { id: "_2", name: '※トッピング', price: 300 },
  ],
  "2年5組": [
    { id: "1", name: 'レインボー', price: 300 },
    { id: "3", name: 'クッキー&クリーム', price: 300 },
    { id: "3", name: 'ハニーコットンキャンディー', price: 300 },
  ],
  "2年6組": [
    { id: "1", name: 'かき氷', price: 300 },
    { id: "2", name: '練乳追加', price: 100 },
  ],
  "2年7組": [
    { id: "1", name: 'かき氷いちご', price: 300 },
    { id: "2", name: 'かき氷コーラ', price: 300 },
    { id: "3", name: 'かき氷抹茶', price: 400 },
  ],
  "2年8組": [
    { id: "1", name: 'ワッフル', price: 150 },
    { id: "_1", name: '※ワッフル', price: 100 },
    { id: "2", name: 'ジュース', price: 150 },
    { id: "_2", name: '※ジュース', price: 100 },
  ],
  "2年9組": [
    { id: "1", name: '焼きそば', price: 400 },
    { id: "_1", name: '※焼きそば', price: 300 },
  ],
  "2年10組": [
    { id: "1", name: 'フランクフルト(チーズ)', price: 250 },
    { id: "2", name: 'フランクフルト(ソース)', price: 300 },
  ],
  "2年11組": [
    { id: "1", name: 'ホットドッグ', price: 500 },
    { id: "_1", name: '※ホットドッグ', price: 300 },
    { id: "2", name: 'ジュース', price: 150 },
    { id: "_2", name: '※ジュース', price: 100 },
    { id: "3", name: 'セット', price: 450 },
  ],
  "2年12組": [
    { id: "1", name: 'かき氷', price: 200 },
    { id: "_1", name: '※かき氷', price: 150 },
    { id: "2", name: 'ジュース', price: 150 },
    { id: "_2", name: '※ジュース', price: 100 },
  ],
  "2年13組": [
    { id: "1", name: '焼きそば', price: 300 },
    { id: "2", name: 'ドリンク', price: 100 },
  ],
  "2年14組": [
    { id: "1", name: 'マシュマロ', price: 200 },
  ],
  "2年15組": [
    { id: "1", name: 'ミニクロドット', price: 300 },
    { id: "2", name: 'ジュースドット', price: 400 },
  ],
  "2年16組": [
    { id: "1", name: 'バーガー', price: 300 },
    { id: "_1", name: '※バーガー', price: 250 },
    { id: "2", name: 'バーガー(チーズ追加)', price: 350 },
    { id: "_2", name: '※バーガー(チーズ追加)', price: 300 },
    { id: "3", name: 'ジュース', price: 150 },
    { id: "_3", name: '※ジュース', price: 100 },
    { id: "4", name: 'フロート', price: 300 },
    { id: "_4", name: '※フロート', price: 250 },
  ],
  "2年A組": [
    { id: "1", name: 'たこせん', price: 200 },
    { id: "2", name: 'たこせん(2個)', price: 300 },
    { id: "_1", name: 'たこせん', price: 100 },
  ],
  "2年B組": [
    { id: "1", name: 'フランクフルト', price: 300 },
    { id: "_1", name: '※フランクフルト', price: 250 },
  ],
  "3年1組": [
    { id: "1", name: 'ワッフルアイス', price: 300 },
    { id: "_1", name: '※ワッフルアイス', price: 200 },
  ],
  "3年2組": [
    { id: "1", name: 'むっちゃん万十', price: 350 },
  ],
  "3年3組": [
    { id: "1", name: '焼き鳥', price: 150 },
    { id: "_1", name: '※焼き鳥', price: 100 },
    { id: "2", name: 'ジュース', price: 130 },
  ],
  "3年4組": [
    { id: "1", name: 'シャーベット', price: 200 },
    { id: "_1", name: '※シャーベット', price: 150 },
    { id: "2", name: 'シャーベット(2個)', price: 300 },
    { id: "_2", name: '※シャーベット(2個)', price: 250 },
  ],
  "3年5組": [
    { id: "1", name: '焼き鳥', price: 100 },
  ],
  "3年6組": [
    { id: "1", name: 'たこ焼き(6個)', price: 300 },
  ],
  "3年7組": [
    { id: "1", name: 'ホットドッグ', price: 300 },
    { id: "_1", name: '※ホットドッグ', price: 250 },
  ],
  "3年8組": [
    { id: "1", name: '雪見だいふく(1個)', price: 100 },
    { id: "_1", name: '※雪見だいふく(1個)', price: 100 },
    { id: "2", name: '雪見だいふく(2個)', price: 200 },
    { id: "_2", name: '※雪見だいふく(2個)', price: 150 },
  ],
  "3年9組": [
    { id: "1", name: 'たい焼き', price: 250 },
    { id: "_1", name: '※たい焼き', price: 200 },
  ],
  "3年10組": [
    { id: "1", name: 'めんたいじゃがバター', price: 350 },
  ],
  "3年11組": [
    { id: "1", name: 'ゼリーソーダ', price: 250 },
    { id: "_1", name: '※ゼリーソーダ', price: 100 },
  ],
  "3年12組": [
    { id: "1", name: '団子単品', price: 200 },
    { id: "_1", name: '※団子単品', price: 170 },
    { id: "2", name: 'セットA', price: 350 },
    { id: "_2", name: '※セットA', price: 320 },
    { id: "3", name: 'セットB', price: 500 },
    { id: "_3", name: '※セットB', price: 450 },
    { id: "4", name: 'セットC', price: 600 },
    { id: "_4", name: '※セットC', price: 550 },
    { id: "5", name: '追加団子', price: 150 },
    { id: "_5", name: '※追加団子', price: 130 },
    { id: "6", name: 'ドリンク', price: 120 },
  ],
  "3年13組": [
    { id: "1", name: 'たこせん(1個)', price: 100 },
    { id: "2", name: 'たこせん(2個)', price: 150 },
    { id: "3", name: 'たこせん(3個)', price: 200 },
    { id: "_3", name: '※たこせん(3個)', price: 150 },
    { id: "4", name: 'かい煎餅トッピング', price: 50 },
  ],
  "3年14組": [
    { id: "1", name: '焼き鳥(1本)', price: 100 },
    { id: "2", name: '焼き鳥(3本)', price: 250 },
  ],
  "3年15組": [
    { id: "1", name: 'ドリンク', price: 200 },
    { id: "_1", name: '※ドリンク', price: 150 },
  ],
  "3年A組": [
    { id: "1", name: 'イカゲソ唐揚げ', price: 400 },
    { id: "2", name: 'ドリンク', price: 100 },
  ],
  "3年B組": [
    { id: "1", name: '綿菓子', price: 300 },
    { id: "_1", name: '※綿菓子', price: 250 },
  ],
  "3年C組": [
    { id: "1", name: 'ポテト', price: 400 },
    { id: "_1", name: '※ポテト', price: 300 },
    { id: "2", name: 'ドリンク', price: 200 },
    { id: "_2", name: '※ドリンク', price: 100 },
    { id: "3", name: 'セット', price: 500 },
  ],
  "ソフトテニス部": [
    { id: "1", name: 'アイス', price: 350 },
  ],
  "ESC": [
    { id: "1", name: 'ドリンク', price: 150 },
    { id: "2", name: 'チェキ', price: 300 },
    { id: "_1", name: 'ドリンク(英語注文)', price: 130 },
    { id: "_2", name: 'ドリンク(¥100)', price: 100 },
    { id: "_3", name: 'ドリンク(¥50)', price: 50 },
    { id: "_4", name: 'ドリンク(¥0)', price: 0 },
  ],
  "情報メディアセンター": [
    { id: "1", name: '１冊', price: 100 },
    { id: "2", name: '５冊', price: 500 },
    { id: "3", name: '10冊', price: 1000 },
  ],
}

export default productsByClass;
export type { Product };