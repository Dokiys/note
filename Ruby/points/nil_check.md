# empty？blank？nil？present？

表格内容摘自[《empty？blank？nil？傻傻分不清楚》](http://sibevin.github.io/posts/2014-11-11-103928-rails-empty-vs-blank-vs-nil)

| Method      | nil?    | if()    | empty?                | any?            | blank?     | present=!blank? |
| ----------- | ------- | ------- | --------------------- | --------------- | ---------- | --------------- |
| Scope       | ruby    |         |                       |                 | rails only |                 |
| `Object`    | `all`   |         | `String, Array, Hash` | `Enumerable`    | `all`      |                 |
| `nil`       | `true`  | `false` | `NoMethodError`       | `NoMethodError` | `true`     | `false`         |
| `false`     | `false` | `false` | `NoMethodError`       | `NoMethodError` | `true`     | `false`         |
| `true`      | `false` | `true`  | `NoMethodError`       | `NoMethodError` | `false`    | `true`          |
| `0`         | `false` | `true`  | `NoMethodError`       | `NoMethodError` | `false`    | `true`          |
| `1`         | `false` | `true`  | `NoMethodError`       | `NoMethodError` | `false`    | `true`          |
| `""`        | `false` | `true`  | `true`                | `NoMethodError` | `true`     | `false`         |
| `" "`       | `false` | `true`  | `false`               | `NoMethodError` | `true`     | `false`         |
| `[]`        | `false` | `true`  | `true`                | `false`         | `true`     | `false`         |
| `[nil]`     | `false` | `true`  | `false`               | `false`         | `false`    | `true`          |
| `{}`        | `false` | `true`  | `true`                | `false`         | `true`     | `false`         |
| `{ a:nil }` | `false` | `true`  | `false`               | `true`          | `false`    | `true`          |
| `[[],[]]`   | `false` | `true`  | `false`               | `true`          | `false`    | `true`          |

