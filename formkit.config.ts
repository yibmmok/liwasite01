import "@formkit/themes/genesis"
import { genesisIcons } from "@formkit/icons"
import { defineFormKitConfig } from '@formkit/vue'

export default defineFormKitConfig({
  icons: { ...genesisIcons }
})
