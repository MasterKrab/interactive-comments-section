import '../scss/styles.scss'
import { load } from 'webfontloader'
import './custom-elements/time-ago'
import loadPage from './lib/load-page'

load({
  google: {
    families: ['Rubik', 'Fira code'],
  },
})

loadPage()
