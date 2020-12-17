<template>
  <div class="muya-container" ref="container">
    <div style="text-align: left" ref="editor" />
  </div>
</template>

<script>
import Muya from '@/muya/lib'
import TablePicker from '@/muya/lib/ui/tablePicker'
import QuickInsert from '@/muya/lib/ui/quickInsert'
import CodePicker from '@/muya/lib/ui/codePicker'
import EmojiPicker from '@/muya/lib/ui/emojiPicker'
import ImagePathPicker from '@/muya/lib/ui/imagePicker'
import ImageSelector from '@/muya/lib/ui/imageSelector'
import FormatPicker from '@/muya/lib/ui/formatPicker'
import FrontMenu from '@/muya/lib/ui/frontMenu'
import MttagPicker from '@/muya/lib/ui/mttagPicker'
import Transformer from '@/muya/lib/ui/transformer'
import ImageToolbar from '@/muya/lib/ui/imageToolbar'
import LinkTools from '@/muya/lib/ui/linkTools'
import FootnoteTool from '@/muya/lib/ui/footnoteTool'
import TableBarTools from '@/muya/lib/ui/tableTools'

//import '@/muya/themes/default.css'

/*
Only one instance of Muya can exist in the page because it users "id"
attributes of elements (see: https://github.com/marktext/muya/issues/9)
To overcome this limitation, we instantiate Muya only the first time it is
used and then reuse always the same instance updating its position in the DOM,
the content and the event listeners. This cannot be done only in the mounted()
hook because in case the component is hidden and then re-shown (e.g. a dialog),
mounted() will not be called.
*/
var MUYA_INSTANCE = null

export default {
  name: 'MarkdownEditor',
  props: {
    modelValue: String,
    shown: Boolean
  },
  data() {
    return {
      editor: null,
      text: null
    }
  },
  methods: {
    activate() {
      if (!MUYA_INSTANCE) {
        this.createMuyaEditor()
      } else {
        this.moveHereMuyaEditor()
      }
      this.initMuyaEditor()
    },
    createMuyaEditor() {
      if (MUYA_INSTANCE) {
        console.warn(
          'Muya Editor already instantiated. Call initMuyaEditor() instead'
        )
        return
      }

      Muya.use(TablePicker)
      Muya.use(QuickInsert)
      Muya.use(CodePicker)
      Muya.use(MttagPicker, { getTags: () => {} })
      Muya.use(EmojiPicker)
      Muya.use(ImagePathPicker)
      Muya.use(ImageSelector, {
        unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY,
        photoCreatorClick: this.photoCreatorClick
      })
      Muya.use(Transformer)
      Muya.use(ImageToolbar)
      Muya.use(FormatPicker)
      Muya.use(FrontMenu)
      Muya.use(LinkTools, {
        jumpClick: this.jumpClick
      })
      Muya.use(FootnoteTool)
      Muya.use(TableBarTools)

      const ele = this.$refs.editor
      MUYA_INSTANCE = new Muya(ele, {
        markdown: 'Welcoeme to Muya'
      })
    },
    initMuyaEditor() {
      this.editor = MUYA_INSTANCE
      this.editor.setMarkdown(this.modelValue || '')
      this.editor.on('change', this.handleTextChanged)
    },
    moveHereMuyaEditor() {
      let oldListeners = MUYA_INSTANCE.eventCenter.listeners.change
      if (oldListeners) {
        oldListeners.forEach(l => MUYA_INSTANCE.off('change', l.listener))
      }
      let elem = MUYA_INSTANCE.container.parentNode.removeChild(
        MUYA_INSTANCE.container
      )
      this.$refs.container.appendChild(elem)
    },
    handleTextChanged(event) {
      this.$emit('update:modelValue', event.markdown)
    }
  },
  watch: {
    /*
    modelValue(val) {
      if (typeof val == 'undefined') return
      if (val !== this.editor.markdown) {
        console.debug('MDEDITOR', 'Updating content')
        this.editor.setMarkdown(val)
      }
    },
    */
    shown(val) {
      if (val) {
        console.log('MUYA EDITOR SHOWN')
        this.activate()
      }
    }
  },
  mounted() {
    this.activate()
  }
}
</script>
<style scoped>
@import '../muya/themes/default-scoped.css'
</style>
