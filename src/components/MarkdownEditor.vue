<template>
  <div class="markdown-editor">
    <div v-show="editor" ref="muyaContainer"></div>
    <div v-show="!editor" @click="activate()" ref="muyaPlaceholder"></div>
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

/*
Only one instance of Muya can exist in the page because it users "id"
attributes of elements (see: https://github.com/marktext/muya/issues/9)
To overcome this limitation, we instantiate Muya only the first time it is
used and then reuse always the same instance updating its position in the DOM,
replacing the content and the event listeners.
*/

// keep a reference to the MUYA instance
var MUYA_INSTANCE = null

// keep a reference to the MarkdownEditor component that currently has the
// Muya instance in it
var ACTIVE_EDITOR = null

export default {
  name: 'MarkdownEditor',
  props: {
    modelValue: String
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.activate()
  },
  methods: {
    activate() {
      ACTIVE_EDITOR?._deactivateMuya()
      this._activateMuya()
    },
    _createMuyaInstance() {
      Muya.use(TablePicker)
      Muya.use(QuickInsert)
      Muya.use(CodePicker)
      Muya.use(MttagPicker, { getTags: () => {} })
      Muya.use(EmojiPicker)
      Muya.use(ImagePathPicker)
      Muya.use(ImageSelector, {
        unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY
      })
      Muya.use(Transformer)
      Muya.use(ImageToolbar)
      Muya.use(FormatPicker)
      Muya.use(FrontMenu)
      Muya.use(LinkTools, {})
      Muya.use(FootnoteTool)
      Muya.use(TableBarTools)

      const ele = document.createElement('div')
      document.body.appendChild(ele)
      return new Muya(ele, {
        markdown: 'Welcoeme to Muya'
      })
    },
    _getMuyaInstance() {
      if (!MUYA_INSTANCE) {
        MUYA_INSTANCE = this._createMuyaInstance()
      }
      return MUYA_INSTANCE
    },
    _activateMuya() {
      this.editor = this._getMuyaInstance()
      this.$refs.muyaContainer.appendChild(this.editor.container)
      this.$refs.muyaPlaceholder.innerHTML = ""
      this.editor.setMarkdown(this.modelValue || '')
      this.editor.on('change', this.handleTextChanged)
      ACTIVE_EDITOR = this
    },
    _deactivateMuya() {
      this.editor.off('change', this.handleTextChanged)
      this.$refs.muyaPlaceholder?.insertAdjacentHTML('afterbegin', this.editor.container.firstChild.innerHTML)
      // not really necessary since the appendChild() (called in _activateMuya()) will also remove the element if it attached to the DOM
      this.$refs.muyaContainer?.removeChild(this.editor.container)
      this.editor = undefined
    },
    handleTextChanged(event) {
      this.$emit('update:modelValue', event.markdown)
    }
  }
}
</script>
<style scoped>
@import '../muya/themes/default-scoped.css'
</style>
