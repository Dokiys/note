function eachWithIdx(iterable, f) {
    var i = iterable.iterator();
    var idx = 0;
    while (i.hasNext()) f(i.next(), idx++);
}

function mapEach(iterable, f) {
    var vs = [];
    eachWithIdx(iterable, function (i) {
        vs.push(f(i));
    });
    return vs;
}

function escape(str) {
    str = str.replaceAll("\t|\b|\\f", "");
    str = com.intellij.openapi.util.text.StringUtil.escapeXml(str);
    str = str.replaceAll("\\r|\\n|\\r\\n", "<br/>");
    return str;
}

var NEWLINE = "\n",
    ARROW = ": ",
    QUOTE = "'",
    ARR = '- ',
    IDENT = "  ";


function quoted(val) {
    return QUOTE + val + QUOTE;
}

function output() {
    for (var i = 0; i < arguments.length; i++) {
        OUT.append(arguments[i]);
    }
}

eachWithIdx(ROWS, function (row, i) {
    output(ARR)
    var start = true;
    mapEach(COLUMNS, function (col) {
        var it = start ? "" : IDENT;
        start = false;
        var isStringLiteral = col != null && FORMATTER.isStringLiteral(row, col)
        // var val = isStringLiteral ? quoted(escape(FORMATTER.format(row, col))) : escape(FORMATTER.format(row, col));
        var val = isStringLiteral ? quoted(FORMATTER.format(row, col)) : FORMATTER.format(row, col);
        output(it, col.name(), ARROW, val, NEWLINE);
    });
});
