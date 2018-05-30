function getContext() {

  const canvas = $('canvas')[0];
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  return {
    canvas: canvas,
    context: canvas.getContext('2d')
  }
}

function Bubbles() {

  $('canvas').css({background: '#731627'})

  let stop = false

  let obj = getContext()
  const canvas = obj.canvas
  const c = obj.context

  const RADIUS = 2
  const MAX_RADIUS_FACTOR = 8
  const RADIUS_DECREASE_FACTOR = .2
  const RADIUS_INCREASE_FACTOR = 1
  const N = (canvas.width / RADIUS) * 3
  const DX_FACTOR = 2
  const DY_FACTOR = 2
  const DISTANCE = 60
  const COLORS = [
    '#0B438C', '#F2AE30', '#D98014', '#8C3503'
  ]

  function Circle(x, y, dx, dy, radius, color) {
    this.color = color
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.radius = radius
    this.minRadius = radius
    this.maxRadius = radius * MAX_RADIUS_FACTOR

    this.draw = function () {
      c.beginPath()
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      c.fillStyle = this.color.fill
      c.strokeStyle = this.color.stroke
      c.fill()
      c.stroke()
    }

    this.update = function (mouse) {

      if (Math.abs(this.y - mouse.y) < DISTANCE &&
        Math.abs(this.x - mouse.x) < DISTANCE) {
        if (this.radius < this.maxRadius) this.radius += RADIUS_INCREASE_FACTOR
      } else if (this.radius > this.minRadius)
        this.radius -= RADIUS_DECREASE_FACTOR

      if ((this.x + RADIUS > canvas.width) || (this.x - RADIUS < 0))
        this.dx = -this.dx
      if ((this.y + RADIUS > canvas.height) || (this.y - RADIUS < 0))
        this.dy = -this.dy

      this.x += this.dx
      this.y += this.dy
    }
  }

  let mouse = {
    x: 0, y: 0
  }

  window.addEventListener('mousemove', function (event) {
    mouse.x = event.x
    mouse.y = event.y
  })

  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    init()
  })

  let circles = []

  function animate() {
    if (!stop) requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    circles.forEach(function (circle) {
      circle.draw()
      circle.update(mouse)
    })
  }

  function init() {
    circles = []
    for (let i = 0; i < N; i++) {
      let x = Math.random() * canvas.width
      let y = Math.random() * canvas.height
      circles.push(new Circle(
        x < RADIUS ? RADIUS : x > canvas.width - RADIUS ? canvas.width - RADIUS : x,
        y < RADIUS ? RADIUS : y > canvas.height - RADIUS ? canvas.height - RADIUS : y,
        (Math.random() - .5) * DX_FACTOR,
        (Math.random() - .5) * DY_FACTOR,
        RADIUS,
        {
          fill: COLORS[Math.floor(Math.random() * 3) + 1],
          stroke: COLORS[Math.floor(Math.random() * 3) + 1]
        }
      ))
    }
  }

  init()
  animate()

  return function() {
    stop = true
  }
}

function Lines() {

  $('canvas').css({background: '#2E112D'})

  let stop = false

  let obj = getContext()
  const canvas = obj.canvas
  const c = obj.context

  const N = Math.floor((canvas.height * canvas.width) / 500)
  const LINE_WIDTH_FACTOR = 10
  const MIN_DISTANCE = 500
  const DECREASE_LINE_WIDTH_FACTOR = .1
  const COLORS = [
    '#F0433A', '#540032', '#820333', '#C9283E'
  ]

  function Line(x0, y0, x1, y1, dx, dy, color) {
    this.color = color
    this.x0 = x0
    this.y0 = y0
    this.x1 = x1
    this.y1 = y1
    this.dx = dx
    this.dy = dy
    this.lineWidth = 1
    this.minLineWidth = this.lineWidth
    this.maxLineWidth = this.lineWidth * LINE_WIDTH_FACTOR

    this.draw = function () {
      c.beginPath()
      c.moveTo(this.x0, this.y0)
      c.lineTo(this.x1, this.y1)
      c.strokeStyle = this.color
      c.lineWidth = this.lineWidth
      c.stroke()
    }

    this.update = function (mouse) {

      let distance = Math.abs(
        (this.y1 - this.y0) * mouse.x
        - (this.x1 - this.x0) * mouse.y
        + this.x1 * this.y0
        - this.y1 * this.x0
      ) / Math.sqrt(
        Math.abs(this.y1 - this.y0) ^ 2 +
        Math.abs(this.x1 - this.x0) ^ 2
      )

      if (distance < MIN_DISTANCE) {
        if (this.lineWidth < this.maxLineWidth) this.lineWidth += 1
      } else if (this.lineWidth > this.minLineWidth) {
        this.lineWidth -= DECREASE_LINE_WIDTH_FACTOR
      }

      if (this.y0 > canvas.height || this.y0 < 0)
        this.dy = -this.dy

      if (this.x0 > canvas.width || this.x0 < 0)
        this.dx = -this.dx

      if (this.x0 === 0 || this.x0 === canvas.width)
        this.y0 += this.dy
      else this.x0 += this.dx
    }
  }

  let mouse = {
    x: 0, y: 0
  }

  window.addEventListener('mousemove', function (event) {
    mouse.x = event.x
    mouse.y = event.y
  })

  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    init()
  })

  let lines = []

  function animate() {
    if (!stop) requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    lines.forEach(function (line) {
      line.draw()
      line.update(mouse)
    })
  }

  function getRandomXY() {
    let randomSide = Math.floor((Math.random() * 4) + 1)
    let xy = {}
    switch (randomSide) {
      case 1:
        xy.x = Math.random() * canvas.width
        xy.y = 0
        break
      case 2:
        xy.x = Math.random() * canvas.width
        xy.y = canvas.height
        break
      case 3:
        xy.x = 0
        xy.y = Math.random() * canvas.height
        break
      case 4:
        xy.x = canvas.width
        xy.y = Math.random() * canvas.height
        break
    }
    return xy
  }

  function init() {
    lines = []
    for (let i = 0; i < N; i++) {
      let xy = getRandomXY()
      lines.push(new Line(
        xy.x,
        xy.y,
        canvas.width / 2,
        canvas.height / 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        COLORS[Math.floor(Math.random() * 3) + 1]
      ))
    }
  }

  init()
  animate()

  return function() {
    stop = true
  }
}

function LTLogo() {

  $('canvas').css({background: '#FAFAFE'})

  let stop = false

  let obj = getContext()
  const canvas = obj.canvas
  const c = obj.context

  const X_REF = 24
  const Y_REF = 18
  const POINT_INTERVAL_CONSTANT = 100
  const POINT_MOVE_CONSTANT = 2
  const MAX_LINE_WIDTH_FACTOR = 15
  const MAX_RADIUS_FACTOR = 15
  const COLORS = [
    {r:214,g:14,b:3}, '#12283F', '#01465A', '#9CD4D3'
  ]

  function getX(x) {
    return Math.floor((x / X_REF) * canvas.width)
  }

  function getY(y) {
    return Math.floor((y / Y_REF) * canvas.height)
  }

  const L = [
    { x: 4, y: 3 },
    { x: 7, y: 3 },
    { x: 7, y: 12 },
    { x: 11, y: 12 },
    { x: 11, y: 15 },
    { x: 4, y: 15 },
    { x: 4, y: 3 }
  ]

  const T = [
    { x: 9, y: 3 },
    { x: 20, y: 3 },
    { x: 20, y: 6 },
    { x: 16, y: 6 },
    { x: 16, y: 15 },
    { x: 13, y: 15 },
    { x: 13, y: 6 },
    { x: 9, y: 6 },
    { x: 9, y: 3 }
  ]

  function getPoints(coordinates) {
    let points = []

    let lastPoint = {
      x: getX(coordinates[0].x),
      y: getY(coordinates[0].y)
    }
    for (let i = 1; i < coordinates.length; i++) {
      let currentPoint = {
        x: getX(coordinates[i].x),
        y: getY(coordinates[i].y)
      }
      let intervalX = (currentPoint.x - lastPoint.x) / POINT_INTERVAL_CONSTANT
      let intervalY = (currentPoint.y - lastPoint.y) / POINT_INTERVAL_CONSTANT

      for (let j = 0; j < POINT_INTERVAL_CONSTANT; j++) {
        points.push({
          x: lastPoint.x + intervalX * j,
          y: lastPoint.y + intervalY * j
        })
      }

      lastPoint = currentPoint
    }

    return points
  }

  function drawLetter(c, points, radius, color) {
    for (let i = 0; i < points.length; i++) {
      c.beginPath()
      c.arc(
        ((Math.random() - 0.5) * POINT_MOVE_CONSTANT) + points[i].x,
        ((Math.random() - 0.5) * POINT_MOVE_CONSTANT) + points[i].y,
        radius, 0, Math.PI * 2)
      c.fillStyle = color
      c.lineWidth = 1
      c.fill()
    }
  }

  function drawRandomLines(c, points, lineWidth) {
    for (let i = 0; i < (Math.random() * points.length * 100); i++) {
      let point1 = points[Math.floor(Math.random() * (points.length - 1))]
      let point2 = points[Math.floor(Math.random() * (points.length - 1))]

      if (Math.abs(point1.x - point2.x) <= 5) {

        c.beginPath()
        c.moveTo(point1.x, point1.y)
        c.lineTo(point2.x, point2.y)
        c.strokeStyle = COLORS[1]
        c.lineWidth = Math.random() * lineWidth
        c.stroke()
      }
    }
  }

  function LTLogo(LPoints, TPoints) {
    this.LPoints = LPoints
    this.TPoints = TPoints
    this.lineWidth = 1
    this.minLineWidth = this.lineWidth
    this.maxLineWidth = MAX_LINE_WIDTH_FACTOR
    this.radius = 2
    this.minRadius = this.radius
    this.maxRadius = MAX_RADIUS_FACTOR
    this.colorObj = COLORS[0]
    this.startColorObj = this.colorObj

    this.draw = function () {

      drawLetter(c,
        this.LPoints,
        this.radius,
        'rgb(' + this.colorObj.r + ',' + this.colorObj.g + ',' + this.colorObj.b + ')')
      drawLetter(c,
        this.TPoints,
        this.radius,
        'rgb(' + this.colorObj.r + ',' + this.colorObj.g + ',' + this.colorObj.b + ')')

      drawRandomLines(c, this.LPoints, this.lineWidth)
      drawRandomLines(c, this.TPoints, this.lineWidth)
    }

    this.update = function (mouse) {
      this.maxLineWidth = (mouse.y / canvas.height) * MAX_LINE_WIDTH_FACTOR
      if (this.lineWidth < this.maxLineWidth) this.lineWidth += .5
      else if (this.lineWidth > this.minLineWidth) this.lineWidth -= .2

      this.maxRadius = (mouse.x / canvas.width) * MAX_RADIUS_FACTOR
      if (this.radius < this.maxRadius) this.radius += 1
      else if (this.radius > this.minRadius) this.radius -= .2

      let circlesColor = mouse.x / canvas.width
      this.colorObj = Math.random() > 0.99 ? {
        r: Math.abs(Math.floor(this.startColorObj.r + ((Math.random() - 0.5) * 200) * circlesColor)),
        g: Math.abs(Math.floor(this.startColorObj.g + ((Math.random() - 0.5) * 200) * circlesColor)),
        b: Math.abs(Math.floor(this.startColorObj.b + ((Math.random() - 0.5) * 200) * circlesColor))
      } : this.colorObj
    }
  }

  let mouse = {
    x: 0, y: 0
  }

  window.addEventListener('mousemove', function (event) {
    mouse.x = event.x
    mouse.y = event.y
  })

  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    init()
  })

  let logos = []

  function animate() {
    if (!stop) requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    logos.forEach(function (logo) {
      logo.draw()
      logo.update(mouse)
    })
  }

  function init() {
    logos = []
    logos.push(new LTLogo(getPoints(L), getPoints(T)))
  }

  init()
  animate()

  return function() {
    stop = true
  }
}

let stop
function Stop() {
  if (stop) stop()
}
function Start(animationFunc) {
  $('.pane .title')[0].classList.add('title-display')
  stop = animationFunc()
}

$(document).ready(function () {

  $('#animation-1')[0].addEventListener('click', function () {
    Stop()
    Start(Bubbles)
  })

  $('#animation-2')[0].addEventListener('click', function () {
    Stop()
    Start(Lines)
  })

  $('#animation-3')[0].addEventListener('click', function () {
    Stop()
    Start(LTLogo)
  })

})