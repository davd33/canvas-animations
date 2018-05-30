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

    lines.forEach(function (circle) {
      circle.draw()
      circle.update(mouse)
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

})