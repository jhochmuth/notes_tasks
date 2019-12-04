const enav = new (require('electron-navigation'))();

enav.newTab('file:///home/julius/notes_tasks/tabs/indexMenuTabs.html', {
  id: "Home",
  close: true,
  node: true,
  readonlyUrl: true,
  icon: '/home/julius/notes_tasks/icons/mainIcon.png',
  title: "Main"
})

enav.listen('Home', function(channel, args, respond) {
  if (channel == 'fromTab') {
    if (args[0][0] == 'newDiagram') {
      enav.newTab('file:///home/julius/notes_tasks/indexApp.html', {
        id: "App",
        close: true,
        node: true,
        readonlyUrl: true,
        icon: '/home/julius/notes_tasks/icons/mainIcon.png',
        title: 'Diagram'
      })

      if (args[0][1]) {
        setTimeout(function() {enav.send('App', 'load', [args[0][1]])}, 1000)
      }
    }
  }
})

/*
const TabGroup = require('electron-tabs');

let tabGroup = new TabGroup();
let tab = tabGroup.addTab({
  title: "Home",
  src: "file:///home/julius/notes_tasks/indexMenu.html",
  visible: true
})
*/
