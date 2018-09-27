const { wrapper, inner, slide, indicators, indicatorItem, controller, nextCtrl, prevCtrl } = DomClasses

class SliderController {
  constructor(ele, opts) {
    this.el = ele
    this.$el = $(this.el)
    this.$slider = ''

    this.totalSlide = this.$el.children().length

    this.opts = opts
    this.defaultOpts = {
      autoPlay: false,
      autoPlayDelay: 3000,
      duration: 450
    }

    this.autoTimeoutId = ''
    this.active = false
    this.curr = 0
    this.duration = this.opts.duration || this.defaultOpts.duration
    this.initialize()
  }

  setAutoPlay() {
    if (this.opts.autoPlay) {
      const delay = this.opts.autoPlayDelay || this.defaultOpts.autoPlayDelay

      this.clearAutoPlay()
      this.autoTimeoutId = setTimeout(() => {
        this.moveSlide('next')
        this.setAutoPlay()
      }, delay)
    }
  }

  clearAutoPlay() {
    clearTimeout(this.autoTimeoutId)
  }

  initialize() {
    console.log("Init new PF Slider")

    this.updateSliderDOM()
    this.setAutoPlay()
    console.log(this)
    return this
  }

  updateSliderDOM() {
    this.$el.addClass(wrapper)

    // create an inner div to wrap all slide item
    const $inner = $(`<div class=${inner}></div>`)
    this.$el.children().each((i, child) => {
      $(child).addClass(slide)
      if (i === this.curr) {
        $(child).css('left', '0')
      }
      $inner.append(child)
    })

    // save the inner DOM
    this.$slider = $inner

    // append indicators n controllers
    const $nextCtrl = $('<button>Next</button>')
    $nextCtrl.on('click', () => this.next.apply(this))

    const $prevCtrl = $('<button>Prev</button>')
    $prevCtrl.on('click', () => this.prev.apply(this))

    const $indicators = $('<ol></ol>')

    this.$el.append($inner).append($indicators).append($prevCtrl).append($nextCtrl)
  }

  next() {
    if (this.active) return
    this.clearAutoPlay()
    this.active = true
    this.moveSlide("next")
  }

  prev() {
    if (this.active) return
    this.clearAutoPlay()
    this.active = true
    this.moveSlide("prev")
  }

  moveSlide(direction, toIndex) {
    let currIndex = this.curr
    let { nextIndex, nextSlidePos, currSlidePos } = getSlideMovementData(direction, currIndex, toIndex, this.totalSlide)

    let $curr = this.$slider.children().eq(currIndex)
    let $next = this.$slider.children().eq(nextIndex)

    $next.css({ 'transition': '' })
    $next.css('left', nextSlidePos)

    setTimeout(() => {
      $curr.css({ 'transition': `left ${this.duration}ms ease-in-out`, 'left': currSlidePos })
      $next.css({ 'transition': `left ${this.duration}ms ease-in-out`, 'left': '0' })
      setTimeout(() => {
        this.setAutoPlay()
        this.active = false
      }, this.duration)
    }, 20)

    this.curr = nextIndex
  }

  goto(index) {
    this.clearAutoPlay()

    if (index > this.curr) {
      this.moveSlide("next", index)
    } else if (index < this.curr) {
      this.moveSlide("prev", index)
    }
  }
}