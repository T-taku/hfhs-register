interface Product {
    id: string;
    name: string;
    price: number;
}

interface ProductsByClass {
    [registerType: string]: Product[];
}

const productsByClass: ProductsByClass = {
    "2年1組": [
        { id: "1", name: '3発', price:100 },
        { id: "2", name: '7発', price:200 },
        { id: "_1", name: '※3発', price:50 },
        { id: "_2", name: '※7発', price:150 },
    ],
    "2年2組": [
        { id: "1", name: '焼き鳥', price:100 },
        { id: "_1", name: '※焼き鳥', price:80 },
    ],
    "2年3組": [
        { id: "1", name: '焼き鳥', price:100 },
    ],
    "2年4組": [
        { id: "1", name: 'シャーベット１個', price:200 },
        { id: "2", name: 'シャーベット２個', price:300 },
        { id: "_1", name: '※シャーベット１個', price:180 },
        { id: "_2", name: '※シャーベット２個', price:280 },
    ],
    "2年5組": [
        { id: "1", name: '焼き鳥', price:100 },
    ],
    "2年6組": [
        { id: "1", name: 'マフィン', price:150 },
    ],
    "2年7組": [
        { id: "1", name: 'トッピング１種', price:250 },
        { id: "2", name: 'トッピング２種', price:250 },
        { id: "_1", name: '※トッピング１種', price:200 },
        { id: "_2", name: '※トッピング２種', price:200 },
    ],
    "2年8組": [
        { id: "1", name: 'バニラ', price:250 },
        { id: "2", name: 'チョコ', price:250 },
        { id: "3", name: 'ダブル', price:250},
        { id: "4", name: 'いちご', price:250},
        { id: "4", name: 'トッピング',price:50 },
        { id: "_1", name: '※バニラ', price:200 },
        { id: "_2", name: '※チョコ', price:200 },
    ],
    "2年9組": [
        { id: "1", name: 'チョコdeワッフル', price:250},
        { id: "_1", name: '※チョコdeワッフル', price:200 },
    ],
    "2年10組": [
        { id: "1", name: 'ドーナツ串', price:150 },
    ],
    "2年11組": [
        { id: "1", name: 'チョコワッフッル', price:200 },
        { id: "2", name: '苺ジャムワッフル', price:200 },
        { id: "3", name: '抹茶ワッフル', price:200 },
    ],
    "2年12組": [
        { id: "1", name: 'みたらし団子', price:150 },
        { id: "2", name: 'きなこ団子', price:150 },
        { id: "_1", name: '※みたらし団子', price:100 },
        { id: "_2", name: '※きなこ団子', price:100 },
    ],
    "2年13組": [
        { id: "1", name: 'フローズンサイダー', price:150 },
        { id: "_1", name: '※フローズンサイダー', price:120 },
    ],
    "2年14組": [
        { id: "1", name: 'チュロス', price:250 },
        { id: "_1", name: '※チュロス', price:200 },
    ],
    "2年15組": [
        { id: "1", name: 'レインボーわた飴', price:300 },
        { id: "2", name: 'わたカップ', price:250 },
    ],
    "2年A組": [
        { id: "1", name: 'フルーツポンチサイダー', price:400 },
        { id: "2", name: 'アップルパイ１個', price:300 },
        { id: "3", name: 'アップルパイ２個', price:400 },
        { id: "_1", name: '※フルーツポンチサイダー', price:350 },
        { id: "_2", name: '※アップルパイ１個', price:250 },
    ],
    "2年B組": [
        { id: "1", name: 'メロンパンアイス', price:350 },
        { id: "_1", name: '※値引き①', price:300 },
    ],
    "2年C組": [
        { id: "1", name: 'みたらし団子', price:150 },
        { id: "2", name: 'きなこ団子', price:150 },
        { id: "3", name: 'こしあん団子', price:150 },
        { id: "4", name: 'ぜんざい温', price:500 },
        { id: "5", name: 'ぜんざい冷', price:500 },
        { id: "_1", name: '※みたらし団子', price:100 },
        { id: "_2", name: '※きなこ団子', price:100 },
        { id: "_3", name: '※こしあん団子', price:100 },
    ],
    "3年1組": [
        { id: "1", name: 'わたあめ', price:200 },
        { id: "_1", name: '※わたあめ', price:100 },
    ],
    "3年2組": [
        { id: "1", name: 'タピオカ(M)', price:300 },
        { id: "2", name: 'タピオカ(S)', price:200 },
        { id: "3", name: 'チョコバナナ', price:250 },
    ],
    "3年3組": [
        { id: "1", name: '焼きそば', price:250 },
        { id: "_1", name: '※焼きそば', price:200 },
    ],
    "3年4組": [
        { id: "1", name: 'かき氷', price:200 },
        { id: "2", name: '練乳入り', price:250 },
    ],
    "3年5組": [
        { id: "1", name: 'むっちゃん万十', price:300 },
    ],
    "3年6組": [
        { id: "1", name: '輪切りパイン', price:200 },
        { id: "2", name: '冷凍フルーツ', price:400 },
        { id: "_1", name: '※輪切りパイン', price:100 },
        { id: "_2", name: '※冷凍フルーツ', price:300 },
        { id: "_3", name: '※半額冷凍フルーツ', price:200},
    ],
    "3年7組": [
        { id: "1", name: 'ホットドッグ', price:200 },
        { id: "_1", name: '※ホットドッグ', price:100 },
    ],
    "3年8組": [
        { id: "1", name: '台湾カステラ', price:250 },
        { id: "2", name: 'トッピング', price:50 },
        { id: "3", name: 'チェキ', price:200 },
    ],
    "3年9組": [
        { id: "1", name: 'わたあめ１色', price:200 },
        { id: "2", name: 'わたあめ２色', price:300 },
        { id: "_1", name: '※わたあめ２色', price:200 },
    ],
    "3年10組": [
        { id: "1", name: 'ワッフル', price:280 },
        { id: "2", name: 'プレーンワッフル', price:250 },
        { id: "3", name: 'チュロス', price:200 },
        { id: "4", name: '○○×○○ワッフル', price:300 },
    ],
    "3年11組": [
        { id: "1", name: 'フランクフルト', price:200 },
        { id: "_1", name: '※フランクフルト', price:150 },
    ],
    "3年12組": [
        { id: "1", name: 'フルーツ飴', price:150 },
        { id: "_1", name: '※フルーツ飴', price:120 },
    ],
    "3年13組": [
        { id: "1", name: 'チュロス', price:200 },
        { id: "_1", name: '※チュロス', price:100 },
    ],
    "3年14組": [
        { id: "1", name: 'キャラメルポップコーン', price:200 },
    ],
    "3年15組": [
        { id: "1", name: 'チョコバナナ１本', price:350 },
        { id: "2", name: 'チョコバナナ輪切り', price:250 },
        { id: "3", name: '缶ジュース', price:150},
        { id: "4", name: 'マシュマロ', price:200},
        { id: "_1", name: '※チョコバナナ１本', price:300 },
        { id: "_2", name: '※チョコバナナ輪切り', price:200 },
        { id: "_3", name: '※缶ジュース', price:100},
        { id: "_4", name: '※マシュマロ', price:200},
    ],
    "3年16組": [
        { id: "1", name: 'チーズハットグ', price:500 },
        { id: "2", name: 'レインボー', price:600 },
    ],
    "3年17組": [
        { id: "1", name: 'ハンバーガー', price:300 },
        { id: "2", name: 'ドリンク', price:150 },
        { id: "3", name: '6段ハンバーガー', price:1000 },
        { id: "_1", name: '※ハンバーガー', price:250 },
        { id: "_2", name: '※※ハンバーガー', price:230 },
        { id: "_3", name: '※ドリンク', price:120},
    ],
    "3年A組": [
        { id: "1", name: 'たこせん', price:200 },
        { id: "_1", name: '※たこせん', price:150 },
    ],
    "3年B組": [
        { id: "1", name: 'アイス天ぷら１つ', price:200 },
        { id: "2", name: 'アイス天ぷら２つ', price:300 },
        { id: "_1", name: '※アイス天ぷら１つ', price:150 },
        { id: "_2", name: '※アイス天ぷら２つ', price:250 },
    ],
    "ソフトテニス部": [
        { id: "1", name: 'バニラ', price:350 },
        { id: "2", name: 'チョップドチョコレート', price:350 },
        { id: "3", name: 'ストロベリー', price:350 },
        { id: "4", name: 'オレンジソルベ', price:350 },
        { id: "5", name: 'キャラメルリボン', price:350 },
        { id: "_1", name: 'バニラ', price:320 },
        { id: "_2", name: 'チョップドチョコレート', price:320 },
        { id: "_3", name: 'ストロベリー', price:320 },
        { id: "_4", name: 'オレンジソルベ', price:320 },
        { id: "_5", name: 'キャラメルリボン', price:320 },
    ],
    "情報メディアセンター": [
        { id: "1", name: '１冊', price:100 },
        { id: "2", name: '５冊', price:500 },
        { id: "3", name: '10冊', price:1000 },
    ],
}

export default productsByClass;
export type { Product };