import type { Register } from 'claude-code'

const ACCENT = '#D97757'
const INK = '#1F1E1C'

const style = `
.b{animation:bob 3.2s ease-in-out infinite;transform-origin:20px 44px}
@keyframes bob{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-3px) rotate(-4deg)}50%{transform:translateY(-4px) rotate(0)}75%{transform:translateY(-3px) rotate(4deg)}}
.s{animation:sq 3.2s ease-in-out infinite;transform-origin:20px 47px}
@keyframes sq{0%,100%{transform:scaleX(1);opacity:.18}50%{transform:scaleX(.75);opacity:.1}}
.e{animation:bl 4.6s infinite;transform-box:fill-box;transform-origin:center}
@keyframes bl{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
.t .b{animation:think 1.4s ease-in-out infinite}
@keyframes think{0%,100%{transform:translateY(-2px) rotate(-8deg)}50%{transform:translateY(-5px) rotate(8deg)}}
.t .e{animation:look 1.4s ease-in-out infinite}
@keyframes look{0%,100%{transform:translate(-1.5px,-3px)}50%{transform:translate(1.5px,-3px)}}
.d{opacity:.2;animation:dot 1.2s infinite}
.d2{animation-delay:.2s}.d3{animation-delay:.4s}
@keyframes dot{0%,100%{opacity:.2}40%{opacity:1}}
`

function hexagon(isThinking: boolean): string {
  const dots = isThinking
    ? `<rect class="d" x="44" y="10" width="4" height="4" fill="${ACCENT}"/>` +
      `<rect class="d d2" x="51" y="10" width="4" height="4" fill="${ACCENT}"/>` +
      `<rect class="d d3" x="58" y="10" width="4" height="4" fill="${ACCENT}"/>`
    : ''
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="66" height="50" viewBox="0 0 66 50" class="${isThinking ? 't' : ''}">` +
    `<style>${style}</style>` +
    `<ellipse class="s" cx="20" cy="47" rx="12" ry="1.8" fill="${INK}"/>` +
    `<g class="b">` +
    `<polygon points="20,2 37,12 37,32 20,42 3,32 3,12" fill="${ACCENT}"/>` +
    `<rect class="e" x="12" y="18" width="4" height="7" fill="${INK}"/>` +
    `<rect class="e" x="24" y="18" width="4" height="7" fill="${INK}"/>` +
    `</g>` +
    dots +
    `</svg>`
  )
}

const IDLE = hexagon(false)
const THINKING = hexagon(true)

export const register: Register = on => {
  on('ui.render', { component: 'AbovePrompt' }, ($, e, next) => {
    if (e.props.hasSurvey) {
      return next(e)
    }

    const isThinking = e.props.isWorking
    const ui = $.ui.resolve(e)

    if ('Svg' in ui) {
      const { Box, Svg } = ui
      return (
        <Box>
          <Svg
            source={isThinking ? THINKING : IDLE}
            alt={isThinking ? 'Sechseck überlegt' : 'Sechseck wartet'}
            width={66}
            height={50}
            isInteractive
          />
        </Box>
      )
    }

    const { Box, Text } = ui
    return (
      <Box>
        <Text color={ACCENT}>⬢ </Text>
        <Text dimColor>{isThinking ? 'überlegt mit …' : ''}</Text>
      </Box>
    )
  })
}
