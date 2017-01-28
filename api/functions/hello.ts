import * as λ from 'apex.js';
import * as SourceMapSupport from 'source-map-support';

SourceMapSupport.install();

export default λ(event => {
  let message;

  if (event.body.match(/駐車場/)) {
    message = '愛知県豊田市トヨタ町1番地に空きがあります。';
  } else if (event.body.match(/予約/)) {
    message = '車種はプリウスでよろしいですか？';
  } else if (event.body.match(/はい/)) {
    message = '予約完了しました。';
  } else if (event.body.match(/いいえ/)) {
    message = '車種はヴォクシーでよろしいですか？';
  } else {
    message = 'ちょっと何言ってるかわかんないっすね';
  }

  return {
    statusCode: 200,
    body:       JSON.stringify({message}),

    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
});
