import "@formkit/themes/genesis"
import { genesisIcons } from "@formkit/icons"
import { defineFormKitConfig, createInput } from '@formkit/vue'
import liwaDrop from "./components/liwaDrop.vue"
import liwaCombo from "./components/liwaCombo.vue"

export default defineFormKitConfig({
  inputs: {
    liwaDrop: createInput(liwaDrop, {
      props: ['sVal', 'arrOption'],
    }),
    liwaCombo: createInput(liwaCombo, {
      props: ['sVal', 'arrOption'],
    }),   
  },  
  icons: { ...genesisIcons }
})
