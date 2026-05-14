// クソUI病棟のシナリオ・問題データ
// 先生がテキストを修正しやすいように、データとロジックを分離しています。

const kusoUIData = [
    {
        id: 1,
        title: "第1の罠：ナースコール",
        instruction: "気分が悪くなりました。ナースコールを押して看護師を呼んでください。",
        ui_type: "visual_hierarchy", // 視線誘導
        options: [
            { text: "ナースコール", isCorrect: true, type: "tiny_grey_button" },
            { text: "病院へ寄付する（¥10,000）", isCorrect: false, type: "huge_red_button" },
            { text: "プレミアム個室にアップグレード", isCorrect: false, type: "huge_green_button" }
        ],
        explanation: {
            title: "解説：視線誘導の悪用",
            text: "目立つ色や大きなボタンで、ユーザーが意図しない操作（寄付や課金）へ誘導する手法です。本当に必要な機能（ナースコール）が目立たないのは、情報デザインとして非常に危険です。"
        }
    },
    {
        id: 2,
        title: "第2の罠：主観的すぎるセキュリティ",
        instruction: "「私はロボットではありません」\n画像の中から『休日にゴロゴロしたい気分のネコ』をすべて選択し、確認ボタンを押してください。",
        ui_type: "captcha",
        options: [], // JS側で3x3グリッドを自動生成します
        explanation: {
            title: "解説：主観的すぎるCAPTCHA",
            text: "スパムを防ぐCAPTCHAですが、設問が主観的すぎたり画像が不鮮明すぎると、正規の人間までイライラさせてしまいます。（※正解は「全部」でした。ネコはみんな休日にゴロゴロしたいのです）"
        }
    },
    {
        id: 3,
        title: "第2の罠：治験の同意",
        instruction: "謎の治験プログラムの案内が出ました。同意せずに次へ進んでください。",
        ui_type: "dark_pattern", // ダークパターン
        options: [
            { text: "同意して治験に参加する", isCorrect: false, type: "primary_button" },
            { text: "詳細を読んでから同意する", isCorrect: false, type: "secondary_button" },
            { text: "同意しない", isCorrect: true, type: "hidden_text_link" } // 見えないくらい小さいテキストリンク
        ],
        explanation: {
            title: "解説：ダークパターン",
            text: "ユーザーを騙したり、不利な選択をさせたりするために意図的に設計された悪意あるUIを「ダークパターン」と呼びます。退会やキャンセルのボタンを極端に見つけにくくするのはその典型例です。"
        }
    },
    {
        id: 3,
        title: "第3の罠：電子体温計",
        instruction: "現在の体温が正常か確認したいです。体温計の表示として「正しい（理解できる）」ものを選んでください。",
        ui_type: "mental_model", // メンタルモデル
        options: [
            { text: "36.5℃", isCorrect: true, type: "normal_text" },
            { text: "🟩🟩🟩🟨🟨", isCorrect: false, type: "progress_bar" }, // プログレスバー
            { text: "#FF4500", isCorrect: false, type: "color_code" } // カラーコード
        ],
        explanation: {
            title: "解説：メンタルモデルの不一致",
            text: "人は「体温は数字と℃で表される」というメンタルモデル（頭の中の無意識の前提）を持っています。直感に反する表現を用いると、ユーザーを混乱させ重大な医療事故に繋がります。"
        }
    },
    {
        id: 4,
        title: "最後の罠：退院手続き",
        instruction: "退院の許可が下りました。画面のどこかから退院の手続きを見つけてください。",
        ui_type: "hamburger_menu", // ハンバーガーメニュー
        options: [
            { text: "退院手続き", isCorrect: false, type: "fake_button" }, // 押すと「本当に退院しますか？」ループ
            { text: "☰", isCorrect: true, type: "hamburger_icon" } // これを押すと「集中治療室」が出現してクリア
        ],
        explanation: {
            title: "解説：隠されたナビゲーション",
            text: "ハンバーガーメニュー（三本線）は画面をスッキリさせますが、重要な機能まで隠してしまうとユーザーが迷子になります。見つけやすさ（ファインダビリティ）を考慮した配置が重要です。"
        }
    }
];
