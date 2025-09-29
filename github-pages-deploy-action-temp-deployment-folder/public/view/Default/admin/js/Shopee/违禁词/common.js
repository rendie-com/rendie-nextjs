Object.assign(Tool, {
  header: function (jsFile) {
    let html = '\
        <header class="panel-heading">\
          <div onclick="Tool.main(\'\')"'+ (!jsFile ? ' class="active"' : '') + '>【店小秘】违禁词</div>\
        </header>'
    return html;
  },
})