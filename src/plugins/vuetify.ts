import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const customTheme = {
    dark: false,
    colors: {
        primary: '#364cf5', // Mavi (card içindeki ana renk)
        secondary: '#2C3E50', // Koyu mavi (footer rengi)
        background: '#edf1f6', // Açık gri-mavi arka plan
        surface: '#FFFFFF',
        error: '#F44336',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        header: '#2b3dc4', // Header mavi rengi
    },
}

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'customTheme',
        themes: {
            customTheme,
        },
    },
})