import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import 'quill/dist/quill.snow.css'
import '../assets/styles/berry-theme.css'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: 'berry',
    themes: {
      berry: {
        dark: false,
        colors: {
          // Berry theme primary colors
          primary: '#5e72e4',
          secondary: '#8392ab',
          accent: '#fb6340',
          error: '#f5365c',
          warning: '#fb6340',
          info: '#11cdef',
          success: '#2dce89',
          
          // Berry theme extended colors
          background: '#f8f9fe',
          surface: '#ffffff',
          'surface-variant': '#f8f9fe',
          'on-surface-variant': '#8392ab',
          
          // Text colors
          'on-primary': '#ffffff',
          'on-secondary': '#ffffff',
          'on-background': '#344767',
          'on-surface': '#344767',
          
          // Additional Berry colors
          'primary-lighten-1': '#738ffe',
          'primary-darken-1': '#4c63d2',
          'grey-50': '#f8f9fe',
          'grey-100': '#f0f2f5',
          'grey-200': '#e9ecef',
          'grey-300': '#dee2e6',
          'grey-400': '#ced4da',
          'grey-500': '#adb5bd',
          'grey-600': '#6c757d',
          'grey-700': '#495057',
          'grey-800': '#343a40',
          'grey-900': '#212529'
        }
      },
      'berry-dark': {
        dark: true,
        colors: {
          // Berry dark theme primary colors
          primary: '#738ffe',
          secondary: '#a0a9c0',
          accent: '#ff8a65',
          error: '#ff6b8a',
          warning: '#ff8a65',
          info: '#40c4ff',
          success: '#4caf50',
          
          // Berry dark theme backgrounds
          background: '#0f1419',
          surface: '#1a1f2e',
          'surface-variant': '#232940',
          'on-surface-variant': '#a0a9c0',
          
          // Text colors for dark theme
          'on-primary': '#ffffff',
          'on-secondary': '#ffffff',
          'on-background': '#e8eaed',
          'on-surface': '#e8eaed',
          
          // Additional dark colors
          'primary-lighten-1': '#8c9eff',
          'primary-darken-1': '#5c6bc0',
          'grey-50': '#232940',
          'grey-100': '#2d3446',
          'grey-200': '#37404d',
          'grey-300': '#424b57',
          'grey-400': '#4d5661',
          'grey-500': '#58606b',
          'grey-600': '#646b75',
          'grey-700': '#70767f',
          'grey-800': '#7c8289',
          'grey-900': '#888e94'
        }
      },
      light: {
        colors: {
          primary: '#5e72e4',
          secondary: '#8392ab',
          accent: '#fb6340',
          error: '#f5365c',
          info: '#11cdef',
          success: '#2dce89',
          warning: '#fb6340'
        }
      }
    }
  }
})