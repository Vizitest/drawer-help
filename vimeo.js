

var iframe = document.querySelector("iframe");
var player = new Vimeo.Player(iframe);
var _chapters
var _videoLength
var _endTime
var _paused

// player.on("play", function () {
//   console.log("Played the video");
// });

player.getVideoTitle().then(function (title) {
  getChapters()
  player.getDuration().then(duration => {
    _videoLength = duration
    _endTime = duration
  })
});

const playVideo = (chapterName) => {
  // Find the chapter
  const chapter = _chapters.find(item => item.title === chapterName)
  if (chapter) {
    // Find the next chapter and calculate the time to pause at
    const nextChapter = _chapters.find(item => item.index === chapter.index + 1)
    if (nextChapter) {
      _endTime = nextChapter.startTime
    }
    else {
      _endTime = _videoLength
    }
    player.setCurrentTime(chapter.startTime)
    player.play()
    _paused = false
    monitorPosition()
  }
}

const getChapters = () => {
  player.getChapters().then(function (chapters) {
    _chapters = chapters
    // console.log(_chapters)
  }).catch(function (error) {
    // An error occurred
  });
}

const monitorPosition = () => {
  player.getPaused().then(result => _paused = result)
  player.getCurrentTime().then(function (time) {
    if (_paused) return
    // console.log('time:', time + " -> " + _endTime);
    if (time >= _endTime) {
      player.pause()
      _paused = false
      _endTime = _videoLength
    }
  })
  setTimeout(monitorPosition, 1000);
}
