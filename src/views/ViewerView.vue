<script setup>
import Footer from '@/components/Footer.vue'
import ViewerFileChooser from '@/components/ViewerFileDialog.vue'
import StatsViewer from '@/components/StatsViewer.vue'
import { AllApplication, People, RelationalGraph } from '@icon-park/vue-next'
import { encode } from 'plantuml-encoder'
import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'

const i18n = useI18n()

let rawStats = ref()
let parsedStats = ref()
function remove(obj, key) {
  const value = obj[key]
  delete obj[key]
  return value
}
function divMod(a, b) {
  return [Math.floor(a / b), a % b]
}
function createGraph(url, title) {
  return { url, title }
}
async function processParsedStats(stats) {
  // Difficulty
  stats.round.difficulty = {
    0: 'easy',
    1: 'normal',
    2: 'hard',
    3: 'expert',
  }[stats.round.difficulty]

  // Playing time
  let playingTimeText = []
  let temp = divMod(stats.round.playing_second, 2629743)
  if (temp[0]) {
    playingTimeText.push(temp[0], 'M')
  }
  stats.round.playing_second = temp[1]
  temp = divMod(stats.round.playing_second, 86400)
  if (temp[0]) {
    playingTimeText.push(temp[0], 'D')
  }
  stats.round.playing_second = temp[1]
  temp = divMod(stats.round.playing_second, 3600)
  if (temp[0]) {
    playingTimeText.push(temp[0], 'h')
  }
  console.log(temp)
  stats.round.playing_second = temp[1]
  temp = divMod(stats.round.playing_second, 60)
  if (temp[0]) {
    playingTimeText.push(temp[0], 'm')
  }
  stats.round.playing_second = temp[1]
  if (stats.round.playing_second) {
    playingTimeText.push(stats.round.playing_second, 's')
  }
  stats.round.playing_second = playingTimeText.join(' ')

  // Graphs
  const plantumlUrl = 'https://www.plantuml.com/plantuml/svg/'
  stats.graphs = []
  // Teammate event relationships
  if (Object.keys(stats.players).length > 1) {
    let relationshipsText = `@startuml\ntitle ${i18n.t('graph_title.teammate_event_relationships')}\n`
    let plantuml = ''
    for (const slot in stats.players) {
      if (Object.prototype.hasOwnProperty.call(stats.players, slot)) {
        const player = stats.players[slot]

        relationshipsText += `actor "${player.name}" as ${slot}\n`
        for (const teammateSlot in player.teammate) {
          if (Object.prototype.hasOwnProperty.call(player.teammate, teammateSlot)) {
            const teammate = player.teammate[teammateSlot]

            plantuml += `group ${player.name} → ${teammate.name}\n`
            for (const k in teammate) {
              if (k == 'name') {
                continue
              }
              if (Object.prototype.hasOwnProperty.call(teammate, k)) {
                const v = teammate[k]

                plantuml += `${slot} -> ${teammateSlot} : ${i18n.t('stats_name.object_counter.' + k)} ${v == 0 ? '<font color="blue">' : '<font color="red">'}<b>${v}\n`
              }
            }
            plantuml += `end\n`
          }
        }
      }
    }
    relationshipsText += plantuml + '@enduml'
    console.log('teammate event relationships graph text:', relationshipsText)
    stats.graphs.push(
      createGraph(
        plantumlUrl + encode(relationshipsText),
        'graph_title.teammate_event_relationships',
      ),
    )
  }
  // Infection event relationships
  const passiveMatcher = /^(be|make|take)_/
  for (const slot in stats.players) {
    if (Object.prototype.hasOwnProperty.call(stats.players, slot)) {
      const player = stats.players[slot]

      let plantuml = `@startuml\ntitle "${i18n.t('graph_title.infection_event_relationships')}"\nactor "${player.name}" as player\n`
      for (const name in player.infected) {
        if (Object.prototype.hasOwnProperty.call(player.infected, name)) {
          const infection = player.infected[name]

          const infected_name = i18n.t('stats.' + name)
          plantuml += `entity "${infected_name}" as ${name}\ngroup ${infected_name}\n`
          for (const k in infection) {
            if (Object.prototype.hasOwnProperty.call(infection, k)) {
              const v = infection[k]

              plantuml += `player ${passiveMatcher.test(k) ? '<<-' : '->'} ${name} : ${i18n.t('stats_name.object_counter.' + k)} ${v == 0 ? '<font color="blue">' : '<font color="red">'}<b>${v}\n`
            }
          }
          plantuml += 'end\n'
        }
      }
      stats.graphs.push(
        createGraph(plantumlUrl + encode(plantuml), 'graph_title.infection_event_relationships'),
      )
    }
  }

  return stats
}
async function _parseStats(content) {
  const players = {}
  content.split('\n').forEach((line) => {
    line = line.trim()
    if (!line) {
      return
    }

    let [key, value] = line.split('=', 2)
    key = key.trim()
    // StringToFile() in L4D2 VScript always adds an null character at the end of file
    if (!key || key == '\x00') {
      return
    }
    if (key.endsWith('|')) {
      key = key.slice(undefined, key.length - 1)
    }
    if (value) {
      value = value.trim()
    }

    let tempValue = players
    key.split('.').forEach((key, i, arr) => {
      if (typeof tempValue == 'object' && Object.prototype.hasOwnProperty.call(tempValue, key)) {
        tempValue = tempValue[key]
        return
      }

      if (i == arr.length - 1) {
        switch (value) {
          case '<null>':
            tempValue[key] = null
            break

          case 'true':
            tempValue[key] = true
            break

          case 'false':
            tempValue[key] = false
            break

          default:
            if (isNaN(value)) {
              tempValue[key] = value
              break
            }
            tempValue[key] = parseFloat(value)
        }
        return
      }

      tempValue[key] = {}
      tempValue = tempValue[key]
    })
  })

  const round = {}

  ;[
    'difficulty',
    'file_type',
    'finale_win',
    'gamemode',
    'infected_die',
    'map',
    'playing_second',
    'restart',
  ].forEach((key) => (round[key] = remove(players, key)))

  if (round.file_type != 'pst_stats_file') {
    throw new Error('file type is not correct')
  }
  delete round.file_type

  return await processParsedStats({ players, round })
}
function parseStats(content) {
  if (!content) {
    return
  }

  rawStats.value = content
  _parseStats(content)
    .then((value) => {
      parsedStats.value = value
      console.log('parsed successfully')
      console.log(value)
    })
    .catch((err) => {
      console.error('parsing failed:', err)
      parsedStats.value = 'error'
    })
}

watch(i18n.locale, () => parseStats(rawStats.value))
</script>

<template>
  <div id="main">
    <header>
      <h1>{{ $t('site.title') }}</h1>
      <h2>{{ $t('site.subtitle') }}</h2>
    </header>

    <main>
      <ViewerFileChooser @input="parseStats" @open="parsedStats = null" />
      <hr />
      <span class="error-tip" v-if="parsedStats == 'error'">{{ $t('viewer.parsing_failed') }}</span>
      <ul class="viewers" v-else-if="parsedStats">
        <StatsViewer
          :content="parsedStats.round"
          v-motion
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1 }"
          :delay="100"
          :duration="150"
        >
          <AllApplication
            theme="filled"
            size="76"
            fill="#fff"
            strokeLinejoin="bevel"
            strokeLinecap="square"
          />
        </StatsViewer>
        <StatsViewer
          :content="parsedStats.graphs"
          v-if="parsedStats.graphs"
          v-motion
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1 }"
          :delay="200"
          :duration="150"
        >
          <RelationalGraph
            theme="filled"
            size="76"
            fill="#fff"
            strokeLinejoin="bevel"
            strokeLinecap="square"
          />
        </StatsViewer>
        <StatsViewer
          v-for="(v, i) in parsedStats.players"
          :key="i"
          :content="v"
          :ignore="['teammate', 'name', 'infected']"
          v-motion
          :initial="{ opacity: 0 }"
          :enter="{ opacity: 1 }"
          :delay="100 * (i + 2)"
          :duration="150"
        >
          <span class="name" style="font-size: 1.6rem; font-weight: bolder">{{ v.name }}</span>
          <People
            theme="filled"
            size="76"
            fill="#fff"
            strokeLinejoin="bevel"
            strokeLinecap="square"
          />
        </StatsViewer>
      </ul>
    </main>

    <Footer />
  </div>
</template>

<style lang="less" scoped>
@import '@/assets/vars.less';

header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100em;

  h1 {
    margin-bottom: 1em;
    font-size: 4rem;
    color: @content-2;
  }
  h2 {
    margin-bottom: 1em;
    font-size: 2rem;
    color: @content-3;
  }
}

main {
  text-align: center;

  @media screen and (min-width: 1024px) {
    width: 1024px;
  }

  .viewers {
    display: flex;
    flex-direction: column;
    padding: 0;
    list-style: none;
    gap: 0.4em;
  }
}
</style>
