# これは何？

Three.jsを使ってOpenStreetMapのコミット履歴を積み上げる処理を行なっている。
コードを綺麗にしていない。
Three.jsの文字の浮き出し処理に関する参照系に内包されるリンクでエラーがでているが、英文の処理自体は問題なく行える。


- Web用のDescriptionを作成
- 光沢表現をもっとマイルドにする
- 回転アニメーション

- テーマ:urban(ビル群)、ビルのテクスチャの繰り返しパターンの適用
- 2024-2022年しか対応してないの困るな→暫定的にDOMの中に選択肢を増やした(動的に処理するか、もしくは数字の入力をかけて、バリデーションもどきでさばく)

## 対応

### 高さデータを標準偏差を元に計算して自然な分布として見えるようにする
複雑な計算にせず、高さを対数スケールで表現するようにした

### カラーテーマを綺麗にする
カラーテーマを季節ごとに作成した。
文字部分の色にも干渉する実装にした。
ダミーデータ表示時に文字部分の変更と同期しない不具合を解消できていない。
本来はこれらをjsonでもつようにした方がよい。


# What is this?

It uses Three.js to accumulate OpenStreetMap commit history.
The cord is not cleaned.
An error occurs in the link contained in the reference system for character embossing processing in Three.js, but the processing of English sentences can be done without any problems.


- Create a Description for the Web
- Make the glossy expression even milder
- Rotating animation
- Make your color theme beautiful
- Calculate height data based on standard deviation to make it appear as a natural distribution
- Theme: urban (building group), application of repetitive patterns of building textures